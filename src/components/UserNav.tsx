import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownLogoutItem,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { fetcher } from "@/lib/graphql/fetcher";
import { getAccountInfo } from "@/lib/graphql/queries";
import { tags } from "@/lib/graphql/tags";
import Link from "next/link";
import { Button } from "./ui/button";

const getData = async () => {
	const { userInfo } = await fetcher({
		query: getAccountInfo,
		server: true,
		tags: [tags.user],
	});

	return userInfo as NonNullable<typeof userInfo>;
};

async function UserNav() {
	const user = await getData();

	const { name, email, avatar } = user;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative size-8 rounded-full">
					<Avatar className="size-8">
						<AvatarImage src={avatar?.path || ""} alt={`@${name}`} />
						<AvatarFallback>
							{name ? name[0].toUpperCase() : "Q"}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{name}</p>
						<p className="text-xs leading-none text-muted-foreground">
							{email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link href={"/dashboard/setting"}>
							Account Settings
							<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownLogoutItem />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default UserNav;
