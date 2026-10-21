import type { Transition, Variants } from 'framer-motion';

/** Curva easeOut suave, sin rebotes. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const LOCK_MS = 350;
export const SLIDE_DURATION = 0.55;

/** Tiempo en que los revelados internos empiezan (después de la transición entre slides). */
export const REVEAL_START = 0.3;

export function stagger(staggerChildren = 0.1, delayChildren = REVEAL_START): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren, delayChildren } },
  };
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE_OUT } },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE_OUT } },
};

export function at(delay: number, duration = 0.6): Transition {
  return { delay, duration, ease: EASE_OUT };
}
