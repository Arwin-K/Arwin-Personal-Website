import { useState } from "react";
import { comics } from "../data/hobbies";

export function ComicsApp() {
  const [panel, setPanel] = useState(0);
  const next = () => setPanel((p) => (p + 1) % comics.panels.length);

  return (
    <div className="app hobby comics">
      <div className="hobby__head">
        <h2>💥 Comics</h2>
        <span className="badge">Reading list</span>
      </div>

      <div className="comics__strip" onClick={next}>
        <div className="comics__panel">
          <span className="comics__bubble">{comics.panels[panel]}</span>
          <span className="comics__hint">click for next panel →</span>
        </div>
      </div>

      <div className="comics__list">
        {comics.favorites.map((c) => (
          <div key={c.title} className="comics__card">
            <span className="comics__pow">POW!</span>
            <b>{c.title}</b>
            <p>{c.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
