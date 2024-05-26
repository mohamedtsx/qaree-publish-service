import { DeleteAccount } from "@/components/DeleteAccount";
import { UpdateAvatar } from "@/components/UpdateAvatar";
import { Separator } from "@/components/ui/separator";
import { tags } from "@/lib/graphql/tags";
import { fetcher } from "@/lib/graphql/fetcher";
import { getAccountInfo } from "@/lib/graphql/queries";
import type { Metadata } from "next";
import { UserUpdateAccount } from "@/components/UserUpdateForm";

export const metadata: Metadata = {
	title: "Setting",
};

const getData = async () => {
	const { userInfo } = await fetcher({
		query: getAccountInfo,
		server: true,
		tags: [tags.user],
	});

	return userInfo as NonNullable<typeof userInfo>;
};

export default async function Account() {
	const { name, avatar, bio } = await getData();

	return (
		<div className="space-y-8">
			<header>
				<h1 className="text-2xl sm:text-3xl font-medium mb-2">Admin Profile</h1>
				<p className="max-sm:text-sm max-w-5xl text-balance text-muted-foreground">
					Welcome to your Admin Profile dashboard. Here, you wield full control
					over your digital identity. Customize your avatar to reflect your
					unique personality and update essential account details such as your
					username and password.
				</p>
			</header>
			<Separator />
			<div className="grid 2xl:grid-cols-[1fr_0.5fr] gap-4">
				<UserUpdateAccount oldName={name as string} bio={bio} />
				<div className="flex flex-col gap-4">
					<UpdateAvatar
						avatar={{
							path: avatar?.path ?? "",
							name: name ?? "Qaree",
						}}
					/>
					<DeleteAccount />
				</div>
			</div>
		</div>
	);
}
