import { fetcher } from "@/lib/graphql/fetcher";
import { Book, columns } from "./columns";
import { DataTable } from "./data-table";
import { getMyBooksQuery } from "@/lib/graphql/queries";
import { Button } from "@/components/ui/button";

async function Manage() {
	const { getBooks } = await fetcher({
		query: getMyBooksQuery,
		server: true,
		protectid: true,
	});

	return <div>hello world</div>;
}

export default Manage;
