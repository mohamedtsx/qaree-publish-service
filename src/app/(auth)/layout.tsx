import ThemeToggle from "@/components/ThemeToggle";
import type { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="h-full flex flex-col">
			<div className="w-full flex justify-end py-5 container">
				<ThemeToggle />
			</div>
			<div className="flex-1">{children}</div>
		</div>
	);
}

export default Layout;
