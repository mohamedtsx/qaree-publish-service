import { z } from "zod";

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
