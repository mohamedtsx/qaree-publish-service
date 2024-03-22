"use client";

import {
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Form } from "./ui/form";
import { useForm } from "react-hook-form";
import {
	verifyAccountFormSchema,
	type VerifyAccountSchemaType,
} from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInputOTP, SubmitButton } from "./SmartForm";
import { toast } from "sonner";
import {
	resendResetPasswordOTPAction,
	validateResetPasswordOTPAction,
} from "@/app/actions";
import { useSession } from "next-auth/react";

function AuthResetPasswordOTP({ email }: { email: string }) {
	const form = useForm<VerifyAccountSchemaType>({
		resolver: zodResolver(verifyAccountFormSchema),
		defaultValues: {
			otp: "",
		},
	});

	const { data: session } = useSession();

	const onSubmit = async (values: { otp: string }) => {
		const { success, message } = await validateResetPasswordOTPAction({
			email,
			otp: values.otp,
		});

		if (!success) {
			return toast.error(message);
		}

		console.log(session);

		toast.success(message);
	};

	const resendHandler = async () => {
		try {
			const res = await resendResetPasswordOTPAction({
				email,
			});

			if (!res.success) {
				throw Error(res.message);
			}

			toast.success(res.message);
		} catch (error) {
			if (error instanceof Error) {
				return toast.error(error.message);
			}
			toast.error("Unexpected Error");
		}
	};

	return (
		<>
			<CardHeader className="space-y-3">
				<CardTitle className="text-2xl">Enter OTP</CardTitle>
				<CardDescription>
					Qaree just sent you a 6-Digit Code to{" "}
					<span className="text-secondary-foreground">{email}</span> please
					check your inbox and enter the code below
				</CardDescription>
			</CardHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
					<CardContent className="flex justify-center">
						<FormInputOTP form={form} name="otp" />
					</CardContent>
					<CardFooter className="flex flex-col gap-2">
						<SubmitButton>Verify Code</SubmitButton>
						<div className="text-sm text-muted-foreground w-full mt-5">
							Didn't receive the code?{" "}
							<button
								type="button"
								className="hover:text-secondary-foreground transition"
								onClick={resendHandler}
							>
								Send again
							</button>
						</div>
					</CardFooter>
				</form>
			</Form>
		</>
	);
}

export default AuthResetPasswordOTP;
