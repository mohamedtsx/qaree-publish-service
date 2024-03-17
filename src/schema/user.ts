import { z } from "zod";

export const loginFormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(3),
});

export const registerFormSchema = z.object({
	email: z.string().email(),
	name: z.string().min(3),
	password: z.string().min(4),
});

export type RegisterSchemaType = z.infer<typeof registerFormSchema>;
export type LoginSchemaType = z.infer<typeof loginFormSchema>;
