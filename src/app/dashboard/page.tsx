import { authOptions } from "@/lib/authOptions";
import { getUserInfo } from "@/lib/graphql";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

async function Dashboard() {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		redirect("/signin");
	}

	// todo remove this data is not required in this page
	const res = await getUserInfo(session.user.access_token);
	const user = res.data.userInfo;

	if (!user) {
		return <h1 className="text-4xl">Something went wrong!</h1>;
	}

	const { name } = user;

	return (
		<div className="px-24">
			<h1 className="text-4xl">
				Welcome, <span>{name}</span>
			</h1>
		</div>
	);
}

export default Dashboard;
