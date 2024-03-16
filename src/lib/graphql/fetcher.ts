import { print } from "graphql";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";

import { env } from "../env";
import type { ApiResponse } from "./types";

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

		const data = (await res.json()).data as Result;

		return {
			status: res.status,
			data,
		};
	} catch (error) {
		throw {
			error,
		};
	}
}
