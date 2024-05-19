import { addBookSampleAction } from "@/app/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const bookContentSchema = z.object({
	// this will be sent onsubmit
	sample: z.array(z.string()),
	// these for client validation
	fileUploaded: z.boolean(),
	coverUploaded: z.boolean(),
});

type BookContentSchema = z.infer<typeof bookContentSchema>;

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
	const onSubmit = async (values: BookContentSchema) => {
		// if form is not dirty you could call onDone directly here
		if (!values.coverUploaded) {
			form.setError("coverUploaded", {
				message: "Upload a cover for the book.",
			});
		}

		if (!values.fileUploaded) {
			return form.setError("fileUploaded", {
				message: "Upload the ebook file.",
			});
		}

		if (!values.sample.length) {
			form.setError("sample", { message: "Select at least one sample item." });
		}

		const { sucess, message } = await addBookSampleAction({
			bookId: data.bookId,
			sample: values.sample,
		});

		if (!sucess) {
			return toast.error(message);
		}

		onDone();
	};

	const form = useForm<BookContentSchema>({
		mode: "onBlur",
		resolver: zodResolver(bookContentSchema),
		defaultValues: data.defaultValues || {
			coverUploaded: false,
			fileUploaded: false,
			sample: [],
		},
	});
	return <div>Step Two</div>;
};
