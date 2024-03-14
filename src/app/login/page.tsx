import AuthLoginForm from "@/components/AuthLoginForm";
import type { Metadata } from "next/types";
import React from "react";

export const metadata: Metadata = {
	title: "Sign In",
	description: "Sign in to Qaree publish service",
};

function Login() {
	return (
		<div className="container flex items-center h-full justify-center">
			<AuthLoginForm />
		</div>
	);
}

export default Login;
