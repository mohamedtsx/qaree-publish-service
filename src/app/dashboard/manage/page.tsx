import { fetcher } from "@/lib/graphql/fetcher";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getMyBooksQuery } from "@/lib/graphql/queries";

async function Manage() {
	const { getBooks } = await fetcher({
		query: getMyBooksQuery,
		variables: {
			// todo keep this limit for now
			limit: 140,
		},
		server: true,
		protectid: true,
	});

	const { books } = getBooks as NonNullable<typeof getBooks>;

	return (
		<div className="container">
			<h1 className="my-6 py-4 text-4xl">Books Manager</h1>
			{/* @ts-ignore */}
			<DataTable columns={columns} data={books} />
		</div>
	);
}

export default Manage;
