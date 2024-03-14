"use client";

import { Form } from "./ui/form";

import { type LoginSchemaType, loginFormSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormInput, SubmitButton } from "./SmartForm";

function AuthLoginForm() {
	const form = useForm<LoginSchemaType>({
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
