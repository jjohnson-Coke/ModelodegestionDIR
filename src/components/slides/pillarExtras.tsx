import { motion, useReducedMotion } from 'framer-motion';
import type { IconName } from '../../data/slides';
import { Icon } from '../icons';
import { EASE_OUT } from '../motion';
import { FitBox } from '../ui';

/* ------------------------------------------------------------------ */
/* Conciencia: 7 pasos de la metodología (solo números).               */
/* ------------------------------------------------------------------ */

export function MethodSteps({ count, label, delay }: { count: number; label: string; delay: number }) {
  const steps = Array.from({ length: count }, (_, i) => i + 1);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: EASE_OUT }}
      className="mt-6 flex items-center gap-10 rounded-card border border-brand-ink/10 bg-white/70 px-10 py-4 m:mt-8 m:flex-col m:items-start m:gap-4 m:px-4 m:py-4"
    >
      <p className="w-[300px] shrink-0 text-[24px] font-bold leading-snug text-brand-ink m:w-auto m:text-base">{label}</p>
      <ol className="relative flex flex-1 items-center justify-between m:w-full" aria-label={label}>
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: delay + 0.2, duration: 1.1, ease: EASE_OUT }}
          className="absolute left-[36px] right-[36px] top-[calc(50%-1.5px)] h-[3px] origin-left bg-brand-cyan/50 m:left-4 m:right-4"
        />
        {steps.map((n) => (
          <motion.li
            key={n}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2 + n * 0.12, duration: 0.4, ease: EASE_OUT }}
            className="relative z-10 flex h-[60px] w-[60px] items-center justify-center rounded-full border-[3px] border-brand-cyan bg-white text-[28px] font-extrabold text-brand-ink m:h-9 m:w-9 m:border-2 m:text-sm"
          >
            {n}
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Levantamiento: embudo de canales → una solicitud homologada.        */
/* ------------------------------------------------------------------ */

const channels: { icon: IconName; label: string; x: number }[] = [
  { icon: 'mail', label: 'Correo', x: 40 },
  { icon: 'whatsapp', label: 'WhatsApp', x: 180 },
  { icon: 'meeting', label: 'Reuniones', x: 320 },
];

const FUNNEL_W = 440;
const FUNNEL_H = 560;
const ICON = 80;
const CENTER_X = FUNNEL_W / 2 - ICON / 2;

export function Funnel({ output, delay }: { output: string; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <FitBox width={FUNNEL_W} height={FUNNEL_H} className="m:mx-auto m:max-w-[300px]">
      <div className="relative h-full w-full" aria-hidden>
        <svg className="absolute inset-0" width={FUNNEL_W} height={FUNNEL_H} viewBox={`0 0 ${FUNNEL_W} ${FUNNEL_H}`}>
          <motion.path
            d="M 20 150 L 420 150 L 260 330 L 260 370 L 180 370 L 180 330 Z"
            fill="#E3EEFA"
            stroke="#1EB8E6"
            strokeWidth={4}
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay, duration: 0.8, ease: EASE_OUT }}
          />
        </svg>
        {channels.map((c, i) => (
          <motion.span
            key={c.icon}
            title={c.label}
            className="absolute top-[30px] flex items-center justify-center rounded-2xl border border-brand-ink/10 bg-white shadow-card"
            style={{ width: ICON, height: ICON, left: c.x }}
            initial={{ opacity: 0, x: 0, y: -40 }}
            animate={
              reduce
                ? { opacity: 1, x: 0, y: 0 }
                : {
                    opacity: [0, 1, 1, 0],
                    x: [0, 0, CENTER_X - c.x, CENTER_X - c.x],
                    y: [-40, 0, 190, 250],
                    scale: [1, 1, 0.75, 0.5],
                  }
            }
            transition={
              reduce
                ? { delay: delay + i * 0.1, duration: 0.3 }
                : {
                    delay: delay + 0.5 + i * 0.35,
                    duration: 1.8,
                    times: [0, 0.2, 0.75, 1],
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatDelay: 1.6,
                  }
            }
          >
            <Icon name={c.icon} className="h-9 w-9 text-brand-ink-2" />
          </motion.span>
        ))}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + (reduce ? 0.3 : 2.1), duration: 0.6, ease: EASE_OUT }}
          className="absolute left-[70px] top-[400px] flex w-[300px] items-center gap-4 rounded-card border-2 border-brand-cyan bg-white px-6 py-5 shadow-card"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-cyan">
            <Icon name="clipboard" className="h-8 w-8 text-brand-ink" />
          </span>
          <span className="text-[30px] font-extrabold text-brand-ink">{output}</span>
        </motion.div>
      </div>
    </FitBox>
  );
}

/* ------------------------------------------------------------------ */
/* Madurez: medidor conceptual sin cifras.                             */
/* ------------------------------------------------------------------ */

const GAUGE_W = 440;
const GAUGE_H = 380;
const R = 170;
const CX = GAUGE_W / 2;
const CY = 250;
const ARC = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`;
/** Avance conceptual de la aguja (sin valor numérico asociado). */
const NEEDLE_PROGRESS = 0.68;

export function Gauge({ label, delay }: { label: string; delay: number }) {
  return (
    <FitBox width={GAUGE_W} height={GAUGE_H} className="m:mx-auto m:max-w-[300px]">
      <div className="relative h-full w-full">
        <svg className="absolute inset-0" width={GAUGE_W} height={GAUGE_H} viewBox={`0 0 ${GAUGE_W} ${GAUGE_H}`} aria-hidden>
          <path d={ARC} fill="none" stroke="#E3EEFA" strokeWidth={34} strokeLinecap="round" />
          <motion.path
            d={ARC}
            fill="none"
            stroke="#1EB8E6"
            strokeWidth={34}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: NEEDLE_PROGRESS }}
            transition={{ delay: delay + 0.2, duration: 1.8, ease: EASE_OUT }}
          />
        </svg>
        <motion.span
          aria-hidden
          className="absolute h-[150px] w-[10px] origin-bottom rounded-full bg-brand-ink"
          style={{ left: CX - 5, top: CY - 150 }}
          initial={{ rotate: -90 }}
          animate={{ rotate: -90 + 180 * NEEDLE_PROGRESS }}
          transition={{ delay: delay + 0.2, duration: 1.8, ease: EASE_OUT }}
        />
        <span
          aria-hidden
          className="absolute h-[36px] w-[36px] rounded-full border-[6px] border-white bg-brand-ink shadow-card"
          style={{ left: CX - 18, top: CY - 18 }}
        />
        <p className="absolute inset-x-0 top-[296px] text-center text-[24px] font-bold leading-snug text-brand-ink">{label}</p>
      </div>
    </FitBox>
  );
}
