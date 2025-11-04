import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

type ResolvedTheme = "light" | "dark";

interface ThemeProviderProps {
  attribute?: "class";
  children: React.ReactNode;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  storageKey?: string;
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)";

const getSystemPreference = (): ResolvedTheme => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia(SYSTEM_THEME_QUERY).matches ? "dark" : "light";
};

export function ThemeProvider({
  attribute = "class",
  children,
  defaultTheme = "system",
  enableSystem = true,
  storageKey = "collabity-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    return (localStorage.getItem(storageKey) as Theme | null) ?? defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (theme === "system" && enableSystem) return getSystemPreference();
    return theme === "dark" ? "dark" : "light";
  });

  const setTheme = useCallback(
    (nextTheme: Theme) => {
      setThemeState(nextTheme);
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, nextTheme);
      }
    },
    [storageKey],
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  useEffect(() => {
    if (theme === "system" && enableSystem) {
      const updateTheme = () => setResolvedTheme(getSystemPreference());
      updateTheme();

      const mql = window.matchMedia(SYSTEM_THEME_QUERY);
      mql.addEventListener("change", updateTheme);
      return () => mql.removeEventListener("change", updateTheme);
    }

    setResolvedTheme(theme === "dark" ? "dark" : "light");
    return undefined;
  }, [theme, enableSystem]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const appliedTheme = theme === "system" ? resolvedTheme : theme;
    if (attribute === "class") {
      root.classList.remove("light", "dark");
      body.classList.remove("light", "dark");
      root.classList.add(appliedTheme);
      body.classList.add(appliedTheme);
    }
  }, [attribute, resolvedTheme, theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, resolvedTheme, toggleTheme }),
    [theme, setTheme, resolvedTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div className={cn("min-h-screen transition-colors", attribute === "class" && "bg-background text-foreground")}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
