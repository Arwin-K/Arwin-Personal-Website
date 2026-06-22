import { Icon } from "./Icon";
import type { Origin } from "./types";

interface DesktopIconProps {
  icon: string;
  label: string;
  onOpen: (origin: Origin) => void;
}

export function DesktopIcon({ icon, label, onOpen }: DesktopIconProps) {
  const open = (e: React.MouseEvent) => onOpen({ x: e.clientX, y: e.clientY });
  return (
    <button className="desktop-icon" onDoubleClick={open} onClick={open}>
      <span className="desktop-icon__glyph">
        <Icon name={icon} size={34} />
      </span>
      <span className="desktop-icon__label">{label}</span>
    </button>
  );
}
