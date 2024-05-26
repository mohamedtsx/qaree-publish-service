import { fetcher } from "@/lib/graphql/fetcher";
import { getAccountInfo } from "@/lib/graphql/queries";
import { tags } from "@/lib/graphql/tags";

const getData = async () => {
	const { userInfo } = await fetcher({
		query: getAccountInfo,
		server: true,
		tags: [tags.user],
	});

	return userInfo as NonNullable<typeof userInfo>;
};

export default async function Dashboard() {
	const { name } = await getData();

	return (
		<div className="container py-14">
			<h1 className="text-4xl">
				Welcome, <span>{name}</span>
			</h1>
		</div>
	);
}
