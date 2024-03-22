import Header from "@/components/layouts/Header";
import SideNav from "@/components/layouts/SideNav";
import { type ReactNode, Suspense } from "react";

import { Loader2 } from "@/components/Loader2";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Publish Service",
};

function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="h-[100svh] flex">
			<SideNav />

			<div className="flex-1 flex flex-col">
				<Header />
				<Suspense fallback={<Loader2 />}>
					<div className="flex-1">{children}</div>
				</Suspense>
			</div>
		</div>
	);
}

export default Layout;
