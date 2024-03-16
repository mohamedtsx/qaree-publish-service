// server side data fetching functions

import { fetcher } from "./fetcher";
import type { RegisterData } from "./types";
import { signUpMutation } from "./mutations";
import type { ResultOf, VariablesOf } from "gql.tada";

export const signUp = async (userData: RegisterData) => {
	return await fetcher<
		ResultOf<typeof signUpMutation>,
		VariablesOf<typeof signUpMutation>
	>({
		query: signUpMutation,
		variables: { ...userData },
	});
};
