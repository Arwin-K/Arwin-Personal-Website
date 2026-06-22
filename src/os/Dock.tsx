import type { AppDef, Origin, WindowState } from "./types";
import { Icon } from "./Icon";

interface DockProps {
  apps: AppDef[];
  windows: WindowState[];
  onOpen: (id: string, origin?: Origin) => void;
}

export function Dock({ apps, windows, onOpen }: DockProps) {
  const openIds = new Set(windows.map((w) => w.appId));
  return (
    <div className="dock">
      {apps.map((app) => (
        <button
          key={app.id}
          className="dock__item"
          title={app.title}
          onClick={(e) => onOpen(app.id, { x: e.clientX, y: e.clientY })}
        >
          <span className="dock__tile">
            <Icon name={app.icon} size={26} />
          </span>
          <span className={`dock__dot ${openIds.has(app.id) ? "dock__dot--on" : ""}`} />
        </button>
      ))}
    </div>
  );
}
