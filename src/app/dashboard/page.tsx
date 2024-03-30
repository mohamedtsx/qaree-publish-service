import { getCurrentUser } from "@/lib/authOptions";
import { fetcher } from "@/lib/graphql/fetcher";
import { userInfoQuery } from "@/lib/graphql/queries";

async function getUserInfo() {
	const { userInfo } = await fetcher({
		query: userInfoQuery,
		server: true,
		protectid: true,
	});

	return userInfo;
}

export default async function Dashboard() {
	const user = await getCurrentUser();
	if (!user) return;

	const userInfo = await getUserInfo();

	if (!userInfo) return;
	const { name } = userInfo;

	return (
		<div className="container py-14">
			<h1 className="text-4xl">
				Welcome, <span>{name}</span>
			</h1>
		</div>
	);
}
