export type ApiResponse<T> = {
	status: number;
	data: T;
};

export type RegisterData = {
	name: string;
	email: string;
	password: string;
};
