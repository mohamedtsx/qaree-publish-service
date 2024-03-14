"use client";

import React from "react";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";

import { loginFormSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { FormInput, SubmitButton } from "./SmartForm";

// todo create smart react hook form

function AuthLoginForm() {
	const form = useForm<z.infer<typeof loginFormSchema>>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async () => {};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
				<FormInput
					form={form}
					name="email"
					label="Enter you email"
					placeholder="a placeholder"
				/>
				<SubmitButton>submit</SubmitButton>
			</form>
		</Form>
	);
}

export default AuthLoginForm;
