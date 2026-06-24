import { Desktop } from "./os/Desktop";
import { PhoneOS } from "./os/PhoneOS";
import { useIsMobile } from "./os/useIsMobile";
import { WallpaperProvider } from "./os/WallpaperContext";
import { ThemeProvider } from "./os/ThemeContext";

export default function App() {
  const isMobile = useIsMobile();

  return (
    <ThemeProvider>
      <WallpaperProvider mode={isMobile ? "phone" : "desktop"}>
        {isMobile ? <PhoneOS /> : <Desktop />}
      </WallpaperProvider>
    </ThemeProvider>
  );
}
