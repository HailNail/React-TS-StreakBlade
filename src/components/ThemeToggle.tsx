import { useEffect, useState } from "react";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import { themeChange } from "theme-change";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<string>(() => {
    // load from localStorage or default to "pastel"
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    // set <html data-theme="...">
    document.documentElement.setAttribute("data-theme", theme);
    // persist to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <div className="flex gap-2 h-8 mx-4">
      <label className="flex cursor-pointer gap-2">
        <span className="label-text">
          <MdOutlineLightMode />
        </span>
        <input
          type="checkbox"
          checked={theme === "dark"}
          onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          value="dark"
          className="toggle theme-controller"
        />
        <span className="label-text">
          <MdDarkMode />
        </span>
      </label>
    </div>
  );
};

export default ThemeToggle;
