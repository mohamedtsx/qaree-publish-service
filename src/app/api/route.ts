import { type NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/graphql";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: NextRequest) {
	const reqBody = (await req.json()) as {
		method?: "POST";
		cache?: RequestCache;
		headers?: HeadersInit;
		body: BodyInit;
		protectid?: boolean;
	};

	const session = await getServerSession(authOptions);
	if (reqBody.protectid && !session) return;

	const res = await fetch(BACKEND_URL, {
		method: reqBody.method || "POST",
		headers: {
			"Content-Type": "application/json",
			accept: "application/json",
			Authorization: `Bearer ${session?.user.access_token}`,
		},
		body: reqBody.body,
		cache: reqBody.cache,
	});

	const returnedData = await res.json();

	return NextResponse.json(returnedData);
}
