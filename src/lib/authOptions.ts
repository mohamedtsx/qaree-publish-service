import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";

import { env } from "../env";
import { signIn } from "./graphql";
import type { AuthUser } from "./graphql/types";

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
				const email = credentials?.email as string;
				const password = credentials?.password as string;

				if (!email || !password) return null;

				const res = await signIn({ email, password });

				if (res.status === 200 && res.data.signin) {
					const user = {
						id: "no-user-id!",
						access_token: res.data.signin?.access_token as string,
					};

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
	callbacks: {
		async jwt({ token, user }) {
			return { ...token, ...user };
		},
		async session({ session, token, user }) {
			session.user = token;
			return session;
		},
	},
	pages: {
		signIn: "/login",
	},
};

declare module "next-auth" {
	interface User extends AuthUser {}
	interface Session {
		user: AuthUser;
	}
}
declare module "next-auth/jwt" {
	interface JWT extends AuthUser {}
}
