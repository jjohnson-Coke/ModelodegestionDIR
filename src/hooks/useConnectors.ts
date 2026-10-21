import { useCallback, useLayoutEffect, useState, type RefObject } from 'react';

export interface ConnectorPair {
  key: string;
  from: string;
  to: string;
}

export interface Connector extends ConnectorPair {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Posición de un elemento relativa al contenedor usando offsets de layout:
 * no se ve afectada por transformaciones (animaciones ni escala del lienzo).
 */
function boxWithin(el: HTMLElement, container: HTMLElement): Box {
  let left = 0;
  let top = 0;
  let node: HTMLElement | null = el;
  while (node && node !== container) {
    left += node.offsetLeft;
    top += node.offsetTop;
    node = node.offsetParent instanceof HTMLElement ? node.offsetParent : null;
  }
  return { left, top, width: el.offsetWidth, height: el.offsetHeight };
}

/**
 * Calcula líneas entre elementos marcados con `data-anchor` dentro del contenedor:
 * del borde derecho de `from` al borde izquierdo de `to`.
 */
export function useConnectors(containerRef: RefObject<HTMLElement>, pairs: readonly ConnectorPair[], enabled = true) {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const update = useCallback(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;
    const find = (id: string) => container.querySelector<HTMLElement>(`[data-anchor="${id}"]`);
    const result: Connector[] = [];
    for (const pair of pairs) {
      const a = find(pair.from);
      const b = find(pair.to);
      if (!a || !b) continue;
      const boxA = boxWithin(a, container);
      const boxB = boxWithin(b, container);
      result.push({
        ...pair,
        x1: boxA.left + boxA.width,
        y1: boxA.top + boxA.height / 2,
        x2: boxB.left,
        y2: boxB.top + boxB.height / 2,
      });
    }
    setConnectors(result);
    setSize({ width: container.offsetWidth, height: container.offsetHeight });
  }, [containerRef, pairs, enabled]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;
    update();
    const observer = new ResizeObserver(() => update());
    observer.observe(container);
    container.querySelectorAll('[data-anchor]').forEach((el) => observer.observe(el));
    let cancelled = false;
    void document.fonts?.ready.then(() => {
      if (!cancelled) update();
    });
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [containerRef, update, enabled]);

  return { connectors, size };
}

/** Curva Bézier horizontal suave entre dos puntos. */
export function curvePath({ x1, y1, x2, y2 }: Pick<Connector, 'x1' | 'y1' | 'x2' | 'y2'>): string {
  const dx = Math.max(40, (x2 - x1) * 0.5);
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}
