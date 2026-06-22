export interface Track {
  title: string;
  artist: string;
  albumArt?: string;
  url?: string;
  isPlaying?: boolean;
}

// Shown only when the server hasn't been configured with Spotify credentials yet
// (no env vars). Once the refresh token is set, real data replaces this.
export const sampleNowPlaying: Track = {
  title: "Spotify not connected",
  artist: "Set server env vars to go live",
  isPlaying: false,
};

export const sampleRecent: Track[] = [];
