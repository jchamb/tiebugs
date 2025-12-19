"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Switch } from "./ui/switch";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const isDark = theme === "dark";

	const toggleTheme = () => {
		setTheme(isDark ? "light" : "dark");
	};

	return (
		<div className="flex items-center gap-2">
			<Sun className="size-4 text-muted-foreground" />
			<Switch
				checked={isDark}
				onCheckedChange={toggleTheme}
				aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
			/>
			<Moon className="size-4 text-muted-foreground" />
		</div>
	);
}
