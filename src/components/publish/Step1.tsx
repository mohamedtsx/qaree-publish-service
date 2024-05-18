import type { ReactNode } from "react";

import { z } from "zod";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput, FormSelect, FormTextare } from "../SmartForm";
import { SelectCategories } from "../SelectCategories";
import { FormMultiSelect } from "../FormMultiSelect";
import { Card, CardContent, CardHeader } from "../ui/card";
import FormRadioGroup from "../FormRadioGroup";

// TODO: ADD ERROR MESSAGES
const bookDetailesSchema = z.object({
	name: z.string(),
	isbn: z.string(),
	description: z.string(),
	edition: z.coerce.number(),
	language: z.string(),
	publishingRights: z.string(),
	categories: z.array(z.string()),
	price: z.coerce.number(),
	previousPublishingData: z.date(),
});

type BookDetailesSchema = z.infer<typeof bookDetailesSchema>;

export const Step1 = ({
	onDone,
}: {
	onDone: (bookId: string) => void;
}) => {
	const form = useForm<BookDetailesSchema>({
		mode: "onSubmit",
		resolver: zodResolver(bookDetailesSchema),
	});

	const onSubmit = (values: BookDetailesSchema) => {
		// add book detailes action
	};

	console.log(form.getValues("categories"));

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
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
					<FormInput form={form} name="edition" label="Edition" />
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
					<FormInput form={form} name="price" label="Price" />
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
			</form>
		</Form>
	);
};

const Group = ({ children }: { children: ReactNode }) => {
	return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
};
