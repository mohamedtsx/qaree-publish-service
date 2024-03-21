import { print } from "graphql";

import { env } from "../../env";
import { FetcherError, createCustomError } from "./errors";
import type { ResultOf, TadaDocumentNode, VariablesOf } from "gql.tada";
import type { ApiResponse } from "./types";

const endpoint = env.NEXT_PUBLIC_BACKEND_URL;

/**
 * This function will return the data from the API
 * or throw either Error or FetcherError
 * we catch the error and show a toaster in the client
 * we catch the error and throw error if env === 'development'
 * if not 'development' & not client we do nothing
 */

// todo handel server false case
export async function fetcher<
	T extends TadaDocumentNode<ResultOf<T>, VariablesOf<T>>,
>({
	cache = "force-cache",
	headers,
	query,
	variables,
	server,
}: {
	cache?: RequestCache;
	headers?: HeadersInit;
	query: T;
	variables?: VariablesOf<T>;
	server: boolean;
}): Promise<ResultOf<T>> {
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

		const resData = (await res.json()) as ApiResponse<ResultOf<T>>;

		if ("errors" in resData) {
			throw new FetcherError(resData.errors[0].message);
		}

		return resData.data;
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
