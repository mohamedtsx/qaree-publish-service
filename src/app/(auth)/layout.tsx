import ThemeToggle from "@/components/ThemeToggle";
import type { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="h-full flex flex-col">
			<div className="flex justify-end py-5 container">
				<ThemeToggle />
			</div>
			{children}
		</div>
	);
}

export default Layout;
