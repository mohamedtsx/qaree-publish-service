"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Icons } from "./Icons";
import { SubmitButton, FormInput } from "./SmartForm";
import { Button } from "./ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "./ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Form } from "./ui/form";

const emailEnterySchema = z.object({
	email: z.string().email(),
});

function AuthEmailEnteryForm() {
	const form = useForm<z.infer<typeof emailEnterySchema>>({
		resolver: zodResolver(emailEnterySchema),
		defaultValues: {
			email: "",
		},
	});

	const router = useRouter();

	const onSubmit = async (values: z.infer<typeof emailEnterySchema>) => {
		const { success } = z
			.object({
				email: z.string().email(),
			})
			.safeParse(values);

		if (!success) {
			toast.error("Invalid email");
		}

		// const res = await forgotPasswordAction(values.email);

		// if (!res.success) {
		// 	return toast.error(res.message);
		// }

		// toast.success(res.message);
		router.push(`/signin/identify?email=${values.email}`);
	};

	return (
		<Card className="w-full max-w-lg">
			<CardHeader className="space-y-2">
				<CardTitle className="text-2xl">Sign In</CardTitle>
				<CardDescription>
					Please provide your email address. If your account is valid, an OTP
					will be sent to reset your password.
				</CardDescription>
			</CardHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
					<CardContent className="grid gap-4">
						<FormInput
							form={form}
							name="email"
							label="Email"
							type="email"
							placeholder="Enter your email address"
						/>
					</CardContent>
					<CardFooter className="flex flex-col">
						<SubmitButton>Send OTP</SubmitButton>
						<Link
							href={"/signin"}
							className="text-sm text-muted-foreground w-fit self-start mt-5 hover:underline"
						>
							Back to sign in
						</Link>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
}

export default AuthEmailEnteryForm;
