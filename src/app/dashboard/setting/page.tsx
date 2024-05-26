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
	const { name, avatar, bio, createdAt, email, updatedAt } = await getData();

	return (
		<div className="space-y-12 max-w-6xl mx-auto py-20 ">
			<header>
				<h2
					className="text-2xl sm:text-3xl font-medium mb-2 capitalize"
					dir="auto"
				>
					{name}
				</h2>
				<p className="max-sm:text-sm max-w-5xl text-balance text-muted-foreground">
					{bio ? (
						bio
					) : (
						<>
							Welcome to your Publish Profile. Here, you wield full control over
							your digital identity. Customize your avatar to reflect your
							unique personality and update essential account details such as
							your bio, username and password.
						</>
					)}
				</p>
			</header>
			<Separator />
			<div className="space-y-8">
				<UserUpdateAccount oldName={name as string} bio={bio} />
				<UpdateAvatar
					avatar={{
						path: avatar?.path ?? "",
						name: name ?? "Qaree",
					}}
				/>
				<DeleteAccount />
			</div>
		</div>
	);
}
