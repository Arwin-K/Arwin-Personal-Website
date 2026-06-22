import { ICONS, PALETTE } from "./pixelIcons";

interface IconProps {
  name: string;
  size?: number;
}

// Icons backed by a real image asset, rendered with crisp pixelation.
const IMAGE_ICONS: Record<string, string> = {
  github: "/icons/github.png",
};

export function Icon({ name, size = 28 }: IconProps) {
  const imageSrc = IMAGE_ICONS[name];
  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        width={size}
        height={size}
        alt=""
        aria-hidden
        style={{ display: "block", imageRendering: "pixelated", objectFit: "contain" }}
      />
    );
  }

  const grid = ICONS[name] ?? ICONS.file;
  const h = grid.length;
  const w = Math.max(...grid.map((r) => r.length));

  const rects: React.ReactNode[] = [];
  for (let y = 0; y < h; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      const color = PALETTE[ch];
      if (!color) continue;
      rects.push(
        <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={color} />,
      );
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      style={{ display: "block", imageRendering: "pixelated" }}
      aria-hidden
    >
      {rects}
    </svg>
  );
}
