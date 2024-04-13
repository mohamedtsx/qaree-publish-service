import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/authOptions";
import { BACKEND_BASE_URL } from "@/lib/graphql";

export async function POST(req: NextRequest) {
	const user = await getCurrentUser();
	const formData = await req.formData();

	const searchParams = req.nextUrl.searchParams;

	const options = {
		path: searchParams.get("path"),
	};

	const url = BACKEND_BASE_URL + options.path;

	const res = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${user.access_token}`,
			accept: "application/json",
			contentType: "multipart/form-data",
		},
		body: formData,
	});

	const returnedData = await res.json();

	return NextResponse.json(returnedData);
}
