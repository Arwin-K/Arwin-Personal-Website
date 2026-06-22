import { useEffect, useRef, useState, type ReactNode } from "react";
import type { WindowState } from "./types";
import { Icon } from "./Icon";

interface WindowProps {
  state: WindowState;
  active: boolean;
  children: ReactNode;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (w: number, h: number) => void;
}

export function Window({
  state,
  active,
  children,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onMove,
  onResize,
}: WindowProps) {
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const resizeRef = useRef<{ sx: number; sy: number; sw: number; sh: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [opening, setOpening] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setOpening(false), 520);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      if (dragRef.current) {
        const maxX = window.innerWidth - 80;
        const maxY = window.innerHeight - 60;
        const nx = Math.min(Math.max(0, e.clientX - dragRef.current.dx), maxX);
        const ny = Math.min(Math.max(28, e.clientY - dragRef.current.dy), maxY);
        onMove(nx, ny);
      } else if (resizeRef.current) {
        const r = resizeRef.current;
        onResize(
          Math.max(320, r.sw + (e.clientX - r.sx)),
          Math.max(220, r.sh + (e.clientY - r.sy)),
        );
      }
    }
    function onPointerUp() {
      dragRef.current = null;
      resizeRef.current = null;
      setDragging(false);
    }
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [onMove, onResize]);

  const startDrag = (e: React.PointerEvent) => {
    if (state.maximized) return;
    onFocus();
    dragRef.current = { dx: e.clientX - state.x, dy: e.clientY - state.y };
    setDragging(true);
  };

  const startResize = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (state.maximized) return;
    onFocus();
    resizeRef.current = { sx: e.clientX, sy: e.clientY, sw: state.width, sh: state.height };
  };

  // Vector that places the window's center at the click origin, so the open
  // animation can start there as a tiny black square and travel to the middle.
  const openVars: React.CSSProperties =
    opening && state.origin && !state.maximized
      ? ({
          "--tx": `${state.origin.x - (state.x + state.width / 2)}px`,
          "--ty": `${state.origin.y - (state.y + state.height / 2)}px`,
        } as React.CSSProperties)
      : ({ "--tx": "0px", "--ty": "0px" } as React.CSSProperties);

  const style: React.CSSProperties = state.maximized
    ? { left: 0, top: 28, width: "100%", height: "calc(100% - 96px)", zIndex: state.z }
    : {
        left: state.x,
        top: state.y,
        width: state.width,
        height: state.height,
        zIndex: state.z,
        ...openVars,
      };

  if (state.minimized) return null;

  return (
    <div
      className={`window ${active ? "window--active" : ""} ${dragging ? "window--dragging" : ""} ${
        opening ? "window--opening" : ""
      }`}
      style={style}
      onPointerDown={onFocus}
      role="dialog"
      aria-label={state.title}
    >
      <div className="window__titlebar" onPointerDown={startDrag} onDoubleClick={onToggleMaximize}>
        <div className="window__lights">
          <button
            className="light light--close"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close"
          />
          <button
            className="light light--min"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            aria-label="Minimize"
          />
          <button
            className="light light--max"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMaximize();
            }}
            aria-label="Maximize"
          />
        </div>
        <div className="window__title">
          <Icon name={state.icon} size={15} />
          <span>{state.title}</span>
        </div>
        <div className="window__spacer" />
      </div>
      <div className="window__body">{children}</div>
      {opening && <div className="window__opencover" />}
      {!state.maximized && <div className="window__resize" onPointerDown={startResize} />}
    </div>
  );
}
