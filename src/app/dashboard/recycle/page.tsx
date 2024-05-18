import { getBooksFromRecycleBinQuery } from "@/lib/graphql/queries";
import { fetcher } from "@/lib/graphql/fetcher";
import type { TableSetting } from "@/components/DataTable";

const getData = async ({
	pageNumber,
	sizeNumber,
	filter,
	sort,
}: TableSetting) => {
	const { getBooksFromRecycleBin } = await fetcher({
		query: getBooksFromRecycleBinQuery,
		variables: {
			limit: sizeNumber,
			page: pageNumber,
			filterBy: filter,
			sortBy: sort,
		},
		server: true,
		// tags: [tags.bin],
	});

	return {
		books: getBooksFromRecycleBin?.books,
		rowCount: getBooksFromRecycleBin?.total,
	};
};
export default async function Page({
	searchParams: { page = "1", size = "5", filter = "", sort = "" },
}) {
	let pageNumber = Number.parseInt(page);
	const sizeNumber = Number(size);

	if (Number.isNaN(pageNumber)) {
		pageNumber = 1;
	}

	const { books, rowCount } = await getData({
		pageNumber,
		sizeNumber,
		filter,
		sort,
	});

	return (
		<div>
			<pre className="p-4 bg-muted m-4">{JSON.stringify(books, null, 2)}</pre>
			{/* <RecycleBooksDataTable
				columns={columns}
				data={books as Array<Book>}
				paginationConfig={{
					state: {
						pageIndex: pageNumber - 1,
						pageSize: sizeNumber,
					},
					rowCount: rowCount ?? 0,
				}}
			/> */}
		</div>
	);
}
