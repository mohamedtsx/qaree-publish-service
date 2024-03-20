import { authOptions } from "@/lib/authOptions";
import { getUserInfo } from "@/lib/graphql";
import { getServerSession } from "next-auth";
import UserDropdown from "./UserDropdown";

export async function UserNav() {
	const session = await getServerSession(authOptions);

	if (!session) return null;

	const {
		data: { userInfo },
	} = await getUserInfo(session.user.access_token);

	if (!userInfo) return;

	//@ts-ignore //Todo: Remove this comment once the backend updates the nullable values.
	return <UserDropdown userInfo={userInfo} />;
}
