import { authOptions } from "@/lib/authOptions";
import { fetcher } from "@/lib/graphql/fetcher";
import { userInfoQuery } from "@/lib/graphql/queries";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function Dashboard() {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		redirect("/signin");
	}

	const { userInfo } = await fetcher({
		query: userInfoQuery,
		headers: {
			Authorization: `Bearer ${session.user.access_token}`,
		},
		server: true,
	});

	if (!userInfo) {
		return <h1 className="text-4xl">Something went wrong!</h1>;
	}

	const { name } = userInfo;

	return (
		<div className="px-24">
			<h1 className="text-4xl">
				Welcome, <span>{name}</span>
			</h1>
		</div>
	);
}

export default Dashboard;
