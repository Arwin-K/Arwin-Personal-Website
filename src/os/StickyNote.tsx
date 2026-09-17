import { profile } from "../data/profile";

interface StickyNoteProps {
  onOpen: (id: string) => void;
}

export function StickyNote({ onOpen }: StickyNoteProps) {
  return (
    <div className="sticky">
      <div className="sticky__pin" />
      <p className="sticky__hi">Welcome</p>
      <p className="sticky__text">
        Double-click an icon to open an application, or right-click the desktop to access display settings.
      </p>
      <div className="sticky__links">
        <button onClick={() => onOpen("projects")}>Projects</button>
        <button onClick={() => onOpen("resume")}>Resume</button>
        <a href={profile.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
    </div>
  );
}
