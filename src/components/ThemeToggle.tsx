"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

function ThemeToggle() {
	const { theme, systemTheme, setTheme } = useTheme();

	const [mounted, setMounted] = useState(false);
	// useEffect only runs on the client, so now we can safely show the UI
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const currentTheme = theme === "system" ? systemTheme : theme;
	const toggledTheme = currentTheme === "light" ? "dark" : "light";

	return (
		<Button
			size={"icon"}
			variant={"outline"}
			onClick={() => {
				setTheme(toggledTheme);
			}}
			className="size-8"
			aria-labelledby="theme-toggle-button"
		>
			{currentTheme === "light" ? (
				<Sun className="size-5" />
			) : (
				<Moon className="size-5" />
			)}
		</Button>
	);
}

export default ThemeToggle;
