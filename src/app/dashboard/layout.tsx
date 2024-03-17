import Header from "@/components/layouts/Header";
import SideNav from "@/components/layouts/SideNav";
import type { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="h-[100svh] flex">
			<SideNav />

			<div className="flex-1 flex flex-col">
				<Header />
				<div className="flex-1">{children}</div>
			</div>
		</div>
	);
}

export default Layout;
