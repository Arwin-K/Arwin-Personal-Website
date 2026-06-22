import { useState } from "react";
import { photography } from "../data/hobbies";

export function PhotographyApp() {
  const [active, setActive] = useState<number | null>(null);
  const activeShot = active !== null ? photography.shots[active] : null;

  return (
    <div className="app hobby photo">
      <div className="hobby__head">
        <h2>📷 Photography</h2>
        <span className="badge">{photography.gear}</span>
      </div>

      <div className="chips chips--tight">
        {photography.style.map((s) => (
          <span key={s} className="chip">
            {s}
          </span>
        ))}
      </div>

      <div className="photo__grid">
        {photography.shots.map((shot, i) => (
          <button
            key={shot.src}
            className="photo__frame"
            onClick={() => setActive(i)}
            title={shot.caption}
          >
            <img className="photo__img" src={shot.src} alt={shot.caption} loading="lazy" />
            <span className="photo__caption">{shot.caption}</span>
          </button>
        ))}
      </div>

      {activeShot && (
        <div className="lightbox" onClick={() => setActive(null)}>
          <div className="lightbox__inner" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox__close" onClick={() => setActive(null)} aria-label="Close">
              ×
            </button>
            <img className="lightbox__img" src={activeShot.src} alt={activeShot.caption} />
            <div className="lightbox__caption">{activeShot.caption}</div>
          </div>
        </div>
      )}
    </div>
  );
}
