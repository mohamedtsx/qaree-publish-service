"use client";

import { moveBookToRecycleBinAction } from "@/app/actions";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";

export function DeleteBookDialog({ bookId }: { bookId: string }) {
	const [open, setOpen] = React.useState(false);
	const [loading, setLoading] = useState(false);

	const deleteBook = async () => {
		setLoading(true);
		const { success, message } = await moveBookToRecycleBinAction(bookId);
		if (!success) {
			setLoading(false);
			return toast.error(message);
		}
		setOpen(false);
		toast.success(message);
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button size={"icon"} variant={"outline"}>
					<Trash2 className="size-5" />
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent className="sm:max-w-md">
				<AlertDialogHeader className="mb-8">
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your
						account and remove your data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button isLoading={loading} onClick={deleteBook} className="w-32">
						Continue
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
