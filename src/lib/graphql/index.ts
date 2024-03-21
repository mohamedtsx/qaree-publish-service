import { fetcher } from "./fetcher";

import {
	forgetPasswordMutation,
	resendValidatingOTPMutation,
	signInMutation,
	signUpMutation,
	verifyAccountMutation,
} from "./mutations";

import type { LoginSchemaType, RegisterSchemaType } from "@/schema";
import { userInfoQuery } from "./queries";

// Remember you shouldn't call this fun in client components instead use ser-action
// If you cannot to use server actions use the route handler

export const signUp = async (userData: RegisterSchemaType) =>
	await fetcher({
		query: signUpMutation,
		variables: userData,
		cache: "default",
	});

// called in the client !
export const verifyAccount = async (accountData: {
	otp: string;
	email: string;
}) =>
	await fetcher({
		query: verifyAccountMutation,
		variables: accountData,
	});

export const resendValidatingOTP = async (data: { email: string }) =>
	await fetcher({
		query: resendValidatingOTPMutation,
		variables: data,
	});

export const signIn = async (userData: LoginSchemaType) =>
	await fetcher({
		query: signInMutation,
		variables: userData,
	});

export const forgotPassword = async (email: string) =>
	await fetcher({
		query: forgetPasswordMutation,
		variables: {
			email,
		},
	});

export const getUserInfo = async (token: string) =>
	await fetcher({
		query: userInfoQuery,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
