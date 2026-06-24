import { useState } from "react";
import { Icon } from "../os/Icon";

const FILE_NAME = "taking over the world.txt";

const FILE_BODY = `[REDACTED]`;

export function TrashApp() {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <div className="app txtfile">
        <div className="txtfile__bar">
          <button className="txtfile__back" onClick={() => setOpen(false)}>
            ‹ Trash
          </button>
          <span className="txtfile__name">{FILE_NAME}</span>
          <span className="txtfile__spacer" />
        </div>
        <pre className="txtfile__body">{FILE_BODY}</pre>
      </div>
    );
  }

  return (
    <div className="app trash">
      <h2 className="trash__title">
        <span className="inlineico">
          <Icon name="trash" size={20} />
        </span>
        Trash
      </h2>
      <p className="muted trash__hint">One item — probably best left deleted.</p>
      <div className="trash__list">
        <button className="fileitem" onClick={() => setOpen(true)}>
          <Icon name="notes" size={40} />
          <span className="fileitem__name">{FILE_NAME}</span>
          <span className="fileitem__meta">Text Document</span>
        </button>
      </div>
    </div>
  );
}
