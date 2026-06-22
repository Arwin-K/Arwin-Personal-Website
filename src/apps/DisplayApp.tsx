import { wallpapers } from "../data/wallpapers";
import { useWallpaper } from "../os/WallpaperContext";
import { useTheme } from "../os/ThemeContext";

export function DisplayApp() {
  const { wallpaperId, setWallpaperId } = useWallpaper();
  const { theme, setTheme } = useTheme();

  return (
    <div className="app display">
      <div className="display__section">
        <span className="display__legend">Display</span>

        <div className="display__row">
          <span className="display__label">Desktop background</span>
          <div className="bgpicker">
            {wallpapers.map((w) => (
              <button
                key={w.id}
                className={`bgpicker__item ${wallpaperId === w.id ? "bgpicker__item--on" : ""}`}
                onClick={() => setWallpaperId(w.id)}
                title={w.name}
              >
                <span
                  className="bgpicker__thumb"
                  style={{ backgroundImage: `url(${w.src})` }}
                />
                <span className="bgpicker__name">{w.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="display__row">
          <span className="display__label">Color mode</span>
          <div className="seg">
            <button
              className={`seg__btn ${theme === "light" ? "seg__btn--on" : ""}`}
              onClick={() => setTheme("light")}
            >
              ☀ Light
            </button>
            <button
              className={`seg__btn ${theme === "dark" ? "seg__btn--on" : ""}`}
              onClick={() => setTheme("dark")}
            >
              ☾ Dark
            </button>
          </div>
        </div>
      </div>

      <p className="muted display__note">
        Pick a wallpaper above — your choice is saved for next time. Right-click the desktop anytime
        to reopen this.
      </p>
    </div>
  );
}
