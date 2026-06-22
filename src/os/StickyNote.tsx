import { profile } from "../data/profile";

interface StickyNoteProps {
  onOpen: (id: string) => void;
}

export function StickyNote({ onOpen }: StickyNoteProps) {
  return (
    <div className="sticky">
      <div className="sticky__pin" />
      <p className="sticky__hi">Hey, I'm Arwin 👋</p>
      <p className="sticky__text">
        Welcome to my desktop. Double-click an icon to explore, or right-click anywhere to change
        the wallpaper and theme.
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
