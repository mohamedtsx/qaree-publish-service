import type { ResultOf, VariablesOf } from "gql.tada";

import { fetcher } from "./fetcher";

import {
	resendValidatingOTPMutation,
	signInMutation,
	signUpMutation,
	verifyAccountMutation,
} from "./mutations";

import type { LoginSchemaType, RegisterSchemaType } from "@/schema";

export const signUp = async (userData: RegisterSchemaType) =>
	await fetcher<
		ResultOf<typeof signUpMutation>,
		VariablesOf<typeof signUpMutation>
	>({
		query: signUpMutation,
		variables: userData,
		cache: "default",
	});

export const verifyAccount = async (accountData: {
	otp: string;
	email: string;
}) =>
	await fetcher<
		ResultOf<typeof verifyAccountMutation>,
		VariablesOf<typeof verifyAccountMutation>
	>({
		query: verifyAccountMutation,
		variables: accountData,
	});

export const resendValidatingOTP = async (data: { email: string }) =>
	await fetcher<
		ResultOf<typeof resendValidatingOTPMutation>,
		VariablesOf<typeof resendValidatingOTPMutation>
	>({
		query: resendValidatingOTPMutation,
		variables: data,
	});

export const signIn = async (userData: LoginSchemaType) =>
	await fetcher<
		ResultOf<typeof signInMutation>,
		VariablesOf<typeof signInMutation>
	>({
		query: signInMutation,
		variables: userData,
	});
