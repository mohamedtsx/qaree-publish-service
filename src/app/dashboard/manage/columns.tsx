"use client";

import { DeleteBookDialog } from "@/components/DeleteBookDialog";
import { EditBookDialog } from "@/components/EditBookDialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { BookUp, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export type Book = {
	_id: string;
	cover: {
		path: string;
	};
	name: string;
	status: string;
	categories: {
		_id: string;
		name_en: string;
		background: string;
	}[];
	price: number;
	createdAt: string;
	updatedAt: string;
	isbn: string;
	description: string;
	avgRate: number;
	language: string;
	publishingRights: boolean;
	edition: number;
};

export const columns: Array<ColumnDef<Book>> = [
	{
		accessorKey: "cover",
		header: "Cover",
		cell({ row }) {
			const data = row.original.cover;

			return (
				<div className="w-24 aspect-[6/9] bg-muted flex justify-center items-center m-2 max-md:hidden">
					{data ? (
						<Image
							src={data.path}
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
		cell({ row }) {
			const bookId = row.original._id;

			return (
				<div className="grid grid-cols-3 gap-4 w-fit min-w-32">
					{row.original.status === "draft" ? (
						<Link
							href={`/dashboard/publish/${bookId}`}
							className={buttonVariants({
								size: "icon",
								variant: "outline",
							})}
						>
							<BookUp className="size-5" />
						</Link>
					) : (
						<div />
					)}
					<EditBookDialog book={row.original} />
					<DeleteBookDialog bookId={bookId} />
				</div>
			);
		},
	},
];
