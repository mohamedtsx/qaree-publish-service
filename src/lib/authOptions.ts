import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";

import { env } from "./env";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
				},
				password: {
					label: "Password",
					type: "password",
				},
			},
			async authorize(credentials) {
				const res = await fetch("/your/endpoint", {
					method: "POST",
					body: JSON.stringify(credentials),
					headers: { "Content-Type": "application/json" },
				});
				const user = await res.json();

				if (res.ok && user) {
					return user;
				}

				return null;
			},
		}),
		GitHubProvider({
			clientId: env.GITHUB_ID,
			clientSecret: env.GITHUB_SECRET,
		}),
	],
};
