import { useEffect, useRef, useState } from "react";
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

// macOS-style app icon tints for the phone home screen.
const TILE: Record<string, string> = {
  about: "linear-gradient(180deg, #5eb0ff, #007aff)",
  resume: "linear-gradient(180deg, #ff9f6b, #ff6723)",
  projects: "linear-gradient(180deg, #ffd65e, #ff9f0a)",
  work: "linear-gradient(180deg, #65d67a, #34c759)",
  github: "linear-gradient(180deg, #8e8e93, #636366)",
  basketball: "linear-gradient(180deg, #ff9f6b, #ff6723)",
  photography: "linear-gradient(180deg, #bf8cff, #af52de)",
  contact: "linear-gradient(180deg, #5eb0ff, #007aff)",
  display: "linear-gradient(180deg, #aeaeb2, #8e8e93)",
  trash: "linear-gradient(180deg, #aeaeb2, #8e8e93)",
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

function StatusBar({
  now,
  dark,
  editing,
  onDone,
}: {
  now: Date;
  dark?: boolean;
  editing?: boolean;
  onDone?: () => void;
}) {
  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return (
    <div className={`phone__status ${dark ? "phone__status--dark" : ""}`}>
      <span className="phone__status-time">{time}</span>
      {editing ? (
        <button className="phone__done" onClick={onDone}>
          Done
        </button>
      ) : (
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
      )}
    </div>
  );
}

function AppIcon({
  app,
  editing,
  onOpen,
  onEnterEdit,
  onDelete,
}: {
  app: AppDef;
  editing: boolean;
  onOpen: (id: string) => void;
  onEnterEdit: () => void;
  onDelete: () => void;
}) {
  const timer = useRef<number | null>(null);
  const longPressed = useRef(false);
  const startPt = useRef({ x: 0, y: 0 });

  const clearTimer = () => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    longPressed.current = false;
    startPt.current = { x: e.clientX, y: e.clientY };
    clearTimer();
    timer.current = window.setTimeout(() => {
      longPressed.current = true;
      onEnterEdit();
    }, 420);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const dx = Math.abs(e.clientX - startPt.current.x);
    const dy = Math.abs(e.clientY - startPt.current.y);
    if (dx + dy > 10) clearTimer();
  };

  const handleClick = () => {
    clearTimer();
    if (longPressed.current) {
      longPressed.current = false;
      return;
    }
    if (editing) return;
    onOpen(app.id);
  };

  return (
    <div className={`phone__appbtn ${editing ? "phone__appbtn--edit" : ""}`}>
      <div className="phone__tilewrap">
        <div
          className="phone__tilebtn"
          role="button"
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={clearTimer}
          onPointerCancel={clearTimer}
          onClick={handleClick}
          onContextMenu={(e) => e.preventDefault()}
        >
          <span className="phone__tile" style={{ background: TILE[app.id] }}>
            <Icon name={app.icon} size={34} />
          </span>
        </div>
        {editing && (
          <button
            className="phone__delbtn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label={`Delete ${labelFor(app)}`}
          />
        )}
      </div>
      <span className="phone__applabel">{labelFor(app)}</span>
    </div>
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
  const [editing, setEditing] = useState(false);
  const [denied, setDenied] = useState(false);

  const open = (id: string) => {
    if (!APP_MAP[id]) return;
    setEditing(false);
    setOpenId(id);
  };
  const close = () => setOpenId(null);

  // Lock background scroll while an app is open.
  useEffect(() => {
    document.body.style.overflow = openId ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openId]);

  // Long-press anywhere on the home screen enters edit (jiggle) mode.
  const bgTimer = useRef<number | null>(null);
  const bgStart = useRef({ x: 0, y: 0 });
  const clearBgTimer = () => {
    if (bgTimer.current !== null) {
      clearTimeout(bgTimer.current);
      bgTimer.current = null;
    }
  };
  const onHomePointerDown = (e: React.PointerEvent) => {
    if (editing) return;
    bgStart.current = { x: e.clientX, y: e.clientY };
    clearBgTimer();
    bgTimer.current = window.setTimeout(() => setEditing(true), 420);
  };
  const onHomePointerMove = (e: React.PointerEvent) => {
    if (
      Math.abs(e.clientX - bgStart.current.x) + Math.abs(e.clientY - bgStart.current.y) >
      10
    ) {
      clearBgTimer();
    }
  };

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

      <StatusBar now={now} editing={editing} onDone={() => setEditing(false)} />

      <div
        className="phone__home"
        onPointerDown={onHomePointerDown}
        onPointerMove={onHomePointerMove}
        onPointerUp={clearBgTimer}
        onPointerCancel={clearBgTimer}
      >
        <div className="phone__clock">
          <div className="phone__clock-date">{dateLine}</div>
          <div className="phone__clock-time">{bigTime}</div>
        </div>

        <NowPlayingWidget />

        <div className="phone__grid">
          {homeApps.map((app) => (
            <AppIcon
              key={app.id}
              app={app}
              editing={editing}
              onOpen={open}
              onEnterEdit={() => setEditing(true)}
              onDelete={() => setDenied(true)}
            />
          ))}
        </div>

        <div className="phone__dock">
          {dockApps.map((app) => (
            <AppIcon
              key={app.id}
              app={app}
              editing={editing}
              onOpen={open}
              onEnterEdit={() => setEditing(true)}
              onDelete={() => setDenied(true)}
            />
          ))}
        </div>
      </div>

      <div className="phone__bar" />

      {denied && (
        <div className="phone__alert-wrap" onClick={() => setDenied(false)}>
          <div className="phone__alert" onClick={(e) => e.stopPropagation()}>
            <div className="phone__alert-title">no</div>
            <button className="phone__alert-ok" onClick={() => setDenied(false)}>
              OK
            </button>
          </div>
        </div>
      )}

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
