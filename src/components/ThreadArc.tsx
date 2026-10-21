import { motion } from 'framer-motion';
import type { SlideTheme } from './theme';
import { EASE_OUT } from './motion';

type ArcPose = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  opacity: number;
};

const HIDDEN: ArcPose = { x: 0, y: 0, rotate: 0, scale: 1, opacity: 0 };

/** Posición del arco (coordenadas del lienzo 1920×1080) por slide: hilo conductor visual. */
const poses: readonly ArcPose[] = [
  { x: 1020, y: 90, rotate: 0, scale: 1, opacity: 0.95 }, // Portada
  { x: 1430, y: -560, rotate: 40, scale: 1, opacity: 0.55 }, // AS IS
  { x: 1810, y: 200, rotate: 100, scale: 1, opacity: 0.6 }, // Objetivo
  { x: 1450, y: -620, rotate: 130, scale: 1, opacity: 0.5 }, // Pilares
  { x: 1830, y: 90, rotate: 160, scale: 1, opacity: 0.5 }, // Conciencia
  { x: 1830, y: 90, rotate: 190, scale: 1, opacity: 0.5 }, // Levantamiento
  { x: 1830, y: 90, rotate: 220, scale: 1, opacity: 0.5 }, // Entrega
  { x: 1830, y: 90, rotate: 250, scale: 1, opacity: 0.5 }, // Control
  { x: 1830, y: 90, rotate: 280, scale: 1, opacity: 0.5 }, // Madurez
  { x: 1830, y: 260, rotate: 320, scale: 1, opacity: 0.5 }, // Mapeo
  { x: -760, y: 150, rotate: 380, scale: 1, opacity: 0.45 }, // Ciclo
  { x: 1830, y: 160, rotate: 420, scale: 1, opacity: 0.5 }, // Siguientes pasos
  { x: 510, y: 90, rotate: 450, scale: 1, opacity: 0 }, // Cierre (el arco propio de la slide toma el relevo)
];

const SIZE = 900;
const R = 410;
// Arco abierto de ~290°, como el anillo del deck original.
const ARC = `M ${SIZE / 2 + R * Math.cos(-0.35 * Math.PI)} ${SIZE / 2 + R * Math.sin(-0.35 * Math.PI)} A ${R} ${R} 0 1 1 ${
  SIZE / 2 + R * Math.cos(-0.65 * Math.PI)
} ${SIZE / 2 + R * Math.sin(-0.65 * Math.PI)}`;

export function ThreadArc({ index, theme }: { index: number; theme: SlideTheme }) {
  const pose = poses[Math.min(index, poses.length - 1)] ?? HIDDEN;
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
          key={index}
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
