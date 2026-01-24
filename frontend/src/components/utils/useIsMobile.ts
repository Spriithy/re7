import { useState, useEffect } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();

    // Throttle resize events to improve performance
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const throttledCheckMobile = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        checkMobile();
        timeoutId = null;
      }, 150);
    };

    window.addEventListener("resize", throttledCheckMobile);
    return () => {
      window.removeEventListener("resize", throttledCheckMobile);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return isMobile;
}
