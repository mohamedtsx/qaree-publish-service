import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const bookContentSchema = z.object({
	// this will be sent onsubmit
	sample: z.array(z.string()),
	// these for client validation
	fileUploaded: z.boolean(),
	coverUploaded: z.boolean(),
});

type BookContentSchema = z.infer<typeof bookContentSchema>;

export const Step2 = ({ onDone }: { onDone: () => void }) => {
	const onSubmit = (values: BookContentSchema) => {
		if (!values.coverUploaded) {
			form.setError("coverUploaded", {
				message: "Upload a cover for the book.",
			});
		}

		if (!values.fileUploaded) {
			form.setError("fileUploaded", { message: "Upload the ebook file." });
		}

		if (!values.sample.length) {
			form.setError("sample", { message: "Select at least one sample item." });
		}
	};

	const form = useForm<BookContentSchema>({
		mode: "onBlur",
		resolver: zodResolver(bookContentSchema),
		defaultValues: {
			coverUploaded: false,
			fileUploaded: false,
			sample: [],
		},
	});
	return <div>Step Two</div>;
};
