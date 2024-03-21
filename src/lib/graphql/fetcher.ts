import { print } from "graphql";

import { FetcherError, createCustomError } from "./errors";
import type { ResultOf, TadaDocumentNode, VariablesOf } from "gql.tada";
import type { ApiResponse } from "./types";

import { BACKEND_URL } from ".";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions";
import { redirect } from "next/navigation";

/**
 * This function will return the data from the API
 * or throw either Error or FetcherError
 * we catch the error and show a toaster in the client
 * we catch the error and throw error if env === 'development'
 * if not 'development' & not client we do nothing
 */
export async function fetcher<
	T extends TadaDocumentNode<ResultOf<T>, VariablesOf<T>>,
>({
	cache = "force-cache",
	headers,
	query,
	variables,
	server = false,
	protectid = true,
}: {
	cache?: RequestCache;
	headers?: HeadersInit;
	query: T;
	variables?: VariablesOf<T>;
	server?: boolean;
	protectid?: boolean;
}): Promise<ResultOf<T>> {
	try {
		const session = await getServerSession(authOptions);
		if (!session && protectid) {
			redirect(authOptions.pages?.signIn || "/signin");
		}

		const res = await fetch(BACKEND_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${session?.user.access_token}`,
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
