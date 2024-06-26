import { print } from "graphql";

import type { ResultOf, TadaDocumentNode, VariablesOf } from "gql.tada";
import { FetcherError, createCustomError } from "./errors";
import type { ApiResponse } from "./types";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { BACKEND_URL } from ".";
import { authOptions } from "../authOptions";

/**
 * This function will return the data from the API,
 * throw either Error or FetcherError or undefined (when redirect)
 * we catch the error and show a toaster in the client
 * we catch the error and throw error if env === 'development'
 * if not 'development' & not client we do nothing
 * we have unhandled type error when redirect
 */

interface TypeOptions<T> {
  headers?: HeadersInit;
  query: T;
  variables?: VariablesOf<T>;
  server?: boolean;
  protectid?: boolean;
  revalidate?: number;
  tags?: Array<string>;
}

export async function fetcher<
  T extends TadaDocumentNode<ResultOf<T>, VariablesOf<T>>
>({
  headers,
  query,
  variables,
  server = false,
  protectid = true,
  revalidate = 3600,
  tags,
}: TypeOptions<T>): Promise<ResultOf<T>> {
  let res: Response;

  const session = server ? await getServerSession(authOptions) : null;

  try {
    if (server) {
      if (!session && protectid) {
        throw Error("Authentication Error");
      }

      res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${session?.user.access_token}`,
          ...headers,
        },
        body: JSON.stringify({
          query: print(query),
          variables,
        }),
        next: {
          // TODO: update revalidate
          revalidate: 0,
          tags,
        },
      });
    } else {
      res = await fetch("/api", {
        method: "POST",
        body: JSON.stringify({
          body: JSON.stringify({
            query: print(query),
            variables,
          }),
          protectid,
          ...headers,
        }),
      });
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      // The backend returned an invalid JSON <!doctype...>
      throw createCustomError(
        "Error occurred while getting data from the server"
      );
    }

    throw Error(
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : "Unknown error"
    );
  }

  const resData = (await res.json()) as ApiResponse<ResultOf<T>>;

  if ("errors" in resData) {
    throw new FetcherError(resData.errors[0].message);
  }

  return resData.data;
}
