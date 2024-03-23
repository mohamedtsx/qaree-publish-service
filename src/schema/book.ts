import { z } from "zod";

// todo add better validation
const filesSchema = z.object({
	cover: z.instanceof(File, {
		message: "Please select a book cover image.",
	}),
	book: z.instanceof(File, {
		message: "Please upload a valid EPUB file",
	}),
	sample: z.instanceof(File, {
		message: "A sample file is required",
	}),
});

const bookDetailesSchema = z.object({
	name: z.string().min(2),
	description: z.string().min(10),
	categories: z.array(z.string()),
	language: z.string(),
	publishingRights: z.boolean(),
});

type MediaType = z.infer<typeof filesSchema>;

export const publishDefaultValues: Omit<PublishSchemaType, keyof MediaType> = {
	name: "",
	categories: [""],
	description: "",
	language: "",
	publishingRights: false,
};

export const publishSchema = bookDetailesSchema.and(filesSchema);
export type PublishSchemaType = z.infer<typeof publishSchema>;
