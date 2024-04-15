import type { ColumnDef } from "@tanstack/react-table";

export type Book = {
	id: string;
	title: string;
	status: string;
	categories: string[];
	price: string;
	created_time: string;
};

export const columns: Array<ColumnDef<Book>> = [
	{
		accessorKey: "title",
		header: "Title",
	},
	{
		accessorKey: "status",
		header: "status",
	},
	{
		accessorKey: "categories",
		header: "categories",
	},
	{
		accessorKey: "price",
		header: "price",
	},
	{
		accessorKey: "created_time",
		header: "created_time",
	},
	{
		id: "actions",
		accessorKey: "actions",
		header: "Title",
	},
];

/**
 * title
 * status
 * categories
 * price
 * created time
 * actions
 */
