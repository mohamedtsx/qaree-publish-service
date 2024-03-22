import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import type { AuthUser } from "./graphql/types";
import { signInMutation } from "./graphql/mutations";
import { fetcher } from "./graphql/fetcher";

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

				const { signin } = await fetcher({
					query: signInMutation,
					variables: {
						email,
						password,
					},
					server: true,
					protectid: false,
				});

				if (!signin?.access_token) return null;

				const user = {
					access_token: signin.access_token,
				};

				return user;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user, trigger, session }) {
			if (trigger === "update") {
				return { ...token, ...session.user };
			}
			return { ...token, ...user };
		},
		async session({ session, token }) {
			session.user = token;
			return session;
		},
	},
	pages: {
		signIn: "/",
	},
};

declare module "next-auth" {
	interface User extends AuthUser {
		id?: string;
	}
	interface Session {
		user: AuthUser;
	}
}
declare module "next-auth/jwt" {
	interface JWT extends AuthUser {}
}
