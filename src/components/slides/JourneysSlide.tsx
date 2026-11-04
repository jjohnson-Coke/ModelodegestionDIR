import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import type { JourneyStatusTone, JourneysSlideData } from '../../data/slides';
import { Icon } from '../icons';
import { EASE_OUT } from '../motion';
import { SlideFrame } from '../ui';

const CELLS_START = 0.9;
const CELL_STEP = 0.12;

/** Estilo de cada estado: de lo más avanzado (cian sólido) a lo sin fecha (gris punteado). */
const toneStyles: Record<JourneyStatusTone, { cell: string; icon: string; badge: string; card: string }> = {
  active: {
    cell: 'border-brand-cyan bg-brand-cyan',
    icon: 'text-brand-ink',
    badge: 'bg-brand-cyan text-brand-ink',
    card: 'border-brand-cyan bg-white',
  },
  queued: {
    cell: 'border-brand-cyan bg-brand-sky',
    icon: 'text-brand-cyan-dark',
    badge: 'bg-brand-sky text-brand-cyan-ink',
    card: 'border-brand-cyan/50 bg-white',
  },
  unscheduled: {
    cell: 'border-dashed border-brand-ink/30 bg-white/60',
    icon: 'text-brand-ink-2',
    badge: 'bg-brand-ink/5 text-brand-ink-2',
    card: 'border-dashed border-brand-ink/25 bg-white/70',
  },
};

/** Número que cuenta de 0 al total al entrar en la slide. */
function CountUp({ to, delay }: { to: number; delay: number }) {
  const reduce = useReducedMotion();
  const value = useMotionValue(reduce ? to : 0);
  const rounded = useTransform(value, (v) => Math.round(v));
  useEffect(() => {
    if (reduce) {
      value.set(to);
      return;
    }
    const controls = animate(value, to, { delay, duration: 1.1, ease: EASE_OUT });
    return () => controls.stop();
  }, [reduce, to, delay, value]);
  return <motion.span className="tabular-nums text-brand-cyan-dark">{rounded}</motion.span>;
}

export function JourneysSlide({ slide }: { slide: JourneysSlideData }) {
  // Una celda por journey, en el orden de los grupos.
  const cells = slide.groups.flatMap((group) => group.journeys.map((name) => ({ group, name, key: `${group.id}-${name}` })));
  const cardsStart = CELLS_START + cells.length * CELL_STEP + 0.3;
  const title = `${slide.titleBefore} ${slide.total} ${slide.titleAfter}`;

  return (
    <SlideFrame kicker={slide.kicker}>
      <motion.h2
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6, ease: EASE_OUT }}
        className="-mt-8 text-[68px] font-extrabold leading-[1.05] tracking-[-0.02em] text-brand-ink m:-mt-4 m:text-[30px]"
        aria-label={title}
      >
        <span aria-hidden>
          {slide.titleBefore} <CountUp to={slide.total} delay={0.6} /> {slide.titleAfter}
        </span>
      </motion.h2>

      <div className="my-auto pt-10 m:my-0 m:pt-8">
        {/* Un bloque por journey: la barra completa representa los 6. */}
        <ol className="grid gap-4 m:gap-1.5" style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }} aria-label={title}>
          {cells.map(({ group, name, key }, i) => (
            <motion.li
              key={key}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: CELLS_START + i * CELL_STEP, duration: 0.45, ease: EASE_OUT }}
              className="flex flex-col"
              aria-label={`${name}: ${group.label}`}
            >
              {/* Nombre del journey arriba de su ícono (en móvil va dentro de la tarjeta). */}
              <span className="flex h-[72px] items-end justify-center pb-3 text-center text-[23px] font-bold leading-tight text-brand-ink m:hidden">
                {name}
              </span>
              <span
                className={`flex h-[120px] items-center justify-center rounded-card border-2 shadow-card m:h-14 m:rounded-xl ${toneStyles[group.tone].cell}`}
              >
                <Icon name="route" className={`h-12 w-12 m:h-6 m:w-6 ${toneStyles[group.tone].icon}`} />
              </span>
            </motion.li>
          ))}
        </ol>

        {/* Cada tarjeta ocupa el mismo ancho que sus journeys en la barra. */}
        <ul className="mt-6 grid gap-4 m:mt-5 m:!grid-cols-1 m:gap-3" style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}>
          {slide.groups.map((group, g) => (
            <motion.li
              key={group.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: cardsStart + g * 0.3, duration: 0.55, ease: EASE_OUT }}
              className={`flex flex-col gap-4 rounded-card border-2 p-7 shadow-card m:!col-span-1 m:flex-row m:items-center m:gap-3 m:p-4 ${toneStyles[group.tone].card}`}
              style={{ gridColumn: `span ${group.journeys.length} / span ${group.journeys.length}` }}
            >
              <div className="flex items-center gap-4 m:gap-3">
                <span className="text-[72px] font-extrabold leading-none text-brand-ink m:w-10 m:text-[34px]">{group.journeys.length}</span>
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl m:h-9 m:w-9 m:rounded-xl ${toneStyles[group.tone].badge}`}>
                  <Icon name={group.icon} className="h-7 w-7 m:h-5 m:w-5" />
                </span>
              </div>
              <div>
                <p className="text-[26px] font-bold leading-snug text-brand-ink m:text-base">{group.label}</p>
                <p className="hidden text-sm font-medium text-brand-ink-2 m:mt-0.5 m:block">{group.journeys.join(' · ')}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </SlideFrame>
  );
}
