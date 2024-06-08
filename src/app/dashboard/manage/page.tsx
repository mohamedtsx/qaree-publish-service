export const dynamic = "force-dynamic";

import { DataTable, type TableSetting } from "@/components/DataTable";
import { fetcher } from "@/lib/graphql/fetcher";
import { getMyBooksQuery } from "@/lib/graphql/queries";
import { tags } from "@/lib/graphql/tags";
import { type Book, columns } from "./columns";

async function getData({ pageNumber, sizeNumber, filter, sort }: TableSetting) {
	const { getBooks } = await fetcher({
		query: getMyBooksQuery,
		variables: {
			limit: sizeNumber,
			page: pageNumber,
			filterBy: filter,
			sortBy: sort,
		},
		server: true,
		tags: [tags.books],
	});

	return {
		books: getBooks?.books,
		total: getBooks?.total,
	};
}

export default async function Page({
	searchParams: { page = "1", size = "5", filter = "", sort = "" },
}) {
	let pageNumber = Number.parseInt(page);
	const sizeNumber = Number(size);

	if (Number.isNaN(pageNumber)) {
		pageNumber = 1;
	}

	const { books, total } = await getData({
		pageNumber,
		sizeNumber,
		filter,
		sort,
	});

	return (
		<div>
			<h1 className="mb-6 text-xl sm:text-4xl">Books Manager</h1>
			<DataTable
				columns={columns}
				data={books as Array<Book>}
				paginationConfig={{
					state: {
						pageIndex: pageNumber - 1,
						pageSize: sizeNumber,
					},
					rowCount: total ?? 0,
				}}
			/>
		</div>
	);
}
