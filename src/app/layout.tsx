import type { Metadata } from "next";
import "../styles/globals.css";
import { cn } from "@/lib/utils";
import { inter } from "@/lib/fonts";

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
    <html lang="en" className="h-full">
      <body className={cn("flex h-full", inter.className)}>
        <main className="flex-1 bg-primary">{children}</main>
      </body>
    </html>
  );
}
