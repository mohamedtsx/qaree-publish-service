"use client";

import {
	type PublishSchemaType,
	publishSchema,
	publishDefaultValues,
	type MediaType,
} from "@/schema";
import { ArrowLeft } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import { Form } from "./ui/form";
import { FormErrors, FormInput, FormSelect, FormTextare } from "./SmartForm";
import { Button } from "./ui/button";
import { FormImage } from "./FormImage";
import { FormFile } from "./FormFile";
import { ArrowRightIcon } from "lucide-react";
import { SelectCategories } from "./SelectCategories";
import type { PureBookDetailesSchemaType } from "@/lib/graphql/types";
import {
	addBookDetailsAction,
	publishBookAction,
	uploadFilesAction,
} from "@/app/actions";
import { toast } from "sonner";
import { Spinner } from "./Spinner";

const steps = [
	{ id: "Step 1", name: "Book detailes" },
	{ id: "Step 2", name: "Upload files" },
	{ id: "Step 3", name: "Publish" },
];

function PublishBookForm() {
	const [currentStep, setCurrentStep] = useState(1);
	const [categories, setCategories] = useState<string[]>([]);
	const [currentProcessMessage, setCurrentProcessMessage] = useState("");

	const form = useForm<PublishSchemaType>({
		mode: "onBlur",
		resolver: zodResolver(publishSchema),
		defaultValues: publishDefaultValues,
	});

	const onSubmit = async (values: PublishSchemaType) => {
		const { book, cover, ...rest } = values;

		const bookDetailes: PureBookDetailesSchemaType = {
			...rest,
			categories,
			publishingRights: rest.publishingRights === "true",
		};

		// 1. send book detailes request
		setCurrentProcessMessage("Sending detailes...");
		const addBookDetailsState = await addBookDetailsAction(bookDetailes);
		if (!addBookDetailsState.success) {
			return toast.error(addBookDetailsState.message);
		}

		const bookId = String(addBookDetailsState.data?.addBookDetails?._id);

		if (!bookId) {
			console.log(bookId);
			return toast.error("Development Error");
		}

		// 2. upload the files
		setCurrentProcessMessage("Uploading files...");
		const files: Record<keyof MediaType, File> = {
			cover,
			book,
		};

		const formDataMap: { [key in keyof MediaType]: FormData } = {
			cover: new FormData(),
			book: new FormData(),
		};

		for (const [name, file] of Object.entries(files)) {
			formDataMap[name as keyof MediaType].append(name, file);
		}

		const uploadFilesState = await uploadFilesAction(formDataMap, bookId);

		if (!uploadFilesState.success) {
			return toast.error(uploadFilesState.message);
		}

		// 3. publish the book
		setCurrentProcessMessage("Publishing...");
		const publishBookState = await publishBookAction(bookId);
		if (!publishBookState.success) {
			return toast.error(publishBookState.message);
		}

		toast.success(
			"Congratulations! Your book has been uploaded successfully 📚🎉",
		);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
				<header>
					<div className="flex gap-2 flex-col">
						<Button
							type="button"
							onClick={() => setCurrentStep(currentStep - 1)}
							disabled={currentStep === 1}
							size={"icon"}
							variant={"secondary"}
						>
							<ArrowLeft className="w-4 h-4" />
						</Button>
						<div>
							Step {currentStep} {steps[currentStep - 1].name}
						</div>
					</div>
				</header>
				<div className="grid gap-4 py-4">
					{currentStep === 1 ? (
						<StepFirst
							form={form}
							onDone={(selectedCategories) => {
								setCategories(selectedCategories || []);
								setCurrentStep(2);
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
						<StepThird
							form={form}
							onDone={() => {}}
							currentProcessMessage={currentProcessMessage}
						/>
					) : null}
				</div>
			</form>
		</Form>
	);
}

interface StepProps {
	form: UseFormReturn<PublishSchemaType>;
	bookId?: string;
	onDone: (selectedCategories?: string[]) => void;
}

function StepFirst({ form, onDone }: StepProps) {
	const [filterValues, setFilterValues] = useState<string[]>();

	const goNext = async () => {
		const isValid = await form.trigger([
			"name",
			"language",
			"description",
			"publishingRights",
		]);

		if (isValid) {
			onDone(filterValues);
		}
	};

	return (
		<>
			<FormInput form={form} name="name" placeholder="name" label="name" />
			<FormTextare form={form} name="description" label="description" />

			<div className="grid gap-4 md:grid-cols-[0.5fr_0.5fr_1fr] xl:grid-cols-3">
				<FormSelect
					form={form}
					name="publishingRights"
					items={[
						{ label: "Yes", value: "true" },
						{ label: "No", value: "false" },
					]}
					label="Rights"
				/>

				<FormSelect
					form={form}
					name="language"
					items={[
						{ label: "English", value: "en" },
						{ label: "Arabic", value: "ar" },
					]}
					label="Language"
				/>
				<SelectCategories
					filterValues={filterValues}
					setFilterValues={setFilterValues}
				/>
			</div>

			<Button type="button" className="w-64 ms-auto mt-8" onClick={goNext}>
				<span>Upload Files</span> <ArrowRightIcon className="w-4 ml-2" />
			</Button>
		</>
	);
}

function StepSecond({ form, onDone }: StepProps) {
	const goNext = async () => {
		const isValid = await form.trigger(["cover", "book"]);
		if (isValid) {
			onDone();
		}
	};

	return (
		<>
			<div className="grid gap-4">
				<FormImage form={form} name="cover" label="cover" />
				<FormFile form={form} name="book" label="book" />
			</div>
			<Button type="button" onClick={goNext} className="w-64 ml-auto">
				<span>Review</span> <ArrowRightIcon className="w-4 ml-2 " />
			</Button>
		</>
	);
}

type StepThirdProps = StepProps & {
	currentProcessMessage: string;
};

function StepThird({ form, currentProcessMessage }: StepThirdProps) {
	return (
		<>
			<div>Your book is good hit the publish button</div>
			<FormErrors />
			<Button
				type="submit"
				className="w-64 ms-auto"
				disabled={
					form.formState.isSubmitting ||
					form.formState.isLoading ||
					form.formState.isValidating
				}
			>
				{form.formState.isLoading || form.formState.isSubmitting ? (
					<div className="flex gap-2">
						<Spinner />
						<div>{currentProcessMessage}</div>
					</div>
				) : (
					"Publish"
				)}
			</Button>
		</>
	);
}
export default PublishBookForm;
