import { useEffect, useState } from "react";

/**
 * Returns true when the viewport is phone-sized. Used to swap the desktop
 * "OS" experience for the iPhone-style UI on small screens.
 */
export function useIsMobile(breakpoint = 768) {
  const query = `(max-width: ${breakpoint}px)`;
  const getMatch = () =>
    typeof window !== "undefined" && window.matchMedia(query).matches;

  const [isMobile, setIsMobile] = useState(getMatch);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return isMobile;
}
