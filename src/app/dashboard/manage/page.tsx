import { fetcher } from "@/lib/graphql/fetcher";
import { Book, columns } from "./columns";
import { DataTable } from "./data-table";
import { getMyBooksQuery } from "@/lib/graphql/queries";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

async function Manage() {
	// todo when to fetch new?
	const { getBooks } = await fetcher({
		query: getMyBooksQuery,
		variables: {
			// page: 2,
			limit: 100,
		},
		server: true,
		protectid: true,
		cache: "default",
	});

	const { books, currentPage, numberOfPages, total } = getBooks as NonNullable<
		typeof getBooks
	>;

	return (
		<div className="container">
			<h1 className="mb-8 py-4 text-4xl">Manage Your Books</h1>
			{/* todo fix typescript error */}
			<DataTable columns={columns} data={books} />
		</div>
	);
}

export default Manage;
