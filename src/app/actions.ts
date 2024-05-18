"use server";

import { getCurrentUser } from "@/lib/authOptions";
import { UPLOAD_FULL_URL } from "@/lib/graphql";
import { fetcher } from "@/lib/graphql/fetcher";
import {
	editBookMutation,
	forgetPasswordMutation,
	moveBookToRecycleBinMutation,
	publishBookMutation,
	resendResetPasswordOTPMutation,
	resendValidatingOTPMutation,
	resetPasswordMutation,
	signUpMutation,
	validateResetPasswordOTPMutation,
	verifyAccountMutation,
} from "@/lib/graphql/mutations";
import { addBookDetailsMutation } from "@/lib/graphql/mutations";
import type {
	PureBookDetailesSchemaType,
	RegisterData,
} from "@/lib/graphql/types";
import { type EditBookType, registerFormSchema } from "@/schema";
import type { ResultOf } from "gql.tada";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { tags } from "@/lib/graphql/tags";

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
			revalidate: 0,
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

	redirect(`/signin/reset-password/${token}?email=${variables.email}`);
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
			revalidate: 0,
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

export const resetPasswordAction = async (payload: {
	newPassword: string;
	token: string;
}): Promise<ActionState> => {
	try {
		const { resetPassword } = await fetcher({
			query: resetPasswordMutation,
			variables: { newPassword: payload.newPassword },
			protectid: false,
			server: true,
			headers: {
				Authorization: `Bearer ${payload.token}`,
			},
		});

		if (!resetPassword?.message) {
			throw Error("Failed to Reset Password");
		}

		// no success state in the backend schema!
		return {
			success: true,
			message: resetPassword.message || "Success",
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

type StateWithData<T> = ActionState & {
	data?: T;
};

export const addBookDetailsAction = async (
	bookDetailes: PureBookDetailesSchemaType,
): Promise<StateWithData<ResultOf<typeof addBookDetailsMutation>>> => {
	try {
		const data = await fetcher({
			query: addBookDetailsMutation,
			variables: bookDetailes,
			server: true,
			protectid: true,
		});

		if (!data.addBookDetails) {
			throw Error("Fetcher Error");
		}

		return {
			success: true,
			message: "Success",
			data,
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

export const uploadCoverAction = async (
	formData: FormData,
	bookId: string,
): Promise<ActionState> => {
	const user = await getCurrentUser();

	// todo first do it second do it better
	try {
		await fetch(UPLOAD_FULL_URL.cover(bookId), {
			method: "POST",
			headers: {
				Authorization: `Bearer ${user.access_token}`,
				accept: "application/json",
				contentType: "multipart/form-data",
			},
			body: formData,
		});

		return {
			success: true,
			message: "Success",
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

export const publishBookAction = async (bookId: string) => {
	try {
		await fetcher({
			query: publishBookMutation,
			server: true,
			protectid: true,
			variables: { bookId },
		});

		revalidateTag(tags.books);
		return {
			success: true,
			message: "Congratulations! Your book has been uploaded successfully 📚🎉",
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

export const updateBookAction = async (
	bookId: string,
	values: EditBookType,
): Promise<ActionState> => {
	try {
		const { editBookDetails } = await fetcher({
			query: editBookMutation,
			variables: {
				...values,
				bookId,
				publishingRights: values.publishingRights === "true",
			},
			server: true,
			protectid: true,
		});

		revalidateTag(tags.books);
		return {
			success: true,
			message: `'${editBookDetails?.name}' book has been successfully updated!`,
		};
	} catch (error) {
		let message = "Error: faild to update book data";
		if (error instanceof Error) {
			message = error.message;
		}
		return {
			success: false,
			message,
		};
	}
};

export const moveBookToRecycleBinAction = async (
	bookId: string,
): Promise<ActionState> => {
	try {
		const { moveBookToRecycleBin } = await fetcher({
			query: moveBookToRecycleBinMutation,
			variables: {
				bookId,
			},
			server: true,
			protectid: true,
		});

		if (!moveBookToRecycleBin?.success) {
			throw Error(moveBookToRecycleBin?.message || "Something went wrong!");
		}

		const { success, message } = moveBookToRecycleBin;

		revalidateTag(tags.books);
		revalidateTag(tags.bin);

		return {
			success,
			message: message ? message : "Done",
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

export const moveBookFromRecycleBinAction = async (bookId: string) => {
	// move to to recycle bin fetcher
};
