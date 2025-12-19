"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import type { Theme } from "@/lib/theme.server";

const THEME_COOKIE = "tiebugs-theme";

interface ThemeContextValue {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): Theme {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

interface ThemeProviderProps {
	children: ReactNode;
	initialTheme?: Theme | null;
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
	const [theme, setThemeState] = useState<Theme>(
		() => initialTheme ?? getSystemTheme(),
	);

	// Apply theme class to document
	useEffect(() => {
		const root = document.documentElement;
		root.classList.remove("light", "dark");
		root.classList.add(theme);
	}, [theme]);

	const setTheme = (newTheme: Theme) => {
		setThemeState(newTheme);
		// Persist to cookie directly on client
		document.cookie = `${THEME_COOKIE}=${newTheme}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
	};

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
