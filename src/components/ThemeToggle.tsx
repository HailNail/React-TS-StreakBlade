import { useEffect } from "react";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import { themeChange } from "theme-change";

const ThemeToggle = () => {
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
          value="aqua"
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
