import { useState } from "react";
import { work } from "../data/work";
import { Icon } from "../os/Icon";

export function WorkApp() {
  const [selected, setSelected] = useState<string | null>(null);
  const item = work.find((w) => w.id === selected);

  if (item) {
    return (
      <div className="app folder">
        <button className="folder__back" onClick={() => setSelected(null)}>
          ← Work Experience
        </button>
        <div className="doc">
          <div className="doc__head">
            <Icon name={item.icon} size={30} />
            <div>
              <h2 className="doc__title">{item.role}</h2>
              <p className="doc__sub">
                {item.company} · {item.location}
              </p>
              <p className="doc__meta">{item.dates}</p>
            </div>
          </div>
          <ul className="doc__list">
            {item.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="app folder">
      <p className="folder__hint">Double-click a role to open the full write-up.</p>
      <div className="folder__grid">
        {work.map((w) => (
          <button key={w.id} className="fileitem" onClick={() => setSelected(w.id)}>
            <Icon name={w.icon} size={40} />
            <span className="fileitem__name">{w.company}</span>
            <span className="fileitem__meta">{w.dates}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
