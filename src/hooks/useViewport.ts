import { useEffect, useLayoutEffect, useState } from 'react';

export const STAGE_WIDTH = 1920;
export const STAGE_HEIGHT = 1080;

export interface ViewportInfo {
  /** Modo de flujo: móvil o tablet vertical; el contenido se apila y hace scroll. */
  flow: boolean;
  /** Escala del lienzo 16:9 (solo en modo presentación). */
  scale: number;
}

function measure(): ViewportInfo {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const flow = width < 768 || (height > width && width < 1100);
  return { flow, scale: Math.min(width / STAGE_WIDTH, height / STAGE_HEIGHT) };
}

export function useViewport(): ViewportInfo {
  const [info, setInfo] = useState<ViewportInfo>(measure);

  useEffect(() => {
    const onResize = () => setInfo(measure());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('flow', info.flow);
  }, [info.flow]);

  return info;
}
