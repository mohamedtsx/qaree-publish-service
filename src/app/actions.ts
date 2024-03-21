"use server";

import { forgotPassword, resendValidatingOTP, signUp } from "@/lib/graphql";
import type { RegisterData } from "@/lib/graphql/types";
import { registerFormSchema } from "@/schema";

type ActionState = {
	success: boolean;
	message: string;
};

export const registerAction = async (
	userData: RegisterData,
): Promise<ActionState> => {
	const result = registerFormSchema.safeParse(userData);

	if (!result.success) {
		const errorMessage = result.error.message;
		return {
			success: false,
			message: errorMessage,
		};
	}

	try {
		const signupRes = await signUp(userData);
		if (signupRes.status !== 200 || !signupRes.data.signup) {
			return {
				success: false,
				message: "Failed to sign up",
			};
		}

		return {
			success: true,
			message: signupRes.data.signup?.message as string,
		};
	} catch (error) {
		let errorMessage = "Register Unexpected Error!";

		if (error instanceof Error) {
			errorMessage = error.message;
		}

		return {
			success: false,
			message: errorMessage,
		};
	}
};

export const resendValidatingOTPAction = async ({
	userData,
}: {
	userData: { email: string };
}): Promise<ActionState> => {
	try {
		const res = await resendValidatingOTP(userData);
		if (!res.data.resendValidatingOTP?.success) {
			return {
				success: false,
				message: "Failed to resend the OTP code please tray again.",
			};
		}
		return {
			success: true,
			message: res.data.resendValidatingOTP.message as string,
		};
	} catch (error) {
		let message = "RESEND_OTP_ERROR: Unexpected Error";
		if (error instanceof Error) {
			message = error.message;
		}

		return {
			success: false,
			message,
		};
	}
};

export const forgotPasswordAction = async (
	email: string,
): Promise<ActionState> => {
	if (!email) {
		return { success: false, message: "Invalid email" };
	}

	try {
		const {
			data: { forgetPassword },
		} = await forgotPassword(email);

		if (!forgetPassword?.success) {
			throw Error(forgetPassword?.message || "Something went wrong");
		}

		return {
			success: true,
			message: forgetPassword.message || "success",
		};
	} catch (error) {
		let message = "Unexpected Error";
		if (error instanceof Error) {
			message = error.message;
		}
		return { success: false, message };
	}
};
