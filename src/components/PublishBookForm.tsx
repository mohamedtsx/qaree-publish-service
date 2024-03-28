"use client";

import {
	type PublishSchemaType,
	publishSchema,
	publishDefaultValues,
	type MediaType,
} from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import { Form } from "./ui/form";
import { FormInput, FormSelect, FormTextare } from "./SmartForm";
import { Button } from "./ui/button";
import { FormImage } from "./FormImage";
import { FormFile } from "./FormFile";
import { ArrowRightIcon } from "lucide-react";
import { addBookDetailsAction, uploadFilesAction } from "@/app/actions";
import { toast } from "sonner";

const steps = [
	{ id: "Step 1", name: "Book detailes" },
	{ id: "Step 2", name: "Upload files" },
	{ id: "Step 3", name: "Publish" },
];

// todo(bug) fix form submit when user click entr inside an input

function PublishBookForm() {
	const [currentStep, setCurrentStep] = useState(1);

	const form = useForm<PublishSchemaType>({
		mode: "onBlur",
		resolver: zodResolver(publishSchema),
		defaultValues: publishDefaultValues,
	});

	const onSubmit = async (values: PublishSchemaType) => {
		const { book, cover, sample, ...rest } = values;

		// 1. send book detailes request
		const state = await addBookDetailsAction(rest);
		if (!state.success) {
			return toast.error(state.message);
		}

		const bookId = state.data?.addBookDetails?._id;

		if (!bookId) {
			return toast.error("Development Error");
		}

		// 2. upload the files
		// const files: Record<keyof MediaType, File> = {
		// 	book,
		// 	cover,
		// 	sample,
		// };

		// const formData = new FormData();

		// for (const [name, file] of Object.entries(files)) {
		// 	formData.append(name, file);
		// }

		const formData = new FormData();
		formData.append("cover", cover);

		const { success, message } = await uploadFilesAction(formData, `${bookId}`);

		if (!success) {
			return toast.error(message);
		}

		toast.success(message);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
				<header>
					Step {currentStep} {steps[currentStep - 1].name}
				</header>
				<div className="grid gap-4 py-4">
					{currentStep === 1 ? (
						<StepFirst
							form={form}
							onDone={() => {
								// use it for steps animation for now just keep it update the current step
								setCurrentStep(2);
								console.log(form.getValues());
							}}
						/>
					) : currentStep === 2 ? (
						<StepSecond
							form={form}
							onDone={() => {
								setCurrentStep(3);
							}}
						/>
					) : currentStep === 3 ? (
						<StepThird form={form} onDone={() => {}} />
					) : null}
				</div>
			</form>
		</Form>
	);
}

interface StepProps {
	form: UseFormReturn<PublishSchemaType>;
	bookId?: string;
	onDone: () => void;
}

function StepFirst({ form, onDone }: StepProps) {
	const goNext = async () => {
		const isValid = await form.trigger([
			"name",
			"categories",
			"language",
			"description",
			"publishingRights",
		]);

		if (isValid) {
			onDone();
		}
	};

	return (
		<>
			<FormInput form={form} name="name" placeholder="name" label="name" />
			<FormTextare form={form} name="description" label="description" />

			{/* todo fix hidden placeholder when using the filed multi time */}
			<FormSelect
				form={form}
				name="language"
				items={[{ id: "1", name: "item one" }]}
				label="select lang"
			/>

			<FormSelect
				form={form}
				name="publishingRights"
				items={[{ id: "3", name: "item one" }]}
				label="select rights"
			/>

			<FormSelect
				form={form}
				name="categories"
				items={[{ id: "1", name: "item one" }]}
				label="select categories"
			/>

			{/* <FormInput form={form} name="categories" placeholder="categories" /> */}
			<Button type="button" className="w-64 ms-auto" onClick={goNext}>
				<span>Upload Files</span> <ArrowRightIcon className="w-4 ml-2" />
			</Button>
		</>
	);
}

function StepSecond({ form, onDone }: StepProps) {
	const goNext = async () => {
		const isValid = await form.trigger(["cover", "book", "sample"]);
		if (isValid) {
			onDone();
		}
	};

	return (
		<>
			<FormImage form={form} name="cover" label="cover" />
			<FormFile form={form} name="book" label="book" />
			<FormFile form={form} name="sample" label="sample" />
			<Button type="button" onClick={goNext} className="w-64 ml-auto">
				<span>Review</span> <ArrowRightIcon className="w-4 ml-2 " />
			</Button>
		</>
	);
}

function StepThird({ form }: StepProps) {
	return (
		<>
			<div>Your book is good hit the publish button</div>
			<Button
				type="submit"
				className="w-64 ms-auto"
				disabled={
					form.formState.isSubmitting ||
					form.formState.isLoading ||
					form.formState.isValidating
				}
				isLoading={form.formState.isSubmitting || form.formState.isLoading}
			>
				Publish
			</Button>
		</>
	);
}
export default PublishBookForm;
