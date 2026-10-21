import { useCallback, useEffect, useState } from 'react';

/** Estado y control de pantalla completa (API Fullscreen del navegador). */
export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(() => Boolean(document.fullscreenElement));
  // iPhone (Safari) no permite pantalla completa en páginas: ahí el botón no se muestra.
  const supported = Boolean(document.fullscreenEnabled);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggle = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
    } else if (document.fullscreenEnabled) {
      void document.documentElement.requestFullscreen().catch(() => undefined);
    }
  }, []);

  const exit = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
  }, []);

  return { isFullscreen, supported, toggle, exit };
}
