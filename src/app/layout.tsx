import { inter } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "../styles/globals.css";

export const metadata: Metadata = {
	title: "Qaree Web App",
	description: "Qaree - e-book reading app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-full" suppressHydrationWarning>
			<body className={cn("flex h-full antialiased", inter.className)}>
				<Providers>
					<main className="flex-1">{children}</main>
				</Providers>
			</body>
		</html>
	);
}
