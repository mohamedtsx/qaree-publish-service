"use client";

import { Form } from "./ui/form";

import { type LoginSchemaType, loginFormSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormInput, SubmitButton } from "./SmartForm";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function AuthLoginForm() {
	const form = useForm<LoginSchemaType>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
		},
	});

	const router = useRouter();

	const [errorMessage, setErrorMessage] = useState("");

	const onSubmit = async (values: LoginSchemaType) => {
		const { email, password } = values;

		if (!email || !password) {
			return setErrorMessage("Both email & password are required");
		}

		const res = await signIn("credentials", {
			redirect: false,
			...values,
		});

		if (res?.error) {
			console.log(res.error);
			return setErrorMessage(res.error);
		}

		console.log("sucess");
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
				<FormInput
					form={form}
					name="email"
					label="Enter you email"
					placeholder="a placeholder"
				/>
				<FormInput
					form={form}
					name="password"
					label="Enter you password"
					placeholder="a placeholder"
				/>
				<SubmitButton>submit</SubmitButton>
			</form>
		</Form>
	);
}

export default AuthLoginForm;
