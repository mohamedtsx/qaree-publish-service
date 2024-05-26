import { type ReactNode, useState } from "react";

import { addBookDetailsAction } from "@/app/actions";
import { fetcher } from "@/lib/graphql/fetcher";
import { getAllCategoriesQuery } from "@/lib/graphql/queries";
import type { SelectItems } from "@/lib/graphql/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormDate } from "../FormDate";
import { FormMultiSelect } from "../FormMultiSelect";
import FormRadioGroup from "../FormRadioGroup";
import { FormInput, FormSelect, FormTextare } from "../SmartForm";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

const bookDetailsSchema = z.object({
	name: z
		.string()
		.min(1, { message: "Enter the book name." })
		.min(3, { message: "The book name must be at least 3 characters long." }),
	isbn: z.string().optional(),
	description: z
		.string()
		.min(1, { message: "Enter a book description." })
		.min(10, {
			message: "The book description must be at least 10 characters long.",
		}),
	edition: z.coerce
		.number()
		.min(1, { message: "Enter a valid book edition (positive number)." }),
	language: z
		.string()
		.min(1, { message: "Enter the primary language of the book." }),
	publishingRights: z
		.string()
		.min(1, { message: "Indicate if you own the publishing rights." }),
	categories: z
		.array(z.string())
		.min(1, { message: "Select at least one category." }),
	price: z.coerce
		.number()
		.min(0, { message: "Enter a valid book price." })
		.optional(),
	previousPublishingData: z.date().optional(),
});

export const defaultValues = {
	categories: [],
	description: "",
	edition: 1,
	isbn: "",
	language: "",
	name: "",
	previousPublishingData: new Date(),
	price: 0,
	publishingRights: "",
};

export type BookDetailsSchema = z.infer<typeof bookDetailsSchema>;

const getAllCategories = async (): Promise<SelectItems> => {
	const { getAllCategories } = await fetcher({
		query: getAllCategoriesQuery,
		variables: {
			limit: 40,
		},
		server: false,
		protectid: false,
	});

	const formatedItems =
		getAllCategories?.categories?.map((el) => {
			return { label: el?.name_en as string, value: el?._id as string };
		}) ?? [];

	return formatedItems;
};

export const Step1 = ({
	onDone,
	data,
}: {
	onDone: (bookId: string) => void;
	data?: {
		defaultValues?: BookDetailsSchema;
	};
}) => {
	const form = useForm<BookDetailsSchema>({
		mode: "onSubmit",
		resolver: zodResolver(bookDetailsSchema),
		defaultValues: async () => {
			if (data?.defaultValues) {
				return data.defaultValues;
			}
			return defaultValues;
		},
	});

	const [draftLoading, setDraftLoading] = useState(false);
	const [continueLoading, setContinueLoading] = useState(false);

	const saveAndContinue = async (values: BookDetailsSchema) => {
		setContinueLoading(true);
		const { success, message, data } = await addBookDetailsAction(values);

		if (!success) {
			setContinueLoading(false);
			return toast.error(message);
		}

		setContinueLoading(false);
		onDone(data?.addBookDetails?._id as string);
	};

	const saveAsDraft = async (values: BookDetailsSchema) => {
		setDraftLoading(true);
		const { success, message } = await addBookDetailsAction(values);

		if (!success) {
			setDraftLoading(false);
			return toast.error(message);
		}

		setDraftLoading(false);
		toast.success("Draft book saved sucessfully");
		form.reset(defaultValues);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(saveAndContinue)}
				autoComplete="off"
				className="p-4 space-y-8"
			>
				<Group>
					<FormInput form={form} name="name" label="Book Name" />
					<FormInput form={form} name="isbn" label="ISBN" />
				</Group>
				<FormTextare
					form={form}
					name="description"
					label="Description"
					className="h-32"
				/>
				<Group>
					<FormInput form={form} name="edition" label="Edition" type="number" />
					<FormSelect
						form={form}
						name="language"
						items={[
							{ label: "English", value: "en" },
							{ label: "Arabic", value: "ar" },
						]}
						label="Language"
						placeholder="Select Language"
					/>
				</Group>
				<Group>
					<FormInput form={form} name="price" label="Price" type="number" />

					<FormMultiSelect
						form={form}
						name="categories"
						placeholder="Add New"
						label="Categories"
						items={getAllCategories}
					/>
				</Group>
				<Group>
					<FormDate
						form={form}
						name="previousPublishingData"
						label="Previous Publishing Date"
					/>
				</Group>

				<div className="p-4 rounded-md border border-input">
					<FormRadioGroup
						form={form}
						name="publishingRights"
						label="Publishing Rights"
						items={[
							{
								label:
									"I own the copyright and I hold the necessary publishing rights.",
								value: "true",
							},
							{ label: "This is a public domain work.", value: "false" },
						]}
					/>
				</div>

				<div className="flex items-center justify-end gap-4 pt-6">
					<Button
						type="button"
						isLoading={draftLoading}
						onClick={form.handleSubmit(saveAsDraft)}
						variant={"outline"}
						className="w-32"
					>
						Save as a draft
					</Button>
					<Button
						type="button"
						isLoading={continueLoading}
						onClick={form.handleSubmit(saveAndContinue)}
						className="w-40"
					>
						Save and continue
					</Button>
				</div>
			</form>
		</Form>
	);
};

const Group = ({ children }: { children: ReactNode }) => {
	return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
};
