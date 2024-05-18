"use client";

import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import type { Book } from "../manage/columns";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

// TODO: keep it with Book type for now then update the recycle query
export type RecycleBook = Book;

export const columns: Array<ColumnDef<Book>> = [
	{
		accessorKey: "cover",
		header: "Cover",
		cell({ row }) {
			const cover = row.original.cover;

			return (
				<div className="w-24 aspect-[6/9] bg-muted flex justify-center items-center m-2 max-md:hidden">
					{cover ? (
						<Image
							src={cover.path}
							className="w-full"
							width={60}
							height={90}
							alt={row.original.name}
						/>
					) : (
						<ImageIcon className="size-12 text-muted-foreground" />
					)}
				</div>
			);
		},
	},
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
		accessorKey: "createdAt",
		header: "Created At",
		cell(props) {
			const createdAt = props.row.original.createdAt;
			const formatedDate = new Date(+createdAt).toLocaleDateString("en-US");
			return <div>{formatedDate}</div>;
		},
	},
	{
		accessorKey: "description",
		header: "Description",
		cell({ row }) {
			return (
				<div className="max-w-sm">
					<p className="line-clamp-2 text-wrap ">{row.original.description}</p>
				</div>
			);
		},
	},

	{
		id: "actions",
		accessorKey: "actions",
		header: "Actions",
		cell({ row }) {
			const bookId = row.original._id;

			return (
				<div className="space-x-4">
					<Button
						onClick={() => {
							// move book from bing action
						}}
						size={"sm"}
						variant={"outline"}
					>
						{/* <History className="size-5 me-2" /> */}
						Restore
					</Button>
				</div>
			);
		},
	},
];
