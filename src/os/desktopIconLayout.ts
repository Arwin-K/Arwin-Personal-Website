/** Pixel width of `.desktop-icon` (matches CSS). */
export const DESKTOP_ICON_WIDTH = 92;

export const ICON_POS_KEY = "arwinos:iconpos";

/** Grid pitch — icon size plus breathing room so labels never overlap. */
export const DESKTOP_ICON_CELL_W = 100;
export const DESKTOP_ICON_CELL_H = 100;

const ORIGIN_X = 16;
const ORIGIN_Y = 48;
const BOTTOM_RESERVE = 96;
const EDGE_PAD = 16;

export type IconPos = Record<string, { x: number; y: number }>;

export function defaultIconPositions(ids: string[]): IconPos {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  const availH = Math.max(DESKTOP_ICON_CELL_H, vh - ORIGIN_Y - BOTTOM_RESERVE);
  const availW = Math.max(DESKTOP_ICON_CELL_W, vw - ORIGIN_X - EDGE_PAD);

  let rowsPerCol = Math.max(1, Math.floor(availH / DESKTOP_ICON_CELL_H));
  const maxCols = Math.max(1, Math.floor(availW / DESKTOP_ICON_CELL_W));
  const colsNeeded = Math.ceil(ids.length / rowsPerCol);

  if (colsNeeded > maxCols) {
    rowsPerCol = Math.ceil(ids.length / maxCols);
  }

  const positions: IconPos = {};
  ids.forEach((id, i) => {
    const col = Math.floor(i / rowsPerCol);
    const row = i % rowsPerCol;
    positions[id] = {
      x: ORIGIN_X + col * DESKTOP_ICON_CELL_W,
      y: ORIGIN_Y + row * DESKTOP_ICON_CELL_H,
    };
  });
  return positions;
}

function overlaps(a: { x: number; y: number }, b: { x: number; y: number }): boolean {
  return (
    Math.abs(a.x - b.x) < DESKTOP_ICON_CELL_W && Math.abs(a.y - b.y) < DESKTOP_ICON_CELL_H
  );
}

function firstFreeSlot(taken: { x: number; y: number }[]): { x: number; y: number } {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const maxCols = Math.max(
    1,
    Math.floor((vw - ORIGIN_X - EDGE_PAD) / DESKTOP_ICON_CELL_W),
  );
  const maxRows = Math.max(
    1,
    Math.floor((vh - ORIGIN_Y - BOTTOM_RESERVE) / DESKTOP_ICON_CELL_H),
  );

  for (let col = 0; col < maxCols; col++) {
    for (let row = 0; row < maxRows; row++) {
      const candidate = {
        x: ORIGIN_X + col * DESKTOP_ICON_CELL_W,
        y: ORIGIN_Y + row * DESKTOP_ICON_CELL_H,
      };
      if (!taken.some((p) => overlaps(p, candidate))) return candidate;
    }
  }

  return { x: ORIGIN_X, y: ORIGIN_Y };
}

export function loadIconPositions(ids: string[]): IconPos {
  const defaults = defaultIconPositions(ids);

  let saved: IconPos | null = null;
  try {
    const raw = localStorage.getItem(ICON_POS_KEY);
    if (raw) saved = JSON.parse(raw);
  } catch {
    // ignore malformed storage
  }

  if (!saved || typeof saved !== "object") return defaults;

  const positions: IconPos = { ...defaults };
  const placed: { x: number; y: number }[] = [];

  for (const id of ids) {
    const p = saved[id];
    if (p && typeof p.x === "number" && typeof p.y === "number") {
      positions[id] = p;
      placed.push(p);
    }
  }

  for (const id of ids) {
    if (saved[id]) continue;
    const slot = firstFreeSlot(placed);
    positions[id] = slot;
    placed.push(slot);
  }

  return positions;
}

export function hasSavedIconPositions(): boolean {
  try {
    return localStorage.getItem(ICON_POS_KEY) !== null;
  } catch {
    return false;
  }
}
