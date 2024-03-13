"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";

function ThemeToggle() {
	const { theme, systemTheme, setTheme } = useTheme();

	const currentTheme = theme === "system" ? systemTheme : theme;
	const toggledTheme = currentTheme === "light" ? "dark" : "light";

	return (
		<Button
			size={"icon"}
			variant={"outline"}
			onClick={() => {
				setTheme(toggledTheme);
			}}
			aria-labelledby="theme-toggle-button"
		>
			{currentTheme === "light" ? <Sun /> : <Moon />}
		</Button>
	);
}

export default ThemeToggle;
