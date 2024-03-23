import { z } from "zod";

const errors = {
	name: "Book name should be at least 2 characters",
	cover: "Please select a book cover image.",
	book: "Please upload a valid EPUB file",
	sample: "A sample file is required",
	description: "Description should be at least 10 characters",
	language: "Please select book language",
	publishingRights: "Please confirm publishing rights",
};

const filesSchema = z.object({
	cover: z.instanceof(File, {
		message: errors.cover,
	}),
	book: z.instanceof(File, {
		message: errors.book,
	}),
	sample: z.instanceof(File, {
		message: errors.sample,
	}),
});

const bookDetailesSchema = z.object({
	name: z.string().min(2, {
		message: errors.name,
	}),
	description: z.string().min(10, { message: errors.description }),
	// todo should be z.array(z.string()) but keep it string for know
	categories: z.string(),
	language: z.string().min(1, { message: errors.language }),
	// todo should be boolean but keep it string for know
	publishingRights: z.string({
		required_error: errors.publishingRights,
	}),
});

type MediaType = z.infer<typeof filesSchema>;

export const publishDefaultValues: Omit<PublishSchemaType, keyof MediaType> = {
	name: "",
	categories: [""],
	description: "",
	language: "",
	publishingRights: "false",
};

export const publishSchema = bookDetailesSchema.and(filesSchema);
export type PublishSchemaType = z.infer<typeof publishSchema>;
