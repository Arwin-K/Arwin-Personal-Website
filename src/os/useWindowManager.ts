import { useCallback, useState } from "react";
import type { AppDef, Origin, WindowState } from "./types";

let zCounter = 10;

// Center the window in the viewport, with a small per-window stagger so multiple
// open windows don't perfectly overlap.
function spawnPosition(index: number, width: number, height: number) {
  const stagger = (index % 5) * 26;
  const x = Math.max(12, (window.innerWidth - width) / 2 + stagger);
  const y = Math.max(44, (window.innerHeight - height - 96) / 2 + 44 + stagger);
  return { x, y };
}

export function useWindowManager(apps: Record<string, AppDef>) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const focus = useCallback((id: string) => {
    zCounter += 1;
    setActiveId(id);
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, z: zCounter, minimized: false } : w)));
  }, []);

  const open = useCallback(
    (appId: string, origin?: Origin) => {
      const app = apps[appId];
      if (!app) return;
      setWindows((prev) => {
        const existing = prev.find((w) => w.appId === appId);
        if (existing) {
          zCounter += 1;
          setActiveId(existing.id);
          return prev.map((w) =>
            w.id === existing.id ? { ...w, minimized: false, z: zCounter } : w,
          );
        }
        zCounter += 1;
        const isMobile = typeof window !== "undefined" && window.innerWidth < 760;
        const width = app.width ?? 560;
        const height = app.height ?? 440;
        const pos = spawnPosition(prev.length, width, height);
        const next: WindowState = {
          id: `${appId}-${Date.now()}`,
          appId,
          title: app.title,
          icon: app.icon,
          x: isMobile ? 8 : pos.x,
          y: isMobile ? 56 : pos.y,
          width: isMobile ? Math.min(width, window.innerWidth - 16) : width,
          height: isMobile ? Math.min(height, window.innerHeight - 140) : height,
          z: zCounter,
          minimized: false,
          maximized: false,
          origin,
        };
        setActiveId(next.id);
        return [...prev, next];
      });
    },
    [apps],
  );

  const close = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const closeAll = useCallback(() => {
    setWindows([]);
    setActiveId(null);
  }, []);

  const minimize = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    zCounter += 1;
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized, z: zCounter } : w)),
    );
  }, []);

  const move = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const resize = useCallback((id: string, width: number, height: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, width, height } : w)));
  }, []);

  return {
    windows,
    activeId,
    open,
    close,
    closeAll,
    minimize,
    toggleMaximize,
    focus,
    move,
    resize,
  };
}

export type WindowManager = ReturnType<typeof useWindowManager>;
