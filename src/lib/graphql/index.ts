import type { ResultOf, VariablesOf } from "gql.tada";
import { fetcher } from "./fetcher";
import { signInMutation, signUpMutation } from "./mutations";
import type { LoginData, RegisterData } from "./types";

export const signUp = async (userData: RegisterData) => {
	return await fetcher<
		ResultOf<typeof signUpMutation>,
		VariablesOf<typeof signUpMutation>
	>({
		query: signUpMutation,
		variables: { ...userData },
		cache: "default",
	});
};

export const signIn = async (userData: LoginData) => {
	return await fetcher<
		ResultOf<typeof signInMutation>,
		VariablesOf<typeof signInMutation>
	>({
		query: signInMutation,
		variables: { ...userData },
	});
};
