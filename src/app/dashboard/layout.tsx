import Header from "@/components/layouts/Header";
import SideNav from "@/components/layouts/SideNav";
import { type ReactNode, Suspense } from "react";

import { Loader2 } from "@/components/Loader2";
import type { Metadata } from "next";
import { ScrollArea } from "@/components/ui/scroll-area";

export const metadata: Metadata = {
	title: "Publish Service",
};

function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="h-svh flex">
			<SideNav />

			<div className="flex-1 flex flex-col">
				<Header />
				<Suspense fallback={<Loader2 />}>
					<div className="flex-1 overflow-hidden">
						<ScrollArea className="h-full">{children}</ScrollArea>
					</div>
				</Suspense>
			</div>
		</div>
	);
}

export default Layout;
