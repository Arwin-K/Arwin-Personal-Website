import { useEffect, useRef, useState } from "react";
import { basketball } from "../data/hobbies";
import { Icon } from "../os/Icon";

const BEST_KEY = "arwinos:bball-best";
const PERFECT = 4.5;
const MAKE = 13;

export function BasketballApp() {
  const [pos, setPos] = useState(50);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState<number>(() => {
    const saved = typeof localStorage !== "undefined" ? localStorage.getItem(BEST_KEY) : null;
    return saved ? Number(saved) : 0;
  });
  const [msg, setMsg] = useState("Press Shoot when the marker is in the green zone.");
  const [flash, setFlash] = useState<"swish" | "make" | "miss" | null>(null);
  const [shot, setShot] = useState<{ id: number; result: "swish" | "make" | "miss" } | null>(null);
  const shotIdRef = useRef(0);

  const posRef = useRef(50);
  const dirRef = useRef(1);
  const cooldownRef = useRef(false);
  const streakRef = useRef(0);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(t - last, 50);
      last = t;
      const speed = (0.06 + Math.min(streakRef.current, 8) * 0.012) * dt;
      let next = posRef.current + dirRef.current * speed;
      if (next >= 100) {
        next = 100;
        dirRef.current = -1;
      } else if (next <= 0) {
        next = 0;
        dirRef.current = 1;
      }
      posRef.current = next;
      setPos(next);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const shoot = () => {
    if (cooldownRef.current) return;
    cooldownRef.current = true;
    const dist = Math.abs(posRef.current - 50);

    let result: "swish" | "make" | "miss";
    if (dist <= PERFECT) {
      result = "swish";
      const pts = 3;
      setScore((s) => s + pts);
      streakRef.current += 1;
      setStreak(streakRef.current);
      setMsg(`Swish — +${pts} points.`);
    } else if (dist <= MAKE) {
      result = "make";
      const pts = 2;
      setScore((s) => s + pts);
      streakRef.current += 1;
      setStreak(streakRef.current);
      setMsg(`Made the shot — +${pts} points.`);
    } else {
      result = "miss";
      streakRef.current = 0;
      setStreak(0);
      setMsg("Missed. Streak reset.");
    }

    setFlash(result);
    shotIdRef.current += 1;
    setShot({ id: shotIdRef.current, result });
    setTimeout(() => {
      cooldownRef.current = false;
      setFlash(null);
      setShot(null);
    }, 900);
  };

  useEffect(() => {
    setBest((b) => {
      if (score <= b) return b;
      try {
        localStorage.setItem(BEST_KEY, String(score));
      } catch {
        /* ignore storage failures */
      }
      return score;
    });
  }, [score]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        shoot();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app hobby bball">
      <div className="bball__toolbar">
        <h2 className="bball__title">
          <Icon name="basketball" size={18} />
          Basketball
        </h2>
      </div>

      <div className="bball__group">
        <div className="bball__row">
          <span className="bball__rowlabel">Team</span>
          <span className="bball__rowval">{basketball.favoriteTeam}</span>
        </div>
        <div className="bball__row">
          <span className="bball__rowlabel">Favorite player</span>
          <span className="bball__rowval">{basketball.favoritePlayer}</span>
        </div>
      </div>

      <section className={`bball__game ${flash ? `bball__game--${flash}` : ""}`}>
        <div className="bball__stats">
          <div className="bball__stat">
            <span className="bball__statnum">{score}</span>
            <span className="bball__statlabel">Points</span>
          </div>
          <div className="bball__stat">
            <span className="bball__statnum">{streak}</span>
            <span className="bball__statlabel">Streak</span>
          </div>
          <div className="bball__stat">
            <span className="bball__statnum">{best}</span>
            <span className="bball__statlabel">Best</span>
          </div>
        </div>

        <div className="court">
          <div className="court__board">
            <div
              key={`rim-${shot?.id ?? "idle"}`}
              className={`court__rim ${shot?.result === "miss" ? "court__rim--miss" : ""}`}
            />
          </div>
          <div
            key={`net-${shot?.id ?? "idle"}`}
            className={`court__net ${shot && shot.result !== "miss" ? "court__net--make" : ""}`}
          />
          <div className="court__ball court__ball--rest" />
          {shot && (
            <div key={shot.id} className={`court__ball court__shot court__shot--${shot.result}`} />
          )}
        </div>

        <div className="meter">
          <div className="meter__zone meter__zone--make" />
          <div className="meter__zone meter__zone--perfect" />
          <div className="meter__marker" style={{ left: `${pos}%` }} />
        </div>

        <div className="bball__actions">
          <button className="bball__shoot" type="button" onClick={shoot}>
            Shoot
          </button>
        </div>

        <p className="bball__msg">{msg}</p>
        <p className="bball__hint">Space or Return also shoots.</p>
      </section>
    </div>
  );
}
