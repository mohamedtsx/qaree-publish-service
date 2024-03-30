import { fetcher } from "@/lib/graphql/fetcher";
import { userInfoQuery } from "@/lib/graphql/queries";
import UserDropdown from "./UserDropdown";
import { getCurrentUser } from "@/lib/authOptions";

export async function UserNav() {
	const user = getCurrentUser();
	if (!user) return;

	const state = await fetcher({
		query: userInfoQuery,
		server: true,
		protectid: true,
	});

	if (!state?.userInfo) return;

	//@ts-ignore //Todo: Remove this comment once the backend updates the nullable values.
	return <UserDropdown userInfo={state.userInfo} />;
}
