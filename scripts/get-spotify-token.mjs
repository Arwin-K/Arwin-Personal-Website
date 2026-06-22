// One-time helper to obtain Arwin's Spotify refresh token.
//
// Prereqs:
//   1. SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET set in .env
//   2. In your Spotify app settings, add this Redirect URI:
//        http://127.0.0.1:8888/callback
//
// Run:  npm run spotify:auth
// Then paste the printed SPOTIFY_REFRESH_TOKEN into your .env.

import http from "node:http";
import { readFileSync } from "node:fs";
import { exec } from "node:child_process";

function loadEnvFile() {
  try {
    const txt = readFileSync(new URL("../.env", import.meta.url), "utf8");
    const out = {};
    for (const line of txt.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
    return out;
  } catch {
    return {};
  }
}

const env = { ...loadEnvFile(), ...process.env };
const CLIENT_ID = env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET;
const PORT = 8888;
const REDIRECT = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = "user-read-currently-playing user-read-recently-played";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("\n❌ Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env\n");
  process.exit(1);
}

const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT,
    scope: SCOPES,
    show_dialog: "true",
  });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  if (!url.pathname.startsWith("/callback")) {
    res.writeHead(404);
    res.end();
    return;
  }
  const code = url.searchParams.get("code");
  if (!code) {
    res.writeHead(400);
    res.end("No authorization code returned.");
    return;
  }

  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT,
    }),
  });
  const data = await tokenRes.json();

  if (data.refresh_token) {
    console.log("\n✅ SUCCESS! Add this line to your .env:\n");
    console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h2>Spotify connected. Return to your terminal and close this tab.</h2>");
  } else {
    console.error("\n❌ Failed to get refresh token:\n", data, "\n");
    res.writeHead(500);
    res.end("Failed. Check the terminal output.");
  }

  setTimeout(() => {
    server.close();
    process.exit(0);
  }, 500);
});

server.listen(PORT, () => {
  console.log(`\nOpening Spotify authorization (log in as the account you want to display)...`);
  console.log(`\nIf the browser doesn't open, visit this URL manually:\n\n${authUrl}\n`);
  const opener =
    process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  exec(`${opener} "${authUrl}"`);
});
