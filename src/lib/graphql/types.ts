type ApiResponseSuccess<T> = {
	data: T;
};

type ApiErrorResponse = {
	errors: {
		message: string;
		locations: { line: number; column: number }[];
		path: string[];
	}[];
};

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiErrorResponse;

export type AuthUser = {
	access_token: string;
};

export type RegisterData = {
	name: string;
	email: string;
	password: string;
};

export type LoginData = {
	email: string;
	password: string;
};
