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

export type SelectItems = Array<{ label: string; value: string }>;

export type DeepNonNullable<T> = T extends object
	? T extends (infer U)[]
		? DeepNonNullable<U>[]
		: { [P in keyof T]-?: DeepNonNullable<NonNullable<T[P]>> }
	: NonNullable<T>;
