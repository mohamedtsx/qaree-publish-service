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
import { verifyAccount } from "@/lib/graphql";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import type { LoginData } from "@/lib/graphql/types";
import { useRouter } from "next/navigation";
import { resendValidatingOTPAction } from "@/app/actions";

function AuthVerificationForm({ userData }: { userData: LoginData }) {
	const { email } = userData;
	const router = useRouter();

	const form = useForm<VerifyAccountSchemaType>({
		resolver: zodResolver(verifyAccountFormSchema),
		defaultValues: {
			otp: "",
		},
	});

	const onSubmit = async (values: { otp: string }) => {
		try {
			const data = await verifyAccount({
				email,
				otp: values.otp,
			});

			toast.success(data.verifyAccount?.message);

			await signIn("credentials", {
				redirect: false,
				...userData,
			});

			router.push("/dashboard");
		} catch (error) {
			if (error instanceof Error) {
				return toast.error(error.message);
			}
			toast.error("Unexpected Error");
		}
	};

	const resendHandler = async () => {
		try {
			const res = await resendValidatingOTPAction({
				userData: {
					email,
				},
			});
			if (!res.success) {
				throw Error(res.message);
			}
			toast.success("An OTP code has been sent.");
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.name);
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

export default AuthVerificationForm;
