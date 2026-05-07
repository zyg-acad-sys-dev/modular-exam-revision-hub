import { createContext, useContext, useEffect, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const ThemeContext = createContext(null);

export const themeModes = [
  { id: "dark", label: "Night", hint: "Low-glare aurora cockpit" },
  { id: "light", label: "Day", hint: "Bright paper-like review mode" }
];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage("modular-exam-revision-theme", "dark");

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === "light" ? "light" : "dark";
  }, [theme]);

  const api = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme() {
      setTheme((previous) => previous === "light" ? "dark" : "light");
    }
  }), [theme, setTheme]);

  return <ThemeContext.Provider value={api}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
