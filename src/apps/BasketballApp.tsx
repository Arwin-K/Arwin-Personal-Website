import { useEffect, useRef, useState } from "react";
import { basketball } from "../data/hobbies";

const BEST_KEY = "arwinos:bball-best";
// Sweet spot is centered at 50. Distance bands decide the outcome.
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
  const [msg, setMsg] = useState("Hit the sweet spot to score 🏀");
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
      // Speed scales up with streak to ramp difficulty.
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
      setMsg(`Swish! Nothing but net. +${pts} (x${streakRef.current})`);
    } else if (dist <= MAKE) {
      result = "make";
      const pts = 2;
      setScore((s) => s + pts);
      streakRef.current += 1;
      setStreak(streakRef.current);
      setMsg(`Bucket! +${pts}`);
    } else {
      result = "miss";
      streakRef.current = 0;
      setStreak(0);
      setMsg("Brick. Reset the streak and run it back.");
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

  // Persist the best score whenever the running score sets a new record.
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

  // Keyboard: space/enter to shoot.
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
      <div className="hobby__head">
        <h2>🏀 Basketball</h2>
        <span className="badge">{basketball.favoriteTeam}</span>
      </div>

      <div className={`bball__game ${flash ? `bball__game--${flash}` : ""}`}>
        <div className="bball__scoreboard">
          <div>
            <span className="bball__score">{score}</span>
            <span className="bball__scorelabel">PTS</span>
          </div>
          <div>
            <span className="bball__score">{streak}</span>
            <span className="bball__scorelabel">STREAK</span>
          </div>
          <div>
            <span className="bball__score">{best}</span>
            <span className="bball__scorelabel">BEST</span>
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

        <button className="bball__shoot" onClick={shoot}>
          SHOOT
        </button>
        <p className="bball__msg">{msg}</p>
        <p className="bball__hint">Click SHOOT (or press Space) when the marker hits the green.</p>
      </div>

      <div className="hobby__card">
        <div className="kv">
          <span>Favorite player</span>
          <b>{basketball.favoritePlayer}</b>
        </div>
        <div className="kv">
          <span>Position</span>
          <b>{basketball.position}</b>
        </div>
        <div className="kv">
          <span>Go-to move</span>
          <b>{basketball.goToMove}</b>
        </div>
      </div>

      <ul className="hobby__facts">
        {basketball.facts.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
    </div>
  );
}
