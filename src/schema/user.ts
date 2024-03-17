import { z } from "zod";

export const loginFormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(3),
});

export type LoginSchemaType = z.infer<typeof loginFormSchema>;
