import Header from "@/components/layouts/Header";
import SideNav from "@/components/layouts/SideNav";
import type { ReactNode } from "react";

import type { Metadata } from "next";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCurrentUser } from "@/lib/authOptions";

export const metadata: Metadata = {
	title: "Publish Service",
};

function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="h-svh flex">
			<SideNav />

			<div className="flex-1 flex flex-col">
				<Header />
				<div className="flex-1 overflow-hidden">
					<ScrollArea className="h-full">{children}</ScrollArea>
				</div>
			</div>
		</div>
	);
}

export default Layout;
