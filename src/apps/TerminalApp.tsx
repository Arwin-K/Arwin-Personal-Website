import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { AppRenderApi } from "../os/types";
import { profile } from "../data/profile";

type LineKind = "out" | "in" | "err" | "sys";

interface TermLine {
  id: number;
  kind: LineKind;
  parts: TermPart[];
}

type TermPart = string | { cls: string; text: string };

const PROMPT_USER = "visitor";
const PROMPT_HOST = "arwin-os";
const PROMPT_PATH = "~";

function part(text: string, cls?: string): TermPart {
  return cls ? { cls, text } : text;
}

function linesFromStrings(rows: string[], kind: LineKind = "out"): TermLine[] {
  return rows.map((text) => ({
    id: 0,
    kind,
    parts: [text],
  }));
}

function getVisitorInfo() {
  const nav = navigator;
  const ua = nav.userAgent;
  const platform = nav.platform || "unknown";
  const lang = nav.language;
  const langs = nav.languages?.slice(0, 3).join(", ") ?? lang;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const screen = `${window.screen.width}×${window.screen.height}`;
  const dpr = window.devicePixelRatio ?? 1;
  const cores = nav.hardwareConcurrency ?? "?";
  const memory = "deviceMemory" in nav ? `${(nav as Navigator & { deviceMemory?: number }).deviceMemory} GB` : "unknown";
  const touch = nav.maxTouchPoints > 0 ? "yes" : "no";
  const online = nav.onLine ? "yes" : "no";
  const cookie = nav.cookieEnabled ? "enabled" : "disabled";

  let device = platform;
  if (/iPhone|iPad|iPod/.test(ua)) device = "iOS";
  else if (/Android/.test(ua)) device = "Android";
  else if (/Mac/.test(ua)) device = "macOS";
  else if (/Win/.test(ua)) device = "Windows";
  else if (/Linux/.test(ua)) device = "Linux";

  let browser = "unknown";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) browser = "Chrome";
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) browser = "Safari";
  else if (/Firefox\//.test(ua)) browser = "Firefox";

  return {
    user: PROMPT_USER,
    host: PROMPT_HOST,
    device,
    platform,
    browser,
    ua,
    screen,
    dpr: String(dpr),
    tz,
    lang,
    langs,
    cores: String(cores),
    memory,
    touch,
    online,
    cookie,
    viewport: `${window.innerWidth}×${window.innerHeight}`,
  };
}

function whoamiOutput(): TermLine[] {
  const v = getVisitorInfo();
  return [
    {
      id: 0,
      kind: "out",
      parts: [
        part(`${v.user}@${v.host}`, "term-green"),
        part("  — session fingerprint"),
      ],
    },
    { id: 0, kind: "out", parts: [""] },
    { id: 0, kind: "out", parts: [part("device", "term-dim"), part(`     ${v.device} (${v.platform})`)] },
    { id: 0, kind: "out", parts: [part("browser", "term-dim"), part(`    ${v.browser}`)] },
    { id: 0, kind: "out", parts: [part("screen", "term-dim"), part(`     ${v.screen} @${v.dpr}x`)] },
    { id: 0, kind: "out", parts: [part("viewport", "term-dim"), part(`  ${v.viewport}`)] },
    { id: 0, kind: "out", parts: [part("timezone", "term-dim"), part(`  ${v.tz}`)] },
    { id: 0, kind: "out", parts: [part("language", "term-dim"), part(`  ${v.lang}`)] },
    { id: 0, kind: "out", parts: [part("languages", "term-dim"), part(` ${v.langs}`)] },
    { id: 0, kind: "out", parts: [part("cpu cores", "term-dim"), part(`  ${v.cores}`)] },
    { id: 0, kind: "out", parts: [part("memory", "term-dim"), part(`     ${v.memory}`)] },
    { id: 0, kind: "out", parts: [part("touch", "term-dim"), part(`      ${v.touch}`)] },
    { id: 0, kind: "out", parts: [part("online", "term-dim"), part(`     ${v.online}`)] },
    { id: 0, kind: "out", parts: [part("cookies", "term-dim"), part(`    ${v.cookie}`)] },
    { id: 0, kind: "out", parts: [""] },
    {
      id: 0,
      kind: "sys",
      parts: [part("ua", "term-dim"), part(`         ${v.ua}`, "term-dim")],
    },
  ];
}

function helpOutput(): TermLine[] {
  return linesFromStrings([
    "Available commands:",
    "  help          list commands",
    "  whoami        your browser & device info",
    "  ls            list ~/arwin files",
    "  cat <file>    read a file",
    "  open <app>    launch a desktop app",
    "  clear         clear the screen",
    "  neofetch      system summary",
    "  fortune       wisdom from the OS",
    "  pwd           print working directory",
    "  date          current date & time",
    "  echo <text>   print text",
    "",
    "Try: cat secrets.txt · open github · sudo rm -rf /",
  ]);
}

function lsOutput(): TermLine[] {
  return [
    {
      id: 0,
      kind: "out",
      parts: [
        part("about.md", "term-blue"),
        part("  "),
        part("resume.pdf", "term-blue"),
        part("  "),
        part("projects/", "term-blue"),
        part("  "),
        part("secrets.txt", "term-red"),
        part("  "),
        part("taking_over_the_world.txt", "term-dim"),
      ],
    },
  ];
}

function catFile(name: string): TermLine[] {
  const file = name.toLowerCase().replace(/\.(md|txt|pdf)$/, "");
  if (file === "about" || file === "about.md") {
    return linesFromStrings([profile.blurb]);
  }
  if (file === "secrets" || file === "secrets.txt") {
    return linesFromStrings(["nice try.", "hint: check the Trash."], "err");
  }
  if (file === "taking_over_the_world" || file === "taking_over_the_world.txt") {
    return linesFromStrings(["[REDACTED]"]);
  }
  if (file === "resume" || file === "resume.pdf") {
    return linesFromStrings(["Binary file — open the Resume app instead."]);
  }
  return linesFromStrings([`cat: ${name}: No such file or directory`], "err");
}

function neofetchOutput(): TermLine[] {
  const v = getVisitorInfo();
  return [
    {
      id: 0,
      kind: "out",
      parts: [
        part("       ▲\n", "term-blue"),
        part("      Arwin OS\n", "term-cyan"),
        part("\n"),
        part("host", "term-green"),
        part(`     ${v.host}\n`),
        part("visitor", "term-green"),
        part(`  ${v.user}@${v.device}\n`),
        part("shell", "term-green"),
        part("    zsh (simulated)\n"),
        part("term", "term-green"),
        part(`     ${v.browser} on ${v.platform}\n`),
        part("screen", "term-green"),
        part(`   ${v.screen}\n`),
        part("owner", "term-green"),
        part(`    ${profile.name}\n`),
        part("uptime", "term-green"),
        part("   since you opened this tab"),
      ],
    },
  ];
}

function fortuneOutput(): TermLine[] {
  const quotes = [
    "Ship early. Debug at 2am with confidence.",
    "The ball don't lie. Neither does the linter.",
    "There is no cloud — only Arwin's Vercel functions.",
    "rm -rf / is not a personality trait.",
    "Today's forecast: 100% chance of git push.",
  ];
  return linesFromStrings([quotes[Math.floor(Math.random() * quotes.length)]!]);
}

const OPEN_APPS: Record<string, string> = {
  about: "about",
  resume: "resume",
  projects: "projects",
  work: "work",
  github: "github",
  basketball: "basketball",
  bball: "basketball",
  photo: "photography",
  photography: "photography",
  contact: "contact",
  trash: "trash",
  settings: "display",
  display: "display",
};

function runCommand(raw: string, open: AppRenderApi["open"]): TermLine[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  const [cmd, ...args] = trimmed.split(/\s+/);
  const arg = args.join(" ");
  const lower = cmd.toLowerCase();

  switch (lower) {
    case "help":
    case "?":
      return helpOutput();
    case "whoami":
      return whoamiOutput();
    case "clear":
    case "cls":
      return [{ id: 0, kind: "sys", parts: ["__CLEAR__"] }];
    case "ls":
      return lsOutput();
    case "cat":
      if (!arg) return linesFromStrings(["cat: missing file operand"], "err");
      return catFile(arg);
    case "pwd":
      return linesFromStrings([`/Users/${PROMPT_USER}/${PROMPT_HOST}`]);
    case "date":
      return linesFromStrings([new Date().toString()]);
    case "echo":
      return linesFromStrings([arg || ""]);
    case "neofetch":
      return neofetchOutput();
    case "fortune":
      return fortuneOutput();
    case "open": {
      const id = OPEN_APPS[arg.toLowerCase()];
      if (!id) return linesFromStrings([`open: app '${arg}' not found`], "err");
      open(id);
      return linesFromStrings([`Opened ${arg}.`]);
    }
    case "sudo":
      return linesFromStrings(["Password: ", "sudo: 3 incorrect password attempts"], "err");
    case "rm":
      if (trimmed.includes("-rf") || trimmed.includes("-fr")) {
        return linesFromStrings(["rm: Permission denied. Arwin still needs this website."], "err");
      }
      return linesFromStrings([`rm: missing operand`], "err");
    case "git":
      return linesFromStrings(["fatal: not a git repository (but nice try)."], "err");
    case "cd":
      return linesFromStrings([`cd: ${arg || "~"}: No such directory in Arwin OS`], "err");
    case "vim":
    case "nano":
      return linesFromStrings([`${cmd}: editing disabled. use cat instead.`], "err");
    case "exit":
    case "quit":
      return linesFromStrings(["There is no escape. Only more portfolio."]);
    case "hi":
    case "hello":
      return linesFromStrings([`Hey. You're on ${profile.name}'s machine.`]);
    case "arwin":
      return linesFromStrings([
        `${profile.name} — ${profile.tagline}`,
        profile.email,
      ]);
    default:
      return linesFromStrings([`zsh: command not found: ${cmd}`], "err");
  }
}

function welcomeLines(): TermLine[] {
  const now = new Date().toLocaleString();
  return [
    {
      id: 0,
      kind: "sys",
      parts: [part(`Last login: ${now} on ttys001`, "term-dim")],
    },
    { id: 0, kind: "sys", parts: [part("Type ", "term-dim"), part("help", "term-cyan"), part(" for commands.", "term-dim")] },
  ];
}

function assignIds(lines: TermLine[], start: number): TermLine[] {
  return lines.map((line, i) => ({ ...line, id: start + i }));
}

function renderParts(parts: TermPart[]) {
  return parts.map((p, i) =>
    typeof p === "string" ? (
      <span key={i}>{p}</span>
    ) : (
      <span key={i} className={p.cls}>
        {p.text}
      </span>
    ),
  );
}

export function TerminalApp({ open }: AppRenderApi) {
  const [lines, setLines] = useState<TermLine[]>(() => assignIds(welcomeLines(), 0));
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const nextId = useRef(welcomeLines().length);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const append = (newLines: TermLine[]) => {
    if (newLines.some((l) => l.parts.some((p) => (typeof p === "string" ? p : p.text) === "__CLEAR__"))) {
      nextId.current = 0;
      setLines(assignIds(welcomeLines(), nextId.current));
      nextId.current += welcomeLines().length;
      return;
    }
    const stamped = assignIds(newLines, nextId.current);
    nextId.current += stamped.length;
    setLines((prev) => [...prev, ...stamped]);
  };

  const submit = () => {
    const cmd = input.trim();
    if (!cmd) return;

    const inputLine: TermLine = {
      id: nextId.current++,
      kind: "in",
      parts: [
        part(`${PROMPT_USER}@${PROMPT_HOST} `, "term-green"),
        part(PROMPT_PATH, "term-blue"),
        part(" % ", "term-dim"),
        part(cmd),
      ],
    };

    setLines((prev) => [...prev, inputLine]);
    setHistory((h) => [cmd, ...h]);
    setHistIdx(-1);
    setInput("");

    const out = runCommand(cmd, open);
    append(out);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
      return;
    }
    if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      append([{ id: 0, kind: "sys", parts: ["__CLEAR__"] }]);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] ?? "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx <= 0) {
        setHistIdx(-1);
        setInput("");
        return;
      }
      const next = histIdx - 1;
      setHistIdx(next);
      setInput(history[next] ?? "");
    }
  };

  return (
    <div className="app term" onClick={() => inputRef.current?.focus()}>
      <div className="term__chrome">
        <div className="term__tabs">
          <div className="term__tab term__tab--active">
            <span className="term__tabicon">⌘</span>
            zsh — {PROMPT_PATH}
          </div>
          <div className="term__tab term__tab--ghost">zsh</div>
        </div>
      </div>

      <div className="term__screen" ref={scrollRef}>
        {lines.map((line) => (
          <div key={line.id} className={`term__line term__line--${line.kind}`}>
            {renderParts(line.parts)}
          </div>
        ))}

        <div className="term__inputrow">
          <span className="term-green">{PROMPT_USER}@{PROMPT_HOST} </span>
          <span className="term-blue">{PROMPT_PATH}</span>
          <span className="term-dim"> % </span>
          <input
            ref={inputRef}
            className="term__input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            aria-label="Terminal input"
          />
        </div>
      </div>
    </div>
  );
}
