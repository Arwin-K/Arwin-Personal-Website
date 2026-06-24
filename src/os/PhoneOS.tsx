import { useEffect, useState } from "react";
import { APP_MAP } from "../apps/registry";
import type { AppDef } from "./types";
import { Icon } from "./Icon";
import { useWallpaper } from "./WallpaperContext";
import { useSpotify } from "../hooks/useSpotify";

// Order of apps on the home screen.
const HOME_APP_IDS = [
  "about",
  "resume",
  "projects",
  "work",
  "github",
  "basketball",
  "photography",
  "contact",
  "display",
];

// Favorites pinned to the bottom dock.
const DOCK_APP_IDS = ["about", "projects", "github", "contact"];

// Per-app icon tile background so the home screen reads like iOS.
const TILE: Record<string, string> = {
  about: "linear-gradient(160deg, #5b8cff, #2b4ed8)",
  resume: "linear-gradient(160deg, #ff9d6c, #d8552b)",
  projects: "linear-gradient(160deg, #ffd166, #e8a317)",
  work: "linear-gradient(160deg, #59d98b, #1f9d55)",
  github: "linear-gradient(160deg, #4b5563, #1f2430)",
  basketball: "linear-gradient(160deg, #ff8a4c, #d44316)",
  photography: "linear-gradient(160deg, #b18cff, #6c3bd8)",
  contact: "linear-gradient(160deg, #4ec0ff, #1f7fd8)",
  display: "linear-gradient(160deg, #9aa3b2, #5b6472)",
  trash: "linear-gradient(160deg, #9aa3b2, #5b6472)",
};

function labelFor(app: AppDef) {
  if (app.id === "display") return "Settings";
  return app.label ?? app.title;
}

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 20);
    return () => clearInterval(t);
  }, []);
  return now;
}

function StatusBar({ now, dark }: { now: Date; dark?: boolean }) {
  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return (
    <div className={`phone__status ${dark ? "phone__status--dark" : ""}`}>
      <span className="phone__status-time">{time}</span>
      <span className="phone__status-icons">
        <span className="phone__sig" aria-hidden>
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="phone__wifi" aria-hidden>
          ⌃
        </span>
        <span className="phone__batt" aria-hidden>
          <span className="phone__batt-fill" />
        </span>
      </span>
    </div>
  );
}

function AppIcon({
  app,
  onOpen,
}: {
  app: AppDef;
  onOpen: (id: string) => void;
}) {
  return (
    <button className="phone__appbtn" onClick={() => onOpen(app.id)}>
      <span className="phone__tile" style={{ background: TILE[app.id] }}>
        <Icon name={app.icon} size={34} />
      </span>
      <span className="phone__applabel">{labelFor(app)}</span>
    </button>
  );
}

function NowPlayingWidget() {
  const { configured, nowPlaying } = useSpotify();
  if (!configured) return null;
  const playing = nowPlaying?.isPlaying;
  return (
    <a
      className="phone__widget phone__widget--music"
      href={nowPlaying?.url ?? "#"}
      target={nowPlaying?.url ? "_blank" : undefined}
      rel="noreferrer"
    >
      <span className="phone__widget-icon">
        {nowPlaying?.albumArt ? (
          <img src={nowPlaying.albumArt} alt="" />
        ) : (
          <span className="phone__widget-note">♪</span>
        )}
      </span>
      <span className="phone__widget-body">
        <span className="phone__widget-label">
          <span className={`eq ${playing ? "eq--on" : ""}`}>
            <i />
            <i />
            <i />
          </span>
          {playing ? "Now playing" : "Arwin's Spotify"}
        </span>
        {playing ? (
          <>
            <span className="phone__widget-title">{nowPlaying!.title}</span>
            <span className="phone__widget-sub">{nowPlaying!.artist}</span>
          </>
        ) : (
          <span className="phone__widget-sub">Tap to open Spotify</span>
        )}
      </span>
    </a>
  );
}

export function PhoneOS() {
  const { src } = useWallpaper();
  const now = useClock();
  const [openId, setOpenId] = useState<string | null>(null);

  const open = (id: string) => {
    if (APP_MAP[id]) setOpenId(id);
  };
  const close = () => setOpenId(null);

  // Lock background scroll while an app is open.
  useEffect(() => {
    document.body.style.overflow = openId ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openId]);

  const homeApps = HOME_APP_IDS.map((id) => APP_MAP[id]).filter(Boolean) as AppDef[];
  const dockApps = DOCK_APP_IDS.map((id) => APP_MAP[id]).filter(Boolean) as AppDef[];
  const openApp = openId ? APP_MAP[openId] : null;

  const dateLine = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const bigTime = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <div className="phone" style={{ backgroundImage: `url(${src})` }}>
      <div className="phone__scrim" />

      <StatusBar now={now} />

      <div className="phone__home">
        <div className="phone__clock">
          <div className="phone__clock-date">{dateLine}</div>
          <div className="phone__clock-time">{bigTime}</div>
        </div>

        <NowPlayingWidget />

        <div className="phone__grid">
          {homeApps.map((app) => (
            <AppIcon key={app.id} app={app} onOpen={open} />
          ))}
        </div>

        <div className="phone__dock">
          {dockApps.map((app) => (
            <AppIcon key={app.id} app={app} onOpen={open} />
          ))}
        </div>
      </div>

      <div className="phone__bar" />

      {openApp && (
        <div className="phone__app" key={openApp.id}>
          <StatusBar now={now} dark />
          <div className="phone__appbar">
            <button className="phone__back" onClick={close}>
              <span className="phone__back-chev">‹</span> Home
            </button>
            <span className="phone__apptitle">{labelFor(openApp)}</span>
            <span className="phone__appspacer" />
          </div>
          <div className="phone__appbody">{openApp.render({ open })}</div>
          <button
            className="phone__bar phone__bar--btn"
            onClick={close}
            aria-label="Close app"
          />
        </div>
      )}
    </div>
  );
}
