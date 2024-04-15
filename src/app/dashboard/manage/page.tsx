import { fetcher } from "@/lib/graphql/fetcher";
import { Book, columns } from "./columns";
import { DataTable } from "./data-table";
import { getMyBooksQuery } from "@/lib/graphql/queries";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

async function Manage() {
	const { getBooks } = await fetcher({
		query: getMyBooksQuery,
		variables: {
			// todo keep this limit for now
			limit: 100,
		},
		server: true,
		protectid: true,
		// cache: "default",
	});

	const { books } = getBooks as NonNullable<typeof getBooks>;

	return (
		<div className="container">
			<h1 className="mb-8 py-4 text-4xl">Manage Your Books</h1>
			{/* @ts-ignore */}
			<DataTable columns={columns} data={books} />
		</div>
	);
}

export default Manage;
