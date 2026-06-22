export const basketball = {
  favoriteTeam: "Toronto Raptors",
  favoritePlayer: "Kobe Bryant",
  position: "Combo guard",
  goToMove: "Step-back three",
  facts: [
    "Raptors fan through every rebuild.",
    "Mamba mentality applied to debugging at 2am.",
    "Will argue that footwork is the most underrated skill in the game.",
  ],
};

export interface Shot {
  src: string;
  caption: string;
}

export const photography = {
  gear: "Mostly my phone + an eye for golden hour",
  style: ["Golden-hour landscapes", "Nature", "Everyday moments"],
  shots: [
    { src: "/photos/bike-sunset.png", caption: "Golden hour ride" },
    { src: "/photos/field-sunset.png", caption: "Sunset over the field" },
    { src: "/photos/maligne-lake.png", caption: "Maligne Lake, Jasper" },
    { src: "/photos/hoop-dusk.png", caption: "Court at dusk" },
    { src: "/photos/vinyl-nights.png", caption: "Vinyl nights" },
  ] as Shot[],
};

export const comics = {
  favorites: [
    { title: "Spider-Man", note: "Friendly neighborhood debugging inspiration." },
    { title: "Batman", note: "Prep, planning, and the perfect gadget for every bug." },
    { title: "Invincible", note: "Underrated art, brutal plot twists." },
  ],
  panels: [
    "Ever wondered what it'd be like to read a comic inside a website?",
    "Same energy as shipping a feature at 3am...",
    "...and watching the tests pass on the first try. POW!",
  ],
};
