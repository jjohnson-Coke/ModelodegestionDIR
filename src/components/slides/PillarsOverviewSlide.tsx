import { motion } from 'framer-motion';
import { pillars, type PillarsOverviewSlideData } from '../../data/slides';
import { Icon } from '../icons';
import { EASE_OUT } from '../motion';
import { SlideFrame } from '../ui';

const START = 0.5;
const STEP = 0.32;

export function PillarsOverviewSlide({ slide }: { slide: PillarsOverviewSlideData }) {
  const lineDuration = STEP * (pillars.length - 1) + 0.2;
  const DELIVERABLES_START = START + pillars.length * STEP + 0.3;
  return (
    <SlideFrame kicker={slide.kicker} title={slide.title}>
      <div className="relative flex flex-1 flex-col justify-center">
        <ol className="relative grid grid-cols-5 gap-8 m:grid-cols-1 m:gap-4">
          {/* Línea de flujo que se dibuja de izquierda a derecha a través de los nodos. */}
          <svg
            className="pointer-events-none absolute left-[10%] top-[56px] h-[4px] w-[80%] overflow-visible m:hidden"
            viewBox="0 0 100 4"
            preserveAspectRatio="none"
            aria-hidden
          >
            <motion.line
              x1="0"
              y1="2"
              x2="100"
              y2="2"
              stroke="#1EB8E6"
              strokeWidth="4"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: START, duration: lineDuration, ease: 'linear' }}
            />
          </svg>
          {pillars.map((pillar, i) => (
            <motion.li
              key={pillar.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: START + i * STEP, duration: 0.55, ease: EASE_OUT }}
              className="relative flex flex-col items-center text-center m:flex-row m:flex-wrap m:items-start m:gap-x-4 m:gap-y-0 m:text-left"
            >
              <span className="relative z-10 flex h-[112px] w-[112px] items-center justify-center rounded-full border-4 border-brand-cyan bg-white shadow-card m:h-14 m:w-14 m:border-2">
                <Icon name={pillar.icon} className="h-12 w-12 text-brand-cyan-dark m:h-6 m:w-6" />
                <span className="absolute -right-1 -top-1 flex h-10 w-10 items-center justify-center rounded-full bg-brand-ink text-[18px] font-bold text-white m:-right-2 m:-top-2 m:h-6 m:w-6 m:text-[11px]">
                  {i + 1}
                </span>
              </span>
              <div className="mt-6 flex min-h-[200px] w-full flex-col rounded-card bg-brand-sky px-5 py-6 shadow-card m:mt-0 m:min-h-0 m:w-auto m:flex-1 m:px-4 m:py-4">
                <h3 className="text-[32px] font-extrabold text-brand-ink m:text-lg">{pillar.name}</h3>
                <p className="mt-2 text-[21px] leading-[1.4] text-brand-ink-2 m:mt-1 m:text-sm">{pillar.purpose}</p>
              </div>
              {/* Entregables de la etapa (los alcances del pilar), debajo del recuadro. */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: DELIVERABLES_START + i * 0.12, duration: 0.45, ease: EASE_OUT }}
                className="mt-4 flex w-full flex-1 flex-col rounded-2xl border-2 border-dashed border-brand-cyan-dark/50 bg-white px-4 py-3 text-left m:ml-[72px] m:mt-2 m:basis-full m:px-3 m:py-2"
              >
                <span className="text-[14px] font-bold uppercase tracking-[0.18em] text-brand-cyan-ink m:text-[10px]">Entregables</span>
                <ul className="mt-2 flex flex-col gap-2 m:mt-1 m:gap-1">
                  {pillar.deliverables.map((d) => (
                    <li key={d} className="flex gap-2 text-[19px] font-semibold leading-snug text-brand-ink m:text-xs">
                      <span className="mt-[0.45em] h-2 w-2 shrink-0 rounded-full bg-brand-cyan m:h-1.5 m:w-1.5" aria-hidden />
                      {d}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.li>
          ))}
        </ol>
      </div>
    </SlideFrame>
  );
}
