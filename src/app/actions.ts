"use server";

import { fetcher } from "@/lib/graphql/fetcher";
import {
	forgetPasswordMutation,
	resendResetPasswordOTPMutation,
	resendValidatingOTPMutation,
	signUpMutation,
	validateResetPasswordOTPMutation,
	verifyAccountMutation,
} from "@/lib/graphql/mutations";
import type { RegisterData } from "@/lib/graphql/types";
import { registerFormSchema } from "@/schema";
import { redirect } from "next/navigation";

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
		const { signup } = await fetcher({
			query: signUpMutation,
			variables: userData,
			cache: "default",
			server: true,
			protectid: false,
		});

		if (!signup) {
			return {
				success: false,
				message: "Failed to sign up",
			};
		}

		return {
			success: true,
			message: signup?.message as string,
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
		const { resendValidatingOTP } = await fetcher({
			query: resendValidatingOTPMutation,
			variables: userData,
			server: true,
			protectid: false,
		});

		if (!resendValidatingOTP?.success) {
			return {
				success: false,
				message:
					resendValidatingOTP?.message ||
					"Failed to resend the OTP code please tray again.",
			};
		}
		return {
			success: true,
			message: resendValidatingOTP.message as string,
		};
	} catch (error) {
		let message = "Something went wrong!";
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
		const { forgetPassword } = await fetcher({
			query: forgetPasswordMutation,
			variables: {
				email,
			},
			server: true,
			protectid: false,
			cache: "default",
		});

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

export const verifyAccountAction = async (variables: {
	email: string;
	otp: string;
}): Promise<ActionState> => {
	try {
		const { verifyAccount } = await fetcher({
			query: verifyAccountMutation,
			variables,
			server: true,
			protectid: false,
		});

		if (!verifyAccount?.success) {
			return {
				success: false,
				message: verifyAccount?.message || "Unexpected Error",
			};
		}

		return {
			success: true,
			message: verifyAccount.message as string,
		};
	} catch (error) {
		let message = "Something went wrong!";
		if (error instanceof Error) {
			message = error.message;
		}
		return {
			success: false,
			message,
		};
	}
};

export const validateResetPasswordOTPAction = async (variables: {
	email: string;
	otp: string;
}): Promise<ActionState> => {
	let token: string;

	try {
		const { validateResetPasswordOTP } = await fetcher({
			query: validateResetPasswordOTPMutation,
			variables,
			server: true,
			protectid: false,
			cache: "default",
		});
		if (!validateResetPasswordOTP?.success) {
			return {
				success: false,
				message: validateResetPasswordOTP?.message || "Invalid Server Response",
			};
		}
		token = validateResetPasswordOTP.reset_token as string;
	} catch (error) {
		let message = "Somethign went wrong!";
		if (error instanceof Error) {
			message = error.message;
		}

		return {
			success: false,
			message,
		};
	}

	redirect(`/signin/reset-password/${token}`);
};

export const resendResetPasswordOTPAction = async (variables: {
	email: string;
}): Promise<ActionState> => {
	try {
		const { resendResetPasswordOTP } = await fetcher({
			query: resendResetPasswordOTPMutation,
			variables,
			server: true,
			protectid: false,
			cache: "default",
		});

		if (!resendResetPasswordOTP?.success) {
			return {
				success: false,
				message:
					resendResetPasswordOTP?.message ||
					"Failed to send the code. Please try again later",
			};
		}

		return {
			success: true,
			message: resendResetPasswordOTP.message || "Code sent successfully",
		};
	} catch (error) {
		let message = "Something went wrong!";
		if (error instanceof Error) {
			message = error.message;
		}
		return {
			success: false,
			message,
		};
	}
};

export const resetPasswordAction = async (variables: {
	newPassword: string;
}) => {
	// rest actionf
};
