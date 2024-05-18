"use client";

import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import type { Book } from "../manage/columns";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { moveBookFromRecycleBinAction } from "@/app/actions";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "@/components/Spinner";

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
							alt={`${row.original.name} cover`}
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
			const [loading, setLoading] = useState(false);

			return (
				<div className="space-x-4">
					<Button
						className="w-24"
						disabled={loading}
						onClick={async () => {
							setLoading(true);
							const { success, message } =
								await moveBookFromRecycleBinAction(bookId);
							setLoading(false);

							if (!success) {
								return toast.error(message);
							}

							toast.success(message);
						}}
						size={"sm"}
						variant={"outline"}
					>
						{loading ? (
							<Spinner className="border-t-foreground me-2 size-4" />
						) : (
							<History className="size-5 me-2" />
						)}
						<span>Restore</span>
					</Button>
				</div>
			);
		},
	},
];
