import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";
import { inter } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
	title: {
		template: "%s | Qaree",
		default: "Qaree",
	},
	description: "Qaree publish service",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="no-scrollbar" suppressHydrationWarning>
			<body className={cn("flex h-full antialiased", inter.className)}>
				<Providers>
					<div className="flex-1">{children}</div>
				</Providers>
				<Toaster />
			</body>
		</html>
	);
}
