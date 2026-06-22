import type { AppDef } from "../os/types";
import { AboutApp } from "./AboutApp";
import { ResumeApp } from "./ResumeApp";
import { ProjectsApp } from "./ProjectsApp";
import { WorkApp } from "./WorkApp";
import { GitHubApp } from "./GitHubApp";
import { BasketballApp } from "./BasketballApp";
import { PhotographyApp } from "./PhotographyApp";
import { ContactApp } from "./ContactApp";
import { DisplayApp } from "./DisplayApp";
import { TrashApp } from "./TrashApp";

export const APPS: AppDef[] = [
  {
    id: "about",
    title: "About Me",
    icon: "about",
    onDesktop: true,
    inDock: true,
    width: 560,
    height: 540,
    render: () => <AboutApp />,
  },
  {
    id: "resume",
    title: "Resume.pdf",
    icon: "resume",
    label: "Resume",
    onDesktop: true,
    inDock: true,
    width: 640,
    height: 600,
    render: () => <ResumeApp />,
  },
  {
    id: "projects",
    title: "Projects",
    icon: "projects",
    onDesktop: true,
    inDock: true,
    width: 620,
    height: 560,
    render: () => <ProjectsApp />,
  },
  {
    id: "work",
    title: "Work Experience",
    icon: "work",
    label: "Work",
    onDesktop: true,
    inDock: true,
    width: 600,
    height: 520,
    render: () => <WorkApp />,
  },
  {
    id: "github",
    title: "GitHub",
    icon: "github",
    onDesktop: true,
    inDock: true,
    width: 560,
    height: 560,
    render: () => <GitHubApp />,
  },
  {
    id: "basketball",
    title: "Basketball",
    icon: "basketball",
    onDesktop: true,
    inDock: true,
    width: 460,
    height: 560,
    render: () => <BasketballApp />,
  },
  {
    id: "photography",
    title: "Photography",
    icon: "photography",
    onDesktop: true,
    inDock: true,
    width: 540,
    height: 500,
    render: () => <PhotographyApp />,
  },
  {
    id: "contact",
    title: "Contact",
    icon: "contact",
    onDesktop: true,
    inDock: true,
    width: 440,
    height: 460,
    render: () => <ContactApp />,
  },
  {
    id: "display",
    title: "Display Options",
    icon: "display",
    onDesktop: false,
    inDock: false,
    width: 420,
    height: 430,
    render: () => <DisplayApp />,
  },
  {
    id: "trash",
    title: "Trash",
    icon: "trash",
    onDesktop: true,
    inDock: false,
    width: 420,
    height: 340,
    render: () => <TrashApp />,
  },
];

export const APP_MAP: Record<string, AppDef> = Object.fromEntries(
  APPS.map((a) => [a.id, a]),
);
