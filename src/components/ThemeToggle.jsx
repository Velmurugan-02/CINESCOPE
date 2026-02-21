import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import "./ThemeToggle.css";
import { setCookie, getCookie } from "../utils/cookieUtils";

export default function ThemeToggle() {
  // Lazily read saved theme from cookie (or system preference) on first render
  const [theme, setTheme] = useState(() => {
    const saved = getCookie("theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // Apply to DOM + persist in cookie whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    setCookie("theme", theme, 365);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <Sun size={18} className="theme-icon" />
      ) : (
        <Moon size={18} className="theme-icon" />
      )}
    </button>
  );
}