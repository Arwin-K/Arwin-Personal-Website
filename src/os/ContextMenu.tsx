import { useEffect } from "react";

export interface MenuItem {
  label: string;
  shortcut?: string;
  onClick: () => void;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  useEffect(() => {
    const close = () => onClose();
    window.addEventListener("click", close);
    window.addEventListener("blur", close);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("blur", close);
      window.removeEventListener("resize", close);
    };
  }, [onClose]);

  // Keep the menu on screen.
  const left = Math.min(x, window.innerWidth - 240);
  const top = Math.min(y, window.innerHeight - (items.length * 44 + 16));

  return (
    <div className="ctxmenu" style={{ left, top }} onClick={(e) => e.stopPropagation()}>
      {items.map((item) => (
        <button
          key={item.label}
          className="ctxmenu__item"
          onClick={() => {
            item.onClick();
            onClose();
          }}
        >
          <span>{item.label}</span>
          {item.shortcut && <span className="ctxmenu__key">{item.shortcut}</span>}
        </button>
      ))}
    </div>
  );
}
