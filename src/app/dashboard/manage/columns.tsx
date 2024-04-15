"use client";

import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";

export type Book = {
	_id: string;
	name: string;
	status: string;
	categories: {
		_id: string;
		name_en: string;
		background: string;
	}[];
	price: string;
	createdAt: string;
	avgRate: string;
};

export const columns: Array<ColumnDef<Book>> = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "categories",
		header: "Categories",
		cell(props) {
			const categoreis = props.row.original.categories;

			return (
				<div className="flex gap-2">
					{categoreis.map((el) => (
						<Badge
							key={el._id}
							style={{
								backgroundColor: el.background,
							}}
						>
							{el.name_en}
						</Badge>
					))}
				</div>
			);
		},
	},
	{
		accessorKey: "status",
		header: "Status",
	},
	{
		accessorKey: "createdAt",
		header: "Created At",
		cell(props) {
			const createdAt = props.row.original.createdAt;
			const formatedDate = new Date(+createdAt).toLocaleDateString("en-US");
			return <div>{formatedDate}</div>;
		},
	},
	{
		accessorKey: "avgRate",
		header: "Rate",
	},
	{
		id: "actions",
		accessorKey: "actions",
		header: "Actions",
	},
];
