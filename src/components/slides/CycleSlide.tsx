import { motion, useReducedMotion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { pillars, type CycleSlideData } from '../../data/slides';
import { Icon } from '../icons';
import { EASE_OUT } from '../motion';
import { FitBox, SlideFrame } from '../ui';

const BOX = 900;
const CX = 450;
const CY = 430;
const R = 300;
const NODE = 124;
const START = 0.5;
const STEP = 0.25;

const toRad = (deg: number) => (deg * Math.PI) / 180;
const angleOf = (i: number) => -90 + (i * 360) / pillars.length;
const point = (deg: number, r = R) => ({ x: CX + r * Math.cos(toRad(deg)), y: CY + r * Math.sin(toRad(deg)) });

function arcPath(fromDeg: number, toDeg: number) {
  const a = point(fromDeg);
  const b = point(toDeg);
  const large = (toDeg - fromDeg + 360) % 360 > 180 ? 1 : 0;
  return `M ${a.x} ${a.y} A ${R} ${R} 0 ${large} 1 ${b.x} ${b.y}`;
}

export function CycleSlide({ slide }: { slide: CycleSlideData }) {
  const reduce = useReducedMotion();
  const ringDone = START + pillars.length * STEP + 0.4;
  const lastAngle = angleOf(pillars.length - 1);

  return (
    <SlideFrame kicker={slide.kicker} title={slide.title} headerClassName="max-w-[760px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: ringDone + 0.4, duration: 0.6, ease: EASE_OUT }}
        className="mt-6 flex max-w-[680px] items-start gap-6 rounded-card bg-brand-sky p-8 shadow-card m:mt-0 m:max-w-none m:gap-3 m:p-4"
      >
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-cyan m:h-10 m:w-10 m:rounded-xl">
          <RefreshCw className="h-8 w-8 text-brand-ink m:h-5 m:w-5" strokeWidth={2} aria-hidden />
        </span>
        <p className="text-[34px] font-bold leading-snug text-brand-ink m:text-base">{slide.support}</p>
      </motion.div>

      <div className="absolute right-[-20px] top-[-260px] w-[900px] m:static m:mt-8 m:w-auto">
        <FitBox width={BOX} height={BOX} className="m:mx-auto">
          <div className="relative h-full w-full">
            <svg className="absolute inset-0" width={BOX} height={BOX} viewBox={`0 0 ${BOX} ${BOX}`} aria-hidden>
              <motion.circle
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke="#5FD0E0"
                strokeWidth={6}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: START, duration: pillars.length * STEP + 0.4, ease: 'easeInOut' }}
                style={{ rotate: -90, originX: '50%', originY: '50%' }}
              />
              {/* Cierre del ciclo (último pilar → Conciencia): inicia la siguiente vuelta. */}
              <motion.path
                d={arcPath(lastAngle, 270)}
                fill="none"
                stroke="#1EB8E6"
                strokeWidth={12}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: ringDone + 0.2, duration: 0.8, ease: EASE_OUT }}
              />
              {pillars.map((p, i) => {
                const mid = angleOf(i) + 180 / pillars.length;
                const { x, y } = point(mid);
                return (
                  <motion.path
                    key={p.id}
                    d="M -9 -12 L 7 0 L -9 12"
                    fill="none"
                    stroke="#0A8DB8"
                    strokeWidth={5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform={`translate(${x} ${y}) rotate(${mid + 90})`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: START + (i + 1) * STEP, duration: 0.3 }}
                  />
                );
              })}
            </svg>

            {!reduce ? (
              <motion.div
                aria-hidden
                className="absolute"
                style={{ left: CX - R, top: CY - R, width: R * 2, height: R * 2 }}
                initial={{ rotate: 0, opacity: 0 }}
                animate={{ rotate: 360, opacity: 1 }}
                transition={{
                  rotate: { delay: ringDone, duration: 7, ease: 'linear', repeat: Infinity },
                  opacity: { delay: ringDone, duration: 0.4 },
                }}
              >
                <span className="absolute left-1/2 top-0 -ml-[13px] -mt-[13px] h-[26px] w-[26px] rounded-full bg-brand-cyan shadow-[0_0_24px_8px_rgba(30,184,230,0.55)]" />
              </motion.div>
            ) : null}

            <motion.span
              aria-hidden
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: ringDone, duration: 0.5, ease: EASE_OUT }}
              className="absolute flex items-center justify-center rounded-full bg-white shadow-card"
              style={{ left: CX - 70, top: CY - 70, width: 140, height: 140 }}
            >
              <RefreshCw className="h-16 w-16 text-brand-cyan-dark" strokeWidth={1.75} />
            </motion.span>

            <ol>
              {pillars.map((p, i) => {
                const { x, y } = point(angleOf(i));
                return (
                  <motion.li
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: START + i * STEP, duration: 0.45, ease: EASE_OUT }}
                    className="absolute flex flex-col items-center"
                    style={{ left: x - 130, top: y - NODE / 2, width: 260 }}
                  >
                    <span
                      className="relative z-10 flex items-center justify-center rounded-full border-4 border-brand-cyan bg-white shadow-card"
                      style={{ width: NODE, height: NODE }}
                    >
                      <Icon name={p.icon} className="h-14 w-14 text-brand-cyan-dark" />
                      <span className="absolute -left-1 -top-1 flex h-10 w-10 items-center justify-center rounded-full bg-brand-ink text-[18px] font-bold text-white">
                        {i + 1}
                      </span>
                    </span>
                    <span className="mt-3 rounded-2xl bg-brand-paper/95 px-4 py-1.5 text-center">
                      <span className="block text-[28px] font-extrabold leading-tight text-brand-ink">{p.name}</span>
                      <span className="block text-[21px] font-semibold leading-snug text-brand-cyan-ink">{p.verb}</span>
                    </span>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </FitBox>
      </div>
    </SlideFrame>
  );
}
