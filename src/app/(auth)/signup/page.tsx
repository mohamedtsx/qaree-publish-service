import AuthLoginForm from "@/components/AuthLoginForm";
import AuthRegisterForm from "@/components/AuthRegisterForm";
import CenteredWrapper from "@/components/CenteredWrapper";
import ThemeToggle from "@/components/ThemeToggle";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next/types";

export const metadata: Metadata = {
	title: "Sign Up",
	description: "Sign up to Qaree publish service",
};

async function SignUp() {
	const session = await getServerSession(authOptions);

	if (session) {
		redirect("/dashboard");
	}

	return (
		<CenteredWrapper>
			<AuthRegisterForm />
		</CenteredWrapper>
	);
}

export default SignUp;
