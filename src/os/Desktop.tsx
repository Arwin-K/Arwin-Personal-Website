import { useEffect, useState } from "react";
import { APPS, APP_MAP } from "../apps/registry";
import { useWindowManager } from "./useWindowManager";
import { Window } from "./Window";
import { Dock } from "./Dock";
import { MenuBar } from "./MenuBar";
import { DesktopIcon } from "./DesktopIcon";
import { ContextMenu, type MenuItem } from "./ContextMenu";
import { useWallpaper } from "./WallpaperContext";
import { MusicPlayer } from "./MusicPlayer";
import { StickyNote } from "./StickyNote";

const ICON_POS_KEY = "arwinos:iconpos";
const ICON_COL_W = 96;
const ICON_ROW_H = 88;

type IconPos = Record<string, { x: number; y: number }>;

function defaultIconPositions(ids: string[]): IconPos {
  const viewportH = typeof window !== "undefined" ? window.innerHeight : 800;
  const perCol = Math.max(1, Math.floor((viewportH - 180) / ICON_ROW_H));
  const positions: IconPos = {};
  ids.forEach((id, i) => {
    const col = Math.floor(i / perCol);
    const row = i % perCol;
    positions[id] = { x: 16 + col * ICON_COL_W, y: 48 + row * ICON_ROW_H };
  });
  return positions;
}

function loadIconPositions(ids: string[]): IconPos {
  const positions = defaultIconPositions(ids);
  try {
    const saved = JSON.parse(localStorage.getItem(ICON_POS_KEY) || "null");
    if (saved && typeof saved === "object") {
      for (const id of ids) {
        if (saved[id] && typeof saved[id].x === "number") positions[id] = saved[id];
      }
    }
  } catch {
    // ignore malformed storage
  }
  return positions;
}

export function Desktop() {
  const wm = useWindowManager(APP_MAP);
  const { src } = useWallpaper();
  const [booted, setBooted] = useState(false);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 1100);
    return () => clearTimeout(t);
  }, []);

  // Open a friendly window on first load so the desktop isn't empty.
  useEffect(() => {
    if (booted) wm.open("about");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booted]);

  const desktopApps = APPS.filter((a) => a.onDesktop);
  const dockApps = APPS.filter((a) => a.inDock);

  const [iconPos, setIconPos] = useState<IconPos>(() =>
    loadIconPositions(desktopApps.map((a) => a.id)),
  );

  useEffect(() => {
    try {
      localStorage.setItem(ICON_POS_KEY, JSON.stringify(iconPos));
    } catch {
      // ignore storage failures
    }
  }, [iconPos]);

  const moveIcon = (id: string, x: number, y: number) =>
    setIconPos((prev) => ({ ...prev, [id]: { x, y } }));

  const resetDesktop = () => {
    wm.closeAll();
    setIconPos(defaultIconPositions(desktopApps.map((a) => a.id)));
  };

  const openContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY });
  };

  const menuItems: MenuItem[] = [
    { label: "About Arwin", onClick: () => wm.open("about") },
    { label: "Display Options", shortcut: ",", onClick: () => wm.open("display") },
    { label: "Reset desktop", onClick: resetDesktop },
  ];

  return (
    <div
      className="desktop"
      style={{ backgroundImage: `url(${src})` }}
      onContextMenu={openContextMenu}
    >
      <div className="desktop__scrim" />
      <MenuBar />
      <MusicPlayer />

      {!booted && (
        <div className="boot">
          <div className="boot__logo">◯</div>
          <div className="boot__title">Arwin</div>
          <div className="boot__bar">
            <div className="boot__fill" />
          </div>
        </div>
      )}

      <div className="desktop__icons">
        {desktopApps.map((app) => (
          <DesktopIcon
            key={app.id}
            icon={app.icon}
            label={app.label ?? app.title}
            pos={iconPos[app.id] ?? { x: 16, y: 48 }}
            onMove={(x, y) => moveIcon(app.id, x, y)}
            onOpen={(origin) => wm.open(app.id, origin)}
          />
        ))}
      </div>

      {booted && (
        <div className="desktop__widgets">
          <StickyNote onOpen={wm.open} />
        </div>
      )}

      {wm.windows.map((w) => {
        const app = APP_MAP[w.appId];
        if (!app) return null;
        return (
          <Window
            key={w.id}
            state={w}
            active={wm.activeId === w.id}
            onFocus={() => wm.focus(w.id)}
            onClose={() => wm.close(w.id)}
            onMinimize={() => wm.minimize(w.id)}
            onToggleMaximize={() => wm.toggleMaximize(w.id)}
            onMove={(x, y) => wm.move(w.id, x, y)}
            onResize={(width, height) => wm.resize(w.id, width, height)}
          >
            {app.render({ open: wm.open })}
          </Window>
        );
      })}

      <Dock apps={dockApps} windows={wm.windows} onOpen={wm.open} />

      {menu && (
        <ContextMenu x={menu.x} y={menu.y} items={menuItems} onClose={() => setMenu(null)} />
      )}
    </div>
  );
}
