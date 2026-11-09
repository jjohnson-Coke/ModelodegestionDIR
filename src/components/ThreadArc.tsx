import { motion } from 'framer-motion';
import type { SlideTheme } from './theme';
import { ARC_SIZE, COVER_ARC_POSITION } from './arcGeometry';
import { EASE_OUT } from './motion';

type ArcPose = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  opacity: number;
};

const HIDDEN: ArcPose = { x: 0, y: 0, rotate: 0, scale: 1, opacity: 0 };

const SIZE = ARC_SIZE;

/** Posición del arco (coordenadas del lienzo 1920×1080) por id de slide: hilo conductor visual. */
const poses: Readonly<Record<string, ArcPose>> = {
  portada: { ...COVER_ARC_POSITION, rotate: 0, scale: 1, opacity: 0.95 },
  'as-is': { x: 1430, y: -560, rotate: 40, scale: 1, opacity: 0.55 },
  objetivo: { x: 1810, y: 200, rotate: 100, scale: 1, opacity: 0.6 },
  'journeys-hoy': { x: 1440, y: -600, rotate: 115, scale: 1, opacity: 0.5 },
  pilares: { x: 1450, y: -620, rotate: 130, scale: 1, opacity: 0.5 },
  madurez: { x: 1830, y: 90, rotate: 160, scale: 1, opacity: 0.5 },
  conciencia: { x: 1830, y: 90, rotate: 190, scale: 1, opacity: 0.5 },
  levantamiento: { x: 1830, y: 90, rotate: 220, scale: 1, opacity: 0.5 },
  control: { x: 1830, y: 90, rotate: 250, scale: 1, opacity: 0.5 },
  entrega: { x: 1830, y: 90, rotate: 280, scale: 1, opacity: 0.5 },
  ciclo: { x: -760, y: 150, rotate: 380, scale: 1, opacity: 0.45 },
  testimonios: { x: 1440, y: -600, rotate: 395, scale: 1, opacity: 0.5 },
  'indice-madurez': { x: 1830, y: 420, rotate: 400, scale: 1, opacity: 0.5 },
  'preguntas-frecuentes': { x: 1830, y: 400, rotate: 410, scale: 1, opacity: 0.5 },
  'proceso-habilitacion': { x: 1830, y: 380, rotate: 415, scale: 1, opacity: 0.5 },
  'siguientes-pasos': { x: 1830, y: 160, rotate: 420, scale: 1, opacity: 0.5 },
  cierre: { x: 510, y: 90, rotate: 450, scale: 1, opacity: 0 }, // el arco propio de la slide toma el relevo
};

const R = 410;
// Arco abierto de ~290°, como el anillo del deck original.
const ARC = `M ${SIZE / 2 + R * Math.cos(-0.35 * Math.PI)} ${SIZE / 2 + R * Math.sin(-0.35 * Math.PI)} A ${R} ${R} 0 1 1 ${
  SIZE / 2 + R * Math.cos(-0.65 * Math.PI)
} ${SIZE / 2 + R * Math.sin(-0.65 * Math.PI)}`;

export function ThreadArc({ slideId, theme }: { slideId: string; theme: SlideTheme }) {
  const pose = poses[slideId] ?? HIDDEN;
  const onDark = theme !== 'light';
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0"
      style={{ width: SIZE, height: SIZE }}
      initial={false}
      animate={pose}
      transition={{ duration: 1, ease: EASE_OUT }}
    >
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="overflow-visible">
        <motion.path
          key={slideId}
          d={ARC}
          fill="none"
          stroke={onDark ? '#1EB8E6' : '#5FD0E0'}
          strokeWidth={onDark ? 10 : 14}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: EASE_OUT }}
        />
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R - 46} fill="none" stroke="#5FD0E0" strokeOpacity={0.35} strokeWidth={2} />
      </svg>
    </motion.div>
  );
}
