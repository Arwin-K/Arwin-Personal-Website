import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { getSpotifyData } from "./api/spotifyCore.ts";

// Serves /api/spotify during `npm run dev` using the same logic as the Vercel
// function, reading secrets from your local .env file.
function spotifyDevApi(): Plugin {
  return {
    name: "spotify-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/spotify", async (_req, res) => {
        const env = loadEnv(server.config.mode, process.cwd(), "");
        try {
          const data = await getSpotifyData(env);
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(data));
        } catch (e) {
          res.statusCode = 500;
          res.end(
            JSON.stringify({
              configured: false,
              nowPlaying: null,
              recent: [],
              error: String(e),
            }),
          );
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), spotifyDevApi()],
});
