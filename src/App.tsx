import { Desktop } from "./os/Desktop";
import { WallpaperProvider } from "./os/WallpaperContext";
import { ThemeProvider } from "./os/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <WallpaperProvider>
        <Desktop />
      </WallpaperProvider>
    </ThemeProvider>
  );
}
