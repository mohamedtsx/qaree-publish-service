"use client";

import React from "react";
import { Form } from "./ui/form";
import { useForm } from "react-hook-form";
import {
	type ResetPasswordSchemaType,
	resetPasswordFormSchema,
} from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput, SubmitButton } from "./SmartForm";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";

function AuthResetPasswordForm({ token }: { token: string }) {
	// todo send token validation request

	const onSubmit = async (values: ResetPasswordSchemaType) => {};

	const form = useForm<ResetPasswordSchemaType>({
		resolver: zodResolver(resetPasswordFormSchema),
		defaultValues: {
			password: "",
			confirm_password: "",
		},
	});

	return (
		<Card className="w-full max-w-lg">
			<CardHeader className="space-y-2">
				<CardTitle className="text-2xl">Reset Password</CardTitle>
				<CardDescription>
					Generate a new password to regain access to your account.
				</CardDescription>
			</CardHeader>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="grid gap-4">
						<FormInput
							form={form}
							label="New Password"
							type="password"
							name="password"
						/>

						<FormInput
							form={form}
							label="Confirm Password"
							name="confirm_password"
							type="password"
						/>

						<SubmitButton />
					</CardContent>
				</form>
			</Form>
		</Card>
	);
}

export default AuthResetPasswordForm;
