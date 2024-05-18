"use client";

import { publishBookAction, uploadCoverAction } from "@/app/actions";

import { usePublishFormContext } from "@/context";
import { UPLOAD_FULL_URL } from "@/lib/graphql";
import { fetcher } from "@/lib/graphql/fetcher";
import { addBookDetailsMutation } from "@/lib/graphql/mutations";
import { getBookEPubContentQuery } from "@/lib/graphql/queries";
import type { PureBookDetailesSchemaType } from "@/lib/graphql/types";
import {
	type PublishSchemaType,
	publishDefaultValues,
	publishSchema,
} from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { ArrowRightIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { Suspense, useCallback, useEffect, useState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormFile } from "./FormFile";
import { FormImage } from "./FormImage";
import SampleMultiSelect from "./SampleMultiSelect";
import { SelectCategories } from "./SelectCategories";
import { FormErrors, FormInput, FormSelect, FormTextare } from "./SmartForm";
import { Spinner } from "./Spinner";
import { Button } from "./ui/button";
import { Form } from "./ui/form";

const steps = [
	{ id: "Step 1", name: "Book detailes" },
	{ id: "Step 2", name: "Upload files" },
	{ id: "Step 3", name: "Publish" },
];

function PublishBookForm() {
	const [currentStep, setCurrentStep] = useState(1);
	const { publishState } = usePublishFormContext();

	const form = useForm<PublishSchemaType>({
		mode: "onBlur",
		resolver: zodResolver(publishSchema),
		defaultValues: publishDefaultValues,
	});

	const onSubmit = async (values: PublishSchemaType) => {
		const bookId = publishState.bookId;

		// 1. upload cover
		const book = form.getValues("cover");
		const formData = new FormData();
		formData.append("cover", book);

		const coverState = await uploadCoverAction(formData, bookId);
		if (!coverState.success) {
			return toast.error("Error: Invalid book cover");
		}

		// Publish the book
		const { message, success } = await publishBookAction(bookId);
		if (!success) {
			return toast.error(message);
		}
		toast.success(message);
		form.reset(publishDefaultValues);
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
							onDone={() => {
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
						<StepThird form={form} onDone={() => {}} />
					) : null}
				</div>
			</form>
		</Form>
	);
}

interface StepProps {
	form: UseFormReturn<PublishSchemaType>;
	onDone: () => void;
}

function StepFirst({ form, onDone }: StepProps) {
	const { publishState, setPublishState } = usePublishFormContext();

	const processOne = async () => {
		// block execution on back/prev button click

		// todo use form context instead context api
		// const formX = useFormContext<PublishSchemaType>()

		if (publishState.bookId) {
			return;
		}

		// 1. validation
		const { book, cover, ...rest } = form.getValues();

		const bookDetailes: PureBookDetailesSchemaType = {
			...rest,
			categories: publishState.categories,
			publishingRights: rest.publishingRights === "true",
		};

		// 2. send book detailes
		let bookId: string;
		try {
			const { addBookDetails } = await fetcher({
				query: addBookDetailsMutation,
				variables: bookDetailes,
				server: false,
				protectid: true,
			});
			bookId = String(addBookDetails?._id);
		} catch (error) {
			if (error instanceof Error) {
				return toast.error(error.message);
			}
			return toast.error("Faild to add book data");
		}

		if (!bookId) {
			return toast.error("Development Error");
		}

		// 3. update publishState (bookId)
		setPublishState({
			...publishState,
			bookId,
		});
	};

	const goNext = async () => {
		const isValid = await form.trigger([
			"name",
			"language",
			"description",
			"publishingRights",
		]);

		if (isValid) {
			onDone();
			processOne();
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
						{ label: "English", value: "1" },
						{ label: "Arabic", value: "2" },
					]}
					label="Language"
				/>

				<Suspense fallback={<Spinner />}>
					<SelectCategories />
				</Suspense>
			</div>

			<Button type="button" className="w-64 ms-auto mt-8" onClick={goNext}>
				<span>Upload Files</span> <ArrowRightIcon className="w-4 ml-2" />
			</Button>
		</>
	);
}

function StepSecond({ form, onDone }: StepProps) {
	const { publishState, setPublishState } = usePublishFormContext();
	const session = useSession();

	const processTwo = useCallback(async () => {
		// 2. show loader if user click on add sample
		setPublishState({ ...publishState, sampleItemsIsLoading: true });

		// 3. get bookId
		const bookId = publishState.bookId;
		if (!bookId) {
			setPublishState({ ...publishState, sampleItemsIsLoading: false });
			return toast.error(
				"Error in previous step. Please retry or contact support",
			);
		}

		// 4. upload book file
		const book = form.getValues("book");
		const formData = new FormData();
		formData.append("file", book);

		const token = session.data?.user.access_token;

		try {
			await fetch(UPLOAD_FULL_URL.file(bookId), {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					accept: "application/json",
					contentType: "multipart/form-data",
				},
				body: formData,
			});

			// todo use media route instead and remove the token from client
			// const queries = new URLSearchParams();
			// queries.append("id", bookId);

			// const res = await fetch(`/api/media?${queries.toString()}`, {
			// 	method: "POST",
			// 	body: formData,
			// });

			// if (!res.ok) {
			// 	throw new Error("Failed to upload book file");
			// }

			// 5. get book content list
			const { getBookEPubContent } = await fetcher({
				query: getBookEPubContentQuery,
				variables: {
					bookId,
				},
				server: false,
				protectid: true,
			});

			const options = getBookEPubContent?.content?.map((el) => ({
				label: el?.title,
				value: el?.id,
			})) as { label: string; value: string }[];
			if (!options) {
				return toast.error("Development Error");
			}
			// 6. update publishState (sampleItems)
			setPublishState({
				...publishState,
				sampleItems: options,
				sampleItemsIsLoading: false,
			});
		} catch (error) {
			setPublishState({ ...publishState, sampleItemsIsLoading: false });
			if (error instanceof Error) {
				return toast.error(error.message);
			}
			return toast.error("Something went wrong!");
		}
	}, [form, publishState.bookId]);

	//1. run the process directly after file upload

	const file = form.watch("book");
	useEffect(() => {
		if (file) {
			processTwo();
		}
	}, [file, processTwo]);

	const goNext = async () => {
		const isValid = await form.trigger(["cover", "book"]);

		if (isValid && publishState.bookId) {
			if (!publishState.sampleSelectedValues) {
				toast.error("Please select sample");
			} else {
				onDone();
			}
		}
	};

	return (
		<>
			{/* <Button onClick={() => processTwo()}>Click Me</Button> */}

			<div className="grid gap-4">
				<FormImage form={form} name="cover" label="cover" />
				<FormFile form={form} name="book" label="book" />

				<SampleMultiSelect
					onClick={() => {
						if (!publishState.sampleItems.length && file) {
							processTwo();
						}
					}}
				/>
			</div>
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
					</div>
				) : (
					"Publish"
				)}
			</Button>
		</>
	);
}
export default PublishBookForm;
