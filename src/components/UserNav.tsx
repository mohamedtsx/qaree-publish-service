import { fetcher } from "@/lib/graphql/fetcher";
import { userInfoQuery } from "@/lib/graphql/queries";
import UserDropdown from "./UserDropdown";

export async function UserNav() {
	const state = await fetcher({
		query: userInfoQuery,
		server: true,
		protectid: true,
	});

	if (!state?.userInfo) return;

	//@ts-ignore //Todo: Remove this comment once the backend updates the nullable values.
	return <UserDropdown userInfo={state.userInfo} />;
}
