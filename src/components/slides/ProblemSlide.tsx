import { motion, type Variants } from 'framer-motion';
import type { IconName, ProblemSlideData } from '../../data/slides';
import { Icon } from '../icons';
import { EASE_OUT } from '../motion';
import { SlideFrame } from '../ui';

const cardsContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.35, delayChildren: 0.45 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 48 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

/** Canales desordenados que "caen" en la primera tarjeta. */
const chaos: { icon: IconName; label: string; x: number; y: number; rotate: number; delay: number }[] = [
  { icon: 'mail', label: 'Correo', x: 0, y: 6, rotate: -14, delay: 0.95 },
  { icon: 'whatsapp', label: 'WhatsApp', x: 74, y: -10, rotate: 11, delay: 1.1 },
  { icon: 'calendar', label: 'Reuniones', x: 150, y: 10, rotate: -6, delay: 1.25 },
];

export function ProblemSlide({ slide }: { slide: ProblemSlideData }) {
  return (
    <SlideFrame kicker={slide.kicker} title={slide.title}>
      <motion.ul variants={cardsContainer} className="my-auto grid grid-cols-3 items-stretch gap-10 m:my-0 m:grid-cols-1 m:gap-5">
        {slide.cards.map((c, i) => (
          <motion.li
            key={c.id}
            variants={card}
            className="flex flex-col rounded-card bg-white p-10 shadow-card m:p-6"
          >
            <div className="flex h-[112px] items-center gap-6 m:h-auto">
              <span className="flex h-[96px] w-[96px] shrink-0 items-center justify-center rounded-[24px] bg-brand-sky m:h-14 m:w-14 m:rounded-2xl">
                <Icon name={c.icon} className="h-12 w-12 text-brand-cyan-dark m:h-7 m:w-7" />
              </span>
              {i === 0 ? (
                <div className="relative h-[72px] w-[220px] m:h-12 m:w-[180px]" aria-hidden>
                  {chaos.map((item) => (
                    <motion.span
                      key={item.icon}
                      initial={{ opacity: 0, y: -260, rotate: item.rotate * 4 }}
                      animate={{ opacity: 1, y: item.y, rotate: item.rotate }}
                      transition={{ delay: item.delay, duration: 0.7, ease: EASE_OUT }}
                      className="absolute top-2 flex h-[60px] w-[60px] items-center justify-center rounded-2xl border border-brand-ink/10 bg-white shadow-card m:h-10 m:w-10 m:rounded-xl"
                      style={{ left: item.x }}
                      title={item.label}
                    >
                      <Icon name={item.icon} className="h-7 w-7 text-brand-ink-2 m:h-5 m:w-5" />
                    </motion.span>
                  ))}
                </div>
              ) : null}
            </div>
            <h3 className="mt-8 text-[36px] font-extrabold leading-tight text-brand-ink m:mt-4 m:text-xl">{c.title}</h3>
            <p className="mt-4 text-[27px] leading-[1.45] text-brand-ink-2 m:mt-2 m:text-base">{c.description}</p>
          </motion.li>
        ))}
      </motion.ul>
    </SlideFrame>
  );
}
