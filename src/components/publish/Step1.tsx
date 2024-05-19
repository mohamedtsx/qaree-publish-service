import type { ReactNode } from "react";

import { z } from "zod";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput, FormSelect, FormTextare, SubmitButton } from "../SmartForm";
import { FormMultiSelect } from "../FormMultiSelect";
import FormRadioGroup from "../FormRadioGroup";
import { Button } from "../ui/button";
import { addBookDetailsAction } from "@/app/actions";
import { toast } from "sonner";

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
	previousPublishingData: z.string().optional(),
});

const defaultValues = {
	categories: [],
	description: "",
	edition: 1,
	isbn: "",
	language: "",
	name: "",
	previousPublishingData: "",
	price: 0,
	publishingRights: "",
};

export type BookDetailsSchema = z.infer<typeof bookDetailsSchema>;

export const Step1 = ({
	onDone,
}: {
	onDone: (bookId: string) => void;
}) => {
	const form = useForm<BookDetailsSchema>({
		mode: "onSubmit",
		resolver: zodResolver(bookDetailsSchema),
		defaultValues,
	});

	const saveAndContinue = async (values: BookDetailsSchema) => {
		const { success, message, data } = await addBookDetailsAction(values);
		if (!success) {
			toast.error(message);
		}
		toast.success(message);
	};
	const saveAsDraft = (values: BookDetailsSchema) => {
		// add book detailes action
	};

	console.log(form.getValues("categories"));

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
						items={[
							{ label: "Label one 1", value: "one" },
							{ label: "Label one 2", value: "two" },
							{ label: "Label one 3", value: "three" },
							{ label: "Label one 4", value: "four" },
							{ label: "Label one 5", value: "five" },
						]}
					/>
				</Group>

				<FormTextare
					form={form}
					name="previousPublishingData"
					label="Previous Publishing Data"
				/>
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
						isLoading={form.formState.isLoading}
						onClick={form.handleSubmit(saveAsDraft)}
						variant={"outline"}
					>
						Save as a draft
					</Button>
					<SubmitButton className="w-fit">Save and continue</SubmitButton>
				</div>
			</form>
		</Form>
	);
};

const Group = ({ children }: { children: ReactNode }) => {
	return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
};
