import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";

import { env } from "../../env";
import { FetcherError, createCustomError } from "./errors";
import type { ApiResponse, GraphQLError } from "./types";

const endpoint = env.NEXT_PUBLIC_BACKEND_URL;

export async function fetcher<Result, Variables>({
	cache = "force-cache",
	headers,
	query,
	variables,
}: {
	cache?: RequestCache;
	headers?: HeadersInit;
	query: TypedDocumentNode<Result, Variables>;
	variables?: Variables;
}): Promise<ApiResponse<Result>> {
	try {
		const res = await fetch(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...headers,
			},
			body: JSON.stringify({
				query: print(query),
				variables,
			}),
			cache,
		});

		const resData = (await res.json()) as
			| ApiResponse<Result>
			| GraphQLError<Result>;

		if ("errors" in resData) {
			throw new FetcherError(resData.errors[0].message);
		}

		const result = resData.data;

		return {
			status: res.status,
			data: result,
		};
	} catch (error) {
		if (error instanceof SyntaxError) {
			// The backend returned an invalid JSON <!doctype...>
			throw createCustomError(
				"Error occurred while getting data from the server",
			);
		}

		throw Error(
			error instanceof Error
				? error.message
				: typeof error === "string"
				  ? error
				  : "Unknown error",
		);
	}
}
