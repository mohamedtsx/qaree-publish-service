export type ApiResponse<T> = {
	status: number;
	data: T;
};

export type GraphQLError<T> = {
	errors: {
		message: string;
		location: {
			line: number;
			column: number;
		}[];
		path: string[];
	}[];
	data: {
		[P in keyof T]: null;
	};
};

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
