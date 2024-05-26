import { type NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { redirect } from "next/navigation";
import { fetcher } from "./graphql/fetcher";
import { signInMutation } from "./graphql/mutations";
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
			async authorize(credentials, req) {
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
	session: {
		maxAge: 60 * 55,
	},
	callbacks: {
		async jwt({ token, user, trigger, session }) {
			if (trigger === "update") {
				return { ...token, ...session.user };
			}
			if (user) {
				token.access_token = user.access_token;
			}

			return { ...token, ...user };
		},
		async session({ session, token }) {
			if (token) {
				session.user = token as AuthUser;
			}
			return session;
		},
	},
	pages: {
		signIn: "/",
	},
};

export async function getCurrentUser() {
	const session = await getServerSession(authOptions);

	if (!session) redirect("/signin");

	return session?.user;
}

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
