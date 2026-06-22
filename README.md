# ArwinOS — Personal Website

A PostHog-"Product OS"-style desktop interface as a personal website for **Arwin Karir**. The whole site is a draggable-window desktop environment where every icon is a personalized app, set over a pixel-art forest wallpaper.

Built with **React + Vite + TypeScript**.

## Apps

- **About Me** — intro, education, and skills (from the resume)
- **Resume.pdf** — embedded, downloadable resume
- **Projects** — featured builds (LumiSense AI, TruthLens) plus live repos fetched from GitHub
- **Work Experience** — folder of roles (SellStatic, Amazon Work Experience Program)
- **GitHub** — live profile summary (stats, top languages, repos) via the public GitHub API
- **Basketball / Photography / Comics** — interactive hobby apps
- **Contact** — email, phone, LinkedIn, GitHub
- **Trash** — easter egg

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build
```

## Customizing

All personalized content lives in `src/data/`:

- `profile.ts` — name, links, education, skills
- `work.ts` — work experience entries
- `projects.ts` — featured projects
- `hobbies.ts` — basketball / photography / comics content

Assets live in `public/`:

- `wallpaper.png` — desktop background
- `resume.pdf` — the resume shown in the Resume app
- `photos/` — drop real photos here, then reference them in `src/data/hobbies.ts`

GitHub data is fetched live at runtime from `https://api.github.com/users/Arwin-K`
(no token needed for public data; the unauthenticated API is rate-limited).

## Spotify "now playing"

The music player (top-right) shows **only Arwin's** Spotify activity to every
visitor. It reads from a server endpoint (`/api/spotify`) that uses Arwin's own
credentials server-side, so there is no per-visitor login and secrets never reach
the browser.

Local setup:

1. Copy `.env.example` to `.env` and fill in `SPOTIFY_CLIENT_ID` and
   `SPOTIFY_CLIENT_SECRET` (from the Spotify Developer Dashboard).
2. In the Spotify app settings, add the redirect URI `http://127.0.0.1:8888/callback`.
3. Run `npm run spotify:auth`, log in, and paste the printed
   `SPOTIFY_REFRESH_TOKEN` into `.env`.
4. `npm run dev` — the Vite dev server serves `/api/spotify` from your `.env`.

`.env` is gitignored — never commit it.

## Deploy

Static frontend + a serverless function, designed for **Vercel** (zero-config: it
builds the Vite app and deploys `api/spotify.ts` as a function).

1. Push to a Git repo and import it into Vercel.
2. In the Vercel project's Environment Variables, add `SPOTIFY_CLIENT_ID`,
   `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REFRESH_TOKEN`.
3. Deploy. The music player will show live data via `/api/spotify`.

(The static build in `dist/` can also go to Netlify/GitHub Pages, but the Spotify
endpoint needs a serverless/host that runs `api/`.)
