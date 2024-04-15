import React from "react";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type EditBookType, editBookSchema } from "@/schema";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { FormInput, SubmitButton } from "./SmartForm";
import { Form } from "./ui/form";
import type { Book } from "@/app/dashboard/manage/columns";
import { updateBookAction } from "@/app/actions";
import { toast } from "sonner";
import { revalidatePath } from "next/cache";

const getDefaultValues = (book: Book): EditBookType => {
	const categoriesList = book.categories.map((el) => el._id);

	const {
		_id,
		categories,
		status,
		createdAt,
		updatedAt,
		avgRate,
		publishingRights,
		...rest
	} = book;

	const data: EditBookType = {
		categories: categoriesList,
		publishingRights: publishingRights ? "Yes" : "No",
		...rest,
	};
	return data;
};

export function EditBookDialog({ book }: { book: Book }) {
	const [open, setOpen] = React.useState(false);

	const defaultValues = getDefaultValues(book);
	const form = useForm<EditBookType>({
		mode: "onBlur",
		resolver: zodResolver(editBookSchema),
		defaultValues,
	});

	const onSubmit = async (values: EditBookType) => {
		const { success, message } = await updateBookAction(book._id, values);
		if (!success) {
			return toast.error(message);
		}
		setOpen(false);
		toast.success(message);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size={"icon"} variant={"outline"}>
					<Pencil className="size-5" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<DialogHeader>
							<DialogTitle>Edit book details</DialogTitle>
							<DialogDescription>
								Make changes to your book here. Click save when you're done.
							</DialogDescription>
						</DialogHeader>
						<div>
							<FormInput form={form} name="name" label="Book Name" />
						</div>
						<DialogFooter>
							<SubmitButton>Save</SubmitButton>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
