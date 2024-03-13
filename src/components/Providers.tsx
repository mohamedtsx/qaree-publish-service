import { ThemeProvider } from "@/components/ui/theme-provider";
import type { ReactNode } from "react";

function Providers({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			{children}
		</ThemeProvider>
	);
}

export default Providers;
