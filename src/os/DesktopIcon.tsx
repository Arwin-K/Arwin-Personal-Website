import { useRef, useState } from "react";
import { Icon } from "./Icon";
import type { Origin } from "./types";

interface DesktopIconProps {
  icon: string;
  label: string;
  pos: { x: number; y: number };
  onOpen: (origin: Origin) => void;
  onMove: (x: number, y: number) => void;
}

const ICON_WIDTH = 92;

export function DesktopIcon({ icon, label, pos, onOpen, onMove }: DesktopIconProps) {
  const [dragging, setDragging] = useState(false);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const startRef = useRef({ px: 0, py: 0, ox: 0, oy: 0 });

  const clamp = (x: number, y: number) => ({
    x: Math.max(4, Math.min(x, window.innerWidth - ICON_WIDTH - 4)),
    y: Math.max(30, Math.min(y, window.innerHeight - 110)),
  });

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    draggingRef.current = true;
    movedRef.current = false;
    startRef.current = { px: e.clientX, py: e.clientY, ox: pos.x, oy: pos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - startRef.current.px;
    const dy = e.clientY - startRef.current.py;
    if (!movedRef.current && Math.abs(dx) + Math.abs(dy) > 4) {
      movedRef.current = true;
      setDragging(true);
    }
    if (movedRef.current) {
      const p = clamp(startRef.current.ox + dx, startRef.current.oy + dy);
      onMove(p.x, p.y);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    draggingRef.current = false;
    setDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // capture may already be released
    }
  };

  const onClick = (e: React.MouseEvent) => {
    if (movedRef.current) return;
    onOpen({ x: e.clientX, y: e.clientY });
  };

  return (
    <button
      className={`desktop-icon ${dragging ? "desktop-icon--dragging" : ""}`}
      style={{ left: pos.x, top: pos.y }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={onClick}
    >
      <span className="desktop-icon__glyph">
        <Icon name={icon} size={34} />
      </span>
      <span className="desktop-icon__label">{label}</span>
    </button>
  );
}
