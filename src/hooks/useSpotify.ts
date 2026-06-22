import { useEffect, useState } from "react";
import { sampleNowPlaying, sampleRecent, type Track } from "../data/music";

export interface SpotifyState {
  configured: boolean;
  nowPlaying: Track | null;
  recent: Track[];
}

// Fetches Arwin's listening data from the server endpoint (/api/spotify), which
// uses his own credentials. Every visitor sees only his account - there is no
// per-visitor login. Falls back to sample data when not yet configured.
export function useSpotify(): SpotifyState {
  const [state, setState] = useState<SpotifyState>({
    configured: true,
    nowPlaying: null,
    recent: [],
  });

  useEffect(() => {
    let active = true;

    async function tick() {
      try {
        const r = await fetch("/api/spotify");
        if (!r.ok) throw new Error("request failed");
        const d = (await r.json()) as {
          configured?: boolean;
          nowPlaying: Track | null;
          recent: Track[];
        };
        if (!active) return;
        if (d.configured === false) {
          setState({ configured: false, nowPlaying: sampleNowPlaying, recent: sampleRecent });
        } else {
          setState({ configured: true, nowPlaying: d.nowPlaying, recent: d.recent ?? [] });
        }
      } catch {
        if (active) {
          setState({ configured: false, nowPlaying: sampleNowPlaying, recent: sampleRecent });
        }
      }
    }

    tick();
    const id = setInterval(tick, 30000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  return state;
}
