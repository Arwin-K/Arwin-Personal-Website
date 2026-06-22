// Shared Spotify logic used by both the Vercel serverless function (api/spotify.ts)
// and the Vite dev middleware (vite.config.ts). It uses Arwin's own refresh token
// + client secret (server-side only) so every visitor sees ONLY his account.

export interface Track {
  title: string;
  artist: string;
  albumArt?: string;
  url?: string;
  isPlaying?: boolean;
}

export interface SpotifyData {
  configured: boolean;
  nowPlaying: Track | null;
  recent: Track[];
}

interface SpotifyArtist {
  name: string;
}
interface SpotifyImage {
  url: string;
}
interface SpotifyItem {
  name: string;
  artists: SpotifyArtist[];
  album?: { images?: SpotifyImage[] };
  external_urls?: { spotify?: string };
}

function mapTrack(item: SpotifyItem, isPlaying?: boolean): Track {
  return {
    title: item.name,
    artist: (item.artists ?? []).map((a) => a.name).join(", "),
    albumArt: item.album?.images?.[0]?.url,
    url: item.external_urls?.spotify,
    isPlaying,
  };
}

export async function getSpotifyData(
  env: Record<string, string | undefined>,
): Promise<SpotifyData> {
  const id = env.SPOTIFY_CLIENT_ID;
  const secret = env.SPOTIFY_CLIENT_SECRET;
  const refresh = env.SPOTIFY_REFRESH_TOKEN;
  if (!id || !secret || !refresh) {
    return { configured: false, nowPlaying: null, recent: [] };
  }

  const basic = Buffer.from(`${id}:${secret}`).toString("base64");
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh,
    }),
  });
  const tok = (await tokenRes.json()) as { access_token?: string };
  if (!tok.access_token) {
    return { configured: true, nowPlaying: null, recent: [] };
  }
  const headers = { Authorization: `Bearer ${tok.access_token}` };

  let nowPlaying: Track | null = null;
  try {
    const np = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers,
    });
    if (np.status === 200) {
      const d = (await np.json()) as { item?: SpotifyItem; is_playing?: boolean };
      if (d?.item) nowPlaying = mapTrack(d.item, d.is_playing);
    }
  } catch {
    /* ignore transient errors */
  }

  let recent: Track[] = [];
  try {
    const rp = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=5", {
      headers,
    });
    if (rp.ok) {
      const d = (await rp.json()) as { items?: { track: SpotifyItem }[] };
      recent = (d.items ?? []).map((it) => mapTrack(it.track));
    }
  } catch {
    /* ignore transient errors */
  }

  return { configured: true, nowPlaying, recent };
}
