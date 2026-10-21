import { motion } from 'framer-motion';
import type { IconName, RoadmapSlideData } from '../../data/slides';
import { Icon } from '../icons';
import { EASE_OUT } from '../motion';
import { SlideFrame } from '../ui';

const START = 0.5;
const STEP = 0.55;

const cadenceIcons: IconName[] = ['calendar', 'gauge'];

export function RoadmapSlide({ slide }: { slide: RoadmapSlideData }) {
  const stepsDone = START + slide.steps.length * STEP;
  return (
    <SlideFrame kicker={slide.kicker} title={slide.title}>
      <div className="flex flex-1 flex-col justify-center gap-24 m:justify-start m:gap-8">
        <ol
          className="relative mt-4 grid gap-10 m:mt-0 m:!grid-cols-1 m:gap-6"
          style={{ gridTemplateColumns: `repeat(${slide.steps.length}, minmax(0, 1fr))` }}
        >
          {slide.steps.map((step, i) => (
            <li key={step} className="relative">
              {i < slide.steps.length - 1 ? (
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: START + i * STEP + 0.3, duration: 0.5, ease: EASE_OUT }}
                  className="absolute left-[56px] top-[54px] h-[4px] w-[calc(100%+40px)] origin-left bg-brand-cyan m:hidden"
                />
              ) : null}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: START + i * STEP, duration: 0.55, ease: EASE_OUT }}
                className="relative m:flex m:items-center m:gap-4"
              >
                <span className="relative z-10 flex h-[112px] w-[112px] items-center justify-center rounded-full border-4 border-brand-cyan bg-white text-[48px] font-extrabold text-brand-ink shadow-card m:h-12 m:w-12 m:shrink-0 m:border-2 m:text-xl">
                  {i + 1}
                </span>
                <p className="mt-8 max-w-[460px] text-[34px] font-extrabold leading-tight text-brand-ink m:mt-0 m:text-lg">{step}</p>
              </motion.div>
            </li>
          ))}
        </ol>

        <div className="grid grid-cols-[1fr_620px] gap-10 m:grid-cols-1 m:gap-5">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stepsDone + 0.1, duration: 0.6, ease: EASE_OUT }}
            className="rounded-card bg-brand-sky p-9 shadow-card m:p-5"
          >
            <h3 className="text-[28px] font-extrabold text-brand-ink m:text-lg">{slide.cadence.title}</h3>
            <ul className="mt-6 flex flex-wrap gap-4 m:mt-3 m:gap-2">
              {slide.cadence.chips.map((chip, i) => (
                <li
                  key={chip.label}
                  className="flex items-center gap-3 rounded-full bg-white py-3 pl-3 pr-7 text-[24px] text-brand-ink shadow-card m:py-2 m:pl-2 m:pr-4 m:text-sm"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-cyan m:h-7 m:w-7">
                    <Icon name={cadenceIcons[i] ?? 'calendar'} className="h-6 w-6 text-brand-ink m:h-4 m:w-4" />
                  </span>
                  <span>
                    <span className="font-bold">{chip.label}</span>
                    <span className="text-brand-ink-2"> · {chip.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stepsDone + 0.3, duration: 0.6, ease: EASE_OUT }}
            className="rounded-card bg-white p-9 shadow-card m:p-5"
          >
            <h3 className="text-[28px] font-extrabold text-brand-ink m:text-lg">{slide.repository.title}</h3>
            <p className="mt-6 flex items-center gap-4 text-[24px] font-semibold text-brand-ink m:mt-3 m:gap-3 m:text-sm">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-sky m:h-9 m:w-9 m:rounded-xl">
                <Icon name="folder" className="h-8 w-8 text-brand-cyan-dark m:h-5 m:w-5" />
              </span>
              {slide.repository.label}
            </p>
          </motion.section>
        </div>
      </div>
    </SlideFrame>
  );
}
