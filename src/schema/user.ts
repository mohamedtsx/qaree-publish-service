import { string, z } from "zod";

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

const errors = {
	name: "Enter your name",
	oldPassword: "Enter the old password",
	newPassword: "Enter the new password",
	avatar: "Upload avatar image",
};

const invalid = {
	name: "Invalid name",
	newPassword: "New password is invalid",
};

export const resetPasswordFormSchema = z
	.object({
		password: z.string().min(8),
		confirm_password: z.string(),
	})
	.refine((arg) => arg.password === arg.confirm_password, {
		message: "The passwords did not match",
		path: ["confirm_password"],
	});

export const updateAccountSchema = z.object({
	name: z
		.string({ required_error: errors.name })
		.min(3, { message: errors.name }),
	bio: z
		.string()
		.min(1, {
			message: "Enter the bio",
		})
		.min(10, {
			message: "Enter 10 characters at least",
		})
		.nullable(),
	oldPassword: z.string().min(1, {
		message: errors.oldPassword,
	}),
	newPassword: z.string({ required_error: errors.newPassword }).min(8, {
		message: invalid.newPassword,
	}),
});

export type UpdateAccountSchema = z.infer<typeof updateAccountSchema>;

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordFormSchema>;
export type RegisterSchemaType = z.infer<typeof registerFormSchema>;
export type VerifyAccountSchemaType = z.infer<typeof verifyAccountFormSchema>;
export type LoginSchemaType = z.infer<typeof loginFormSchema>;
