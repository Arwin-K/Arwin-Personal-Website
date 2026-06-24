import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  defaultPhoneWallpaperId,
  defaultWallpaperId,
  phoneWallpapers,
  wallpapers,
  type Wallpaper,
} from "../data/wallpapers";

interface WallpaperCtx {
  wallpaperId: string;
  setWallpaperId: (id: string) => void;
  src: string;
  /** The wallpaper choices available for the current device (phone vs desktop). */
  options: Wallpaper[];
}

const Ctx = createContext<WallpaperCtx | null>(null);

function configFor(mode: "desktop" | "phone") {
  return mode === "phone"
    ? { list: phoneWallpapers, def: defaultPhoneWallpaperId, key: "arwinos:wallpaper:phone" }
    : { list: wallpapers, def: defaultWallpaperId, key: "arwinos:wallpaper" };
}

export function WallpaperProvider({
  mode = "desktop",
  children,
}: {
  mode?: "desktop" | "phone";
  children: ReactNode;
}) {
  const config = configFor(mode);

  const [wallpaperId, setWallpaperId] = useState<string>(() => {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem(config.key);
      if (saved && config.list.some((w) => w.id === saved)) return saved;
    }
    return config.def;
  });

  // When the device mode changes (e.g. rotating into a phone layout), load that
  // mode's saved selection so phone and desktop keep independent wallpapers.
  useEffect(() => {
    const cfg = configFor(mode);
    const saved =
      typeof localStorage !== "undefined" ? localStorage.getItem(cfg.key) : null;
    setWallpaperId(saved && cfg.list.some((w) => w.id === saved) ? saved : cfg.def);
  }, [mode]);

  useEffect(() => {
    try {
      localStorage.setItem(config.key, wallpaperId);
    } catch {
      // ignore storage failures (private mode, etc.)
    }
  }, [config.key, wallpaperId]);

  const src = config.list.find((w) => w.id === wallpaperId)?.src ?? config.list[0].src;

  return (
    <Ctx.Provider value={{ wallpaperId, setWallpaperId, src, options: config.list }}>
      {children}
    </Ctx.Provider>
  );
}

export function useWallpaper() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWallpaper must be used within WallpaperProvider");
  return ctx;
}
