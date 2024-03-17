import AuthLoginForm from "@/components/AuthLoginForm";
import ThemeToggle from "@/components/ThemeToggle";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next/types";

export const metadata: Metadata = {
	title: "Sign In",
	description: "Sign in to Qaree publish service",
};

async function Login() {
	const session = await getServerSession(authOptions);

	if (session) {
		redirect("/dashboard");
	}

	return (
		<div className="container flex h-full">
			<div className="flex-1 flex items-center justify-center">
				<AuthLoginForm />
			</div>
		</div>
	);
}

export default Login;
