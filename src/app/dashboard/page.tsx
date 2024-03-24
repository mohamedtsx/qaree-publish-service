import { fetcher } from "@/lib/graphql/fetcher";
import { userInfoQuery } from "@/lib/graphql/queries";

async function Dashboard() {
	const { userInfo } = await fetcher({
		query: userInfoQuery,
		server: true,
		protectid: true,
	});

	if (!userInfo) {
		return <h1 className="text-4xl">Something went wrong!</h1>;
	}

	const { name } = userInfo;

	return (
		<div className="container py-14">
			<h1 className="text-4xl">
				Welcome, <span>{name}</span>
			</h1>
		</div>
	);
}

export default Dashboard;
