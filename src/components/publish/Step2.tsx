import { addBookSampleAction, getBookEPubContentAction } from "@/app/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Form } from "../ui/form";
import { FormUploadImage } from "../FormUploadImage";
import { Button } from "../ui/button";
import { FormUploadFile } from "../FormUploadFile";
import { FormMultiSelect } from "../FormMultiSelect";

const bookContentSchema = z
	.object({
		// this will be sent onsubmit
		sample: z.array(z.string()),
		// these for client validation
		fileUploaded: z.boolean().refine((arg) => arg, {
			message: "Upload the ebook file.",
		}),
		coverUploaded: z.boolean().refine((arg) => arg, {
			message: "Upload a cover for the book.",
		}),
	})
	.refine((args) => args.fileUploaded && args.sample.length, {
		message: "Select at least one sample item.",
		path: ["sample"],
	});

type BookContentSchema = z.infer<typeof bookContentSchema>;

const defaultValues = {
	coverUploaded: false,
	fileUploaded: false,
	sample: [],
};

export const Step2 = ({
	onDone,
	data,
}: {
	onDone: () => void;
	data: {
		bookId: string;
		defaultValues?: BookContentSchema;
	};
}) => {
	const [draftLoading, setDraftLoading] = useState(false);
	const [continueLoading, setContinueLoading] = useState(false);

	const saveAsDraft = async (values: BookContentSchema) => {
		// if form is not dirty you could call onDone directly here
		setDraftLoading(true);

		const { sucess, message } = await addBookSampleAction({
			bookId: data.bookId,
			sample: values.sample,
		});

		if (!sucess) {
			setDraftLoading(false);
			return toast.error(message);
		}

		setDraftLoading(false);
		toast.success("Draft book saved successfully");
		// form.reset(defaultValues);
	};

	const saveAndContinue = async (values: BookContentSchema) => {
		setContinueLoading(true);

		const { sucess, message } = await addBookSampleAction({
			bookId: data.bookId,
			sample: values.sample,
		});

		if (!sucess) {
			setContinueLoading(false);
			return toast.error(message);
		}
		onDone();
	};

	const form = useForm<BookContentSchema>({
		mode: "onBlur",
		resolver: zodResolver(bookContentSchema),
		defaultValues: data.defaultValues || defaultValues,
	});

	return (
		<Form {...form}>
			<form className="space-y-8 py-4">
				<div>
					<CardGroup>
						<div>
							<h2 className="font-semibold text-xl sm:text-2xl mb-2">
								Upload Book Cover
							</h2>
							<ul className="list-inside list-disc ps-4 text-muted-foreground">
								<li>tipe one something like image is 6x9</li>
								<li>tipe two I anything to fill this item</li>
								<li>tipe three qaree team is a greate one</li>
								<li>the image size should be png or jpeg</li>
							</ul>
						</div>

						<FormUploadImage
							form={form}
							name="coverUploaded"
							bookId={data.bookId}
							className="aspect-[6/9] w-full max-w-64 max-sm:mx-auto sm:max-w-48"
						/>
					</CardGroup>
					<p className="text-destructive mt-1 font-medium">
						{form.formState.errors.coverUploaded?.message}
					</p>
				</div>

				<div>
					<CardGroup>
						<div>
							<h2 className="font-semibold text-xl sm:text-2xl mb-2">
								Upload E-Book File
							</h2>
							<ul className="list-inside list-disc ps-4 text-muted-foreground">
								<li>item one </li>
								<li>item one </li>
								<li>item one </li>
							</ul>
						</div>
						<FormUploadFile
							form={form}
							name="fileUploaded"
							bookId={data.bookId}
							className="w-full max-w-64 max-sm:mx-auto aspect-video sm:max-w-48"
						/>
					</CardGroup>
					<p className="text-destructive mt-1 font-medium">
						{form.formState.errors.fileUploaded?.message}
					</p>
				</div>

				<FormMultiSelect
					form={form}
					name="sample"
					label="Select Book Sample"
					placeholder="Add New"
					disabled={!form.getValues("fileUploaded")}
					items={async () => getBookEPubContentAction(data.bookId)}
				/>

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

const CardGroup = ({ children }: { children: ReactNode }) => {
	return (
		<div className="border max-sm:flex-col gap-4 border-input p-4 rounded-md flex justify-between">
			{children}
		</div>
	);
};
