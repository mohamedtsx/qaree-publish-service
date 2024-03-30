import ThemeToggle from "@/components/ThemeToggle";
import { getCurrentUser } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
	// const user = await getCurrentUser();

	// if (user) {
	// 	redirect("/dashboard");
	// }

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
