import UserDropdown from "./UserDropdown";
import { fetcher } from "@/lib/graphql/fetcher";
import { userInfoQuery } from "@/lib/graphql/queries";

export async function UserNav() {
	const { userInfo } = await fetcher({
		query: userInfoQuery,
		server: true,
		protectid: true,
	});

	if (!userInfo) return;

	//@ts-ignore //Todo: Remove this comment once the backend updates the nullable values.
	return <UserDropdown userInfo={userInfo} />;
}
