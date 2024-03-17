import { z } from "zod";

export const registerFormSchema = z.object({
	email: z.string().email(),
	name: z.string().min(3),
	password: z.string().min(4),
});

export const verifyAccountFormSchema = z.object({
	otp: z.string().length(6),
});

export const loginFormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(3),
});

export type RegisterSchemaType = z.infer<typeof registerFormSchema>;
export type VerifyAccountSchemaType = z.infer<typeof verifyAccountFormSchema>;
export type LoginSchemaType = z.infer<typeof loginFormSchema>;
