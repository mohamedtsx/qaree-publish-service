import { getCurrentUser } from "@/lib/authOptions";
import { UPLOAD_FULL_URL } from "@/lib/graphql";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const user = await getCurrentUser();
	const formData = await req.formData();

	const searchParams = req.nextUrl.searchParams;

	const options = {
		bookId: searchParams.get("id"),
	};

	if (!options.bookId) return;

	const res = await fetch(UPLOAD_FULL_URL.file(options.bookId), {
		method: "POST",
		headers: {
			Authorization: `Bearer ${user.access_token}`,
			accept: "application/json",
			// contentType: "multipart/form-data",
		},
		body: formData,
	});

	const returnedData = await res.json();

	return NextResponse.json(returnedData);
}
