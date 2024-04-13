"use client";

import { usePublishFormContext } from "@/context";
import { fetcher } from "@/lib/graphql/fetcher";
import { addBookDetailsMutation } from "@/lib/graphql/mutations";
import type { PureBookDetailesSchemaType } from "@/lib/graphql/types";
import {
	type PublishSchemaType,
	publishDefaultValues,
	publishSchema,
} from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { ArrowRightIcon } from "lucide-react";
import { Suspense, useCallback, useEffect, useState } from "react";
import { type UseFormReturn, useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { FormFile } from "./FormFile";
import { FormImage } from "./FormImage";
import SampleMultiSelect from "./SampleMultiSelect";
import { SelectCategories } from "./SelectCategories";
import { FormErrors, FormInput, FormSelect, FormTextare } from "./SmartForm";
import { Spinner } from "./Spinner";
import { Button } from "./ui/button";
import { Form } from "./ui/form";
import { publishBookAction } from "@/app/actions";
import { useFormState } from "react-dom";
import { getBookEPubContentQuery } from "@/lib/graphql/queries";
import { BACKEND_BASE_URL, UPLOAD_FULL_URL } from "@/lib/graphql";
import { useSession } from "next-auth/react";
import { ResultOf } from "gql.tada";

const steps = [
	{ id: "Step 1", name: "Book detailes" },
	{ id: "Step 2", name: "Upload files" },
	{ id: "Step 3", name: "Publish" },
];

function PublishBookForm() {
	const [currentStep, setCurrentStep] = useState(1);
	const [currentProcessMessage, setCurrentProcessMessage] = useState("");

	const { publishState } = usePublishFormContext();

	const form = useForm<PublishSchemaType>({
		mode: "onBlur",
		resolver: zodResolver(publishSchema),
		defaultValues: publishDefaultValues,
	});

	const onSubmit = async (values: PublishSchemaType) => {
		// Publish the book
		const bookId = publishState.bookId;
		const { message, success } = await publishBookAction(bookId);
		if (!success) {
			return toast.error(message);
		}
		toast.success(message);
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
						{ label: "English", value: "en" },
						{ label: "Arabic", value: "ar" },
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

	const processTwo = async () => {
		// 2. show loader if user click on add sample
		// todo fix stop loading when the process return

		setPublishState({ ...publishState, sampleItemsIsLoading: true });

		// 3. get bookId
		const bookId = publishState.bookId;
		if (!bookId) {
			setPublishState({ ...publishState, sampleItemsIsLoading: false });
			return toast.error(
				"Error in previous step. Please retry or contact support",
			);
		}

		// todo book cover doesn't uploaded yet
		// 4. upload book file
		const book = form.getValues("book");
		const formData = new FormData();
		formData.append("file", book);

		const token = session.data?.user.access_token;

		try {
			const res = await fetch(UPLOAD_FULL_URL.file(bookId), {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					accept: "application/json",
					contentType: "multipart/form-data",
				},
				body: formData,
			});
			const data = await res.json();

			// todo do it using api route
			// const res = await fetch("/api/media", {
			// 	method: "POST",
			// 	body: JSON.stringify({
			// 		body: formData,
			// 		contentType: "multipart/form-data",
			// 	}),
			// });
			// if (!res.ok) {
			// 	throw new Error("Failed to upload book file");
			// }

			// 5. get book content list (F)
			const { getBookEPubContent } = await fetcher({
				query: getBookEPubContentQuery,
				variables: {
					bookId: data._id,
				},
				server: false,
				protectid: true,
				cache: "default",
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
			if (error instanceof Error) {
				return toast.error(error.message);
			}
			return toast.error("Something went wrong!");
		}
	};

	//1. run the process directly after file upload

	const file = form.watch("book");
	useEffect(() => {
		if (file) {
			console.log("process two start");
			processTwo();
		}
	}, [file]);

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
			<div className="grid gap-4">
				<FormImage form={form} name="cover" label="cover" />
				<FormFile form={form} name="book" label="book" />

				<SampleMultiSelect />
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
