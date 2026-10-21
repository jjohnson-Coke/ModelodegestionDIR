import { useCallback, useEffect, useRef, useState } from 'react';
import { LOCK_MS } from '../components/motion';

/** Convierte `#/3` en el índice 2. Devuelve `null` si el hash no es válido. */
export function parseHash(hash: string, total: number): number | null {
  const match = /^#\/(\d{1,3})$/.exec(hash);
  if (!match?.[1]) return null;
  const n = Number(match[1]);
  return n >= 1 && n <= total ? n - 1 : null;
}

function writeHash(index: number) {
  const { pathname, search } = window.location;
  window.history.replaceState(null, '', `${pathname}${search}#/${index + 1}`);
}

export interface DeckState {
  index: number;
  /** 1 = avanzar, -1 = retroceder (define la dirección de la transición). */
  direction: 1 | -1;
}

export interface DeckApi extends DeckState {
  total: number;
  next: () => void;
  prev: () => void;
  first: () => void;
  last: () => void;
  goTo: (target: number) => void;
}

export function useDeck(total: number): DeckApi {
  const [state, setState] = useState<DeckState>(() => ({
    index: parseHash(window.location.hash, total) ?? 0,
    direction: 1,
  }));
  const indexRef = useRef(state.index);
  const lastNavRef = useRef(-Infinity);

  const navigate = useCallback(
    (target: number, force = false) => {
      if (target < 0 || target >= total || target === indexRef.current) return;
      const now = performance.now();
      // Bloqueo durante la transición: evita saltos caóticos al mantener la flecha presionada.
      if (!force && now - lastNavRef.current < LOCK_MS) return;
      lastNavRef.current = now;
      const direction = target > indexRef.current ? 1 : -1;
      indexRef.current = target;
      setState({ index: target, direction });
    },
    [total],
  );

  // La slide actual siempre se refleja en la URL (también corrige un hash inválido a #/1).
  useEffect(() => {
    writeHash(state.index);
  }, [state.index]);

  // Edición manual del hash (o enlaces internos).
  useEffect(() => {
    const onHashChange = () => {
      const parsed = parseHash(window.location.hash, total);
      if (parsed === null) {
        navigate(0, true);
        writeHash(0);
      } else {
        navigate(parsed, true);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [navigate, total]);

  return {
    ...state,
    total,
    next: useCallback(() => navigate(indexRef.current + 1), [navigate]),
    prev: useCallback(() => navigate(indexRef.current - 1), [navigate]),
    first: useCallback(() => navigate(0), [navigate]),
    last: useCallback(() => navigate(total - 1), [navigate, total]),
    goTo: useCallback((target: number) => navigate(target), [navigate]),
  };
}

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

function isActivatable(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && ['BUTTON', 'A'].includes(target.tagName);
}

interface KeyboardOptions {
  deck: DeckApi;
  toggleFullscreen: () => void;
  exitFullscreen: () => void;
  toggleNotes: () => void;
}

export function useDeckKeyboard({ deck, toggleFullscreen, exitFullscreen, toggleNotes }: KeyboardOptions) {
  const { next, prev, first, last } = deck;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
      if (isEditable(event.target)) return;
      // Enter/Espacio sobre un botón enfocado (p. ej. un punto de navegación) activan ese botón.
      if ((event.key === 'Enter' || event.key === ' ') && isActivatable(event.target)) return;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'PageDown':
        case 'Enter':
          event.preventDefault();
          next();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
        case 'Backspace':
          event.preventDefault();
          prev();
          break;
        case 'Home':
          event.preventDefault();
          first();
          break;
        case 'End':
          event.preventDefault();
          last();
          break;
        case 'f':
        case 'F':
          event.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          exitFullscreen();
          break;
        case 'n':
        case 'N':
          event.preventDefault();
          toggleNotes();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    // Señal de que la presentación ya responde al teclado (útil para pruebas automatizadas).
    document.documentElement.dataset.deckReady = 'true';
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [next, prev, first, last, toggleFullscreen, exitFullscreen, toggleNotes]);
}
