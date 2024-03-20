import AuthLoginForm from "@/components/AuthLoginForm";
import CenteredWrapper from "@/components/CenteredWrapper";
import { Loader2 } from "@/components/Loader2";
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
		<CenteredWrapper>
			<AuthLoginForm />
		</CenteredWrapper>
	);
}

export default Login;
