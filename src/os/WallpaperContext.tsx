import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { defaultWallpaperId, wallpapers } from "../data/wallpapers";

interface WallpaperCtx {
  wallpaperId: string;
  setWallpaperId: (id: string) => void;
  src: string;
}

const Ctx = createContext<WallpaperCtx | null>(null);
const STORAGE_KEY = "arwinos:wallpaper";

export function WallpaperProvider({ children }: { children: ReactNode }) {
  const [wallpaperId, setWallpaperId] = useState<string>(() => {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && wallpapers.some((w) => w.id === saved)) return saved;
    }
    return defaultWallpaperId;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, wallpaperId);
    } catch {
      // ignore storage failures (private mode, etc.)
    }
  }, [wallpaperId]);

  const src = wallpapers.find((w) => w.id === wallpaperId)?.src ?? wallpapers[0].src;

  return <Ctx.Provider value={{ wallpaperId, setWallpaperId, src }}>{children}</Ctx.Provider>;
}

export function useWallpaper() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWallpaper must be used within WallpaperProvider");
  return ctx;
}
