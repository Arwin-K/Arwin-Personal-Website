import { useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";

export function MenuBar() {
  const { theme, toggle } = useTheme();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="menubar">
      <div className="menubar__left">
        <span className="menubar__logo">Arwin</span>
        <span className="menubar__item menubar__item--bold">File</span>
        <span className="menubar__item menubar__hide-sm">Edit</span>
        <span className="menubar__item menubar__hide-sm">View</span>
        <span className="menubar__item menubar__hide-sm">Window</span>
        <span className="menubar__item menubar__hide-sm">Help</span>
      </div>
      <div className="menubar__right">
        <button
          className="menubar__toggle"
          onClick={toggle}
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          aria-label="Toggle color mode"
        >
          {theme === "light" ? "☾" : "☀"}
        </button>
        <span className="menubar__item menubar__hide-sm">{date}</span>
        <span className="menubar__item">{time}</span>
      </div>
    </div>
  );
}
