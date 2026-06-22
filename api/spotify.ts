import { getSpotifyData } from "./spotifyCore";

// Vercel serverless function. Reads server-side env vars (set in the Vercel
// dashboard): SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN.
export default async function handler(
  _req: unknown,
  res: {
    setHeader: (k: string, v: string) => void;
    statusCode: number;
    end: (body: string) => void;
  },
) {
  let data;
  try {
    data = await getSpotifyData(process.env);
  } catch {
    data = { configured: false, nowPlaying: null, recent: [] };
  }
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
  res.statusCode = 200;
  res.end(JSON.stringify(data));
}
