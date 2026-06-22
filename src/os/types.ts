import type { ReactNode } from "react";

export interface AppDef {
  id: string;
  title: string;
  icon: string;
  /** Short label shown under desktop icons (defaults to title). */
  label?: string;
  /** Whether this app shows as a desktop icon. */
  onDesktop?: boolean;
  /** Whether this app shows in the dock. */
  inDock?: boolean;
  /** Default window size. */
  width?: number;
  height?: number;
  /** Renders the window body. */
  render: (api: AppRenderApi) => ReactNode;
}

export interface AppRenderApi {
  /** Open another app window by id (used for folder -> file navigation). */
  open: (id: string) => void;
}

export interface Origin {
  x: number;
  y: number;
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  /** Screen coords where the open was triggered (for the open animation). */
  origin?: Origin;
}
