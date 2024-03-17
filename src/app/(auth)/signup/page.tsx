import AuthLoginForm from "@/components/AuthLoginForm";
import AuthRegisterForm from "@/components/AuthRegisterForm";
import ThemeToggle from "@/components/ThemeToggle";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next/types";

export const metadata: Metadata = {
	title: "Sign In",
	description: "Sign in to Qaree publish service",
};

async function SignUp() {
	const session = await getServerSession(authOptions);

	if (session) {
		redirect("/dashboard");
	}

	return (
		<div className="container h-full flex flex-col">
			<div className="w-full flex justify-end py-5">
				<ThemeToggle />
			</div>
			<div className="flex-1 flex items-center justify-center">
				<AuthRegisterForm />
			</div>
		</div>
	);
}

export default SignUp;
