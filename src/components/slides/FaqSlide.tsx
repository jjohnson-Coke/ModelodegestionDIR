import { motion } from 'framer-motion';
import type { FaqSlideData } from '../../data/slides';
import { Icon } from '../icons';
import { EASE_OUT } from '../motion';
import { SlideFrame } from '../ui';

const START = 0.5;
const STEP = 0.15;

/** Reparto en una cuadrícula de 6 columnas: 3 tarjetas arriba y 2 abajo. */
function spanFor(index: number, total: number): number {
  const firstRow = Math.ceil(total / 2);
  return index < firstRow ? 6 / firstRow : 6 / (total - firstRow);
}

export function FaqSlide({ slide }: { slide: FaqSlideData }) {
  return (
    <SlideFrame kicker={slide.kicker} title={slide.title}>
      <ul className="my-auto grid grid-cols-6 gap-6 m:my-0 m:grid-cols-1 m:gap-4">
        {slide.items.map((item, i) => {
          const span = spanFor(i, slide.items.length);
          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: START + i * STEP, duration: 0.55, ease: EASE_OUT }}
              className="flex flex-col rounded-card bg-white p-8 shadow-card m:!col-span-1 m:p-5"
              style={{ gridColumn: `span ${span} / span ${span}` }}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-sky m:h-10 m:w-10 m:rounded-xl">
                  <Icon name={item.icon} className="h-7 w-7 text-brand-cyan-dark m:h-5 m:w-5" />
                </span>
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: START + i * STEP + 0.35, duration: 0.4, ease: EASE_OUT }}
                  className="rounded-full bg-brand-cyan/15 px-4 py-1.5 text-[17px] font-bold text-brand-cyan-ink m:px-3 m:py-1 m:text-xs"
                >
                  {item.highlight}
                </motion.span>
              </div>
              <h3 className="mt-5 text-[30px] font-extrabold leading-tight text-brand-ink m:mt-3 m:text-lg">{item.question}</h3>
              <p className="mt-3 text-[24px] leading-[1.45] text-brand-ink-2 m:mt-1.5 m:text-sm">{item.answer}</p>
            </motion.li>
          );
        })}
      </ul>
    </SlideFrame>
  );
}
