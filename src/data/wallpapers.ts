export interface Wallpaper {
  id: string;
  name: string;
  src: string;
}

export const wallpapers: Wallpaper[] = [
  { id: "gamer-den", name: "Gamer Den", src: "/wallpapers/gamer-den.png" },
  { id: "dragon-moon", name: "Dragon Moon", src: "/wallpapers/dragon-moon.png" },
  { id: "tatooine", name: "Tatooine", src: "/wallpapers/tatooine.png" },
];

export const defaultWallpaperId = "tatooine";
