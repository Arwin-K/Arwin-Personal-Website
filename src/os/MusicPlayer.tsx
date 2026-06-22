import { useState } from "react";
import { useSpotify } from "../hooks/useSpotify";
import type { Track } from "../data/music";

function Art({ track, size = 40 }: { track: Track; size?: number }) {
  if (track.albumArt) {
    return (
      <img
        className="music__art"
        src={track.albumArt}
        alt=""
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span className="music__art music__art--ph" style={{ width: size, height: size }}>
      ♪
    </span>
  );
}

export function MusicPlayer() {
  const { configured, nowPlaying, recent } = useSpotify();
  const [open, setOpen] = useState(true);

  const playing = nowPlaying?.isPlaying;

  const current: Track =
    nowPlaying ?? { title: "Nothing playing", artist: configured ? "Spotify is idle" : "—" };

  return (
    <div className={`music ${open ? "music--open" : ""}`}>
      <div className="music__bar" onClick={() => setOpen((o) => !o)} role="button">
        <Art track={current} />
        <div className="music__meta">
          <div className="music__nowlabel">
            <span className={`eq ${playing ? "eq--on" : ""}`}>
              <i />
              <i />
              <i />
            </span>
            {playing ? "Now playing" : "Arwin's Spotify"}
          </div>
          <a
            className="music__title"
            href={current.url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            title={current.title}
          >
            {current.title}
          </a>
          <div className="music__artist" title={current.artist}>
            {current.artist}
          </div>
        </div>
        <button
          className="music__chevron"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
          aria-label="Toggle recently played"
        >
          {open ? "▾" : "▸"}
        </button>
      </div>

      {open && (
        <div className="music__panel">
          <div className="music__sectiontitle">Recently played</div>
          <div className="music__list">
            {recent.length === 0 && <div className="music__empty">No recent tracks yet.</div>}
            {recent.map((t, i) => (
              <a
                key={i}
                className="music__row"
                href={t.url}
                target="_blank"
                rel="noreferrer"
              >
                <Art track={t} size={28} />
                <div className="music__rowmeta">
                  <span className="music__rowtitle">{t.title}</span>
                  <span className="music__rowartist">{t.artist}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
