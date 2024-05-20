import { DataTable, type TableSetting } from "@/components/DataTable";
import { fetcher } from "@/lib/graphql/fetcher";
import { getBooksFromRecycleBinQuery } from "@/lib/graphql/queries";
import { tags } from "@/lib/graphql/tags";
import { type RecycleBook, columns } from "./columns";

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
		tags: [tags.bin],
	});

	return {
		books: getBooksFromRecycleBin?.books,
		total: getBooksFromRecycleBin?.total,
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

	const { books, total } = await getData({
		pageNumber,
		sizeNumber,
		filter,
		sort,
	});

	// const books: Array<RecycleBook> = [
	// 	{
	// 		_id: "6608bdad9bd556631e84b1e6",
	// 		cover: {
	// 			path: "",
	// 		},
	// 		name: "one",
	// 		price: 0,
	// 		categories: [
	// 			{
	// 				_id: "asdlkfjasdf",
	// 				name_en: "category",
	// 				background: "#0ff",
	// 			},
	// 		],
	// 		status: "draft",
	// 		createdAt: "1711848877391",
	// 		avgRate: 0,
	// 		updatedAt: "1716003158194",
	// 		isbn: "",
	// 		description:
	// 			"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae sequi eveniet itaque non fugiat dolor eaque possimus ad tempore a commodi fugit quos aut illo illum tenetur, id iure quia. Omnis iusto odio repudiandae mollitia soluta veritatis itaque. Veniam laudantium ducimus hic aperiam at veritatis quasi velit id nobis repellendus!",
	// 		language: "en",
	// 		publishingRights: true,
	// 		edition: 1,
	// 	},
	// ];

	return (
		<div>
			{/* <pre className="p-4 bg-muted m-4">{JSON.stringify(books, null, 2)}</pre> */}
			<DataTable
				columns={columns}
				data={books as Array<RecycleBook>}
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
