import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import UserDropdown from "./UserDropdown";
import { fetcher } from "@/lib/graphql/fetcher";
import { userInfoQuery } from "@/lib/graphql/queries";

export async function UserNav() {
	const session = await getServerSession(authOptions);

	if (!session) return null;

	const { userInfo } = await fetcher({
		query: userInfoQuery,
		headers: {
			Authorization: `Bearer ${session.user.access_token}`,
		},
		server: true,
	});

	if (!userInfo) return;

	//@ts-ignore //Todo: Remove this comment once the backend updates the nullable values.
	return <UserDropdown userInfo={userInfo} />;
}
