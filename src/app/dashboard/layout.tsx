import Header from "@/components/layouts/Header";
import SideNav from "@/components/layouts/SideNav";
import type { ReactNode } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Publish Service",
};

function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="h-screen flex">
			<SideNav />

			<div className="flex-1 flex flex-col">
				<Header />
				<div className="flex-1 p-4 pb-20 overflow-y-auto no-scrollbar">
					{children}
				</div>
			</div>
		</div>
	);
}

export default Layout;
