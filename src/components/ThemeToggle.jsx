import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  // First load: use saved theme, else system preference
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initial = saved || (systemPrefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  // Whenever theme changes, apply + persist
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
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