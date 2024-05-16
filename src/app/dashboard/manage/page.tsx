export const dynamic = "force-dynamic";

import { fetcher } from "@/lib/graphql/fetcher";
import { getMyBooksQuery } from "@/lib/graphql/queries";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { tags } from "@/lib/graphql/tags";

async function getData() {
	const { getBooks } = await fetcher({
		query: getMyBooksQuery,
		variables: {
			// todo keep this limit for now
			limit: 140,
		},
		server: true,
		protectid: true,
		tags: [tags.books],
	});

	return getBooks?.books;
}

export default async function Page() {
	const books = await getData();

	return (
		<div className="container">
			<h1 className="my-6 py-4 text-4xl">Books Manager</h1>
			{/* @ts-ignore */}
			<DataTable columns={columns} data={books} />
		</div>
	);
}
