import { Desktop } from "./os/Desktop";
import { PhoneOS } from "./os/PhoneOS";
import { useIsMobile } from "./os/useIsMobile";
import { WallpaperProvider } from "./os/WallpaperContext";
import { ThemeProvider } from "./os/ThemeContext";
import { CudaResearchPage } from "./apps/CudaResearchPage";

export default function App() {
  const isMobile = useIsMobile();
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";

  if (pathname === "/cuda-research") {
    return <CudaResearchPage />;
  }

  return (
    <ThemeProvider>
      <WallpaperProvider mode={isMobile ? "phone" : "desktop"}>
        {isMobile ? <PhoneOS /> : <Desktop />}
      </WallpaperProvider>
    </ThemeProvider>
  );
}
