import { motion } from 'framer-motion';
import type { MaturityIndexSlideData } from '../../data/slides';
import { Icon } from '../icons';
import { EASE_OUT } from '../motion';
import { SlideFrame } from '../ui';

const COMP_START = 0.7;
const COMP_STEP = 0.1;

export function MaturityIndexSlide({ slide }: { slide: MaturityIndexSlideData }) {
  const stagesStart = COMP_START + slide.competencies.length * COMP_STEP + 0.3;
  const stageStep = 0.18;
  const usageDelay = stagesStart + slide.stages.length * stageStep + 0.4;

  return (
    <SlideFrame kicker={slide.kicker} title={slide.title}>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6, ease: EASE_OUT }}
        className="-mt-4 max-w-[1500px] text-[26px] leading-snug text-brand-ink-2 m:mt-0 m:text-base"
      >
        {slide.lead}
      </motion.p>

      <div className="mt-8 grid flex-1 grid-cols-[1.35fr_1fr] gap-10 m:mt-6 m:grid-cols-1 m:gap-6">
        {/* Competencias */}
        <section>
          <h3 className="text-[24px] font-extrabold text-brand-ink m:text-lg">{slide.competenciesTitle}</h3>
          <ul className="mt-4 grid grid-cols-3 gap-4 m:grid-cols-1 m:gap-3">
            {slide.competencies.map((c, i) => (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: COMP_START + i * COMP_STEP, duration: 0.5, ease: EASE_OUT }}
                className="flex flex-col rounded-card bg-white p-5 shadow-card m:flex-row m:items-start m:gap-3 m:p-4"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-sky m:h-9 m:w-9">
                  <Icon name={c.icon} className="h-6 w-6 text-brand-cyan-dark m:h-5 m:w-5" />
                </span>
                <span className="mt-3 block m:mt-0">
                  <span className="flex items-baseline gap-2">
                    <span className="text-[22px] font-extrabold text-brand-ink m:text-base">{c.name}</span>
                    <span className="text-[15px] font-semibold italic text-brand-cyan-ink m:text-xs">{c.original}</span>
                  </span>
                  <span className="mt-1 block text-[17px] leading-snug text-brand-ink-2 m:text-sm">{c.description}</span>
                </span>
              </motion.li>
            ))}
          </ul>
        </section>

        {/* Etapas + cómo lo usamos */}
        <section className="flex flex-col gap-5">
          <div className="rounded-card bg-brand-sky p-6 shadow-card m:p-4">
            <h3 className="text-[24px] font-extrabold text-brand-ink m:text-lg">{slide.stagesTitle}</h3>
            <ol className="mt-5 flex h-[210px] items-end gap-3 m:h-[150px] m:gap-1.5">
              {slide.stages.map((stage, i) => {
                const height = 30 + (70 * i) / (slide.stages.length - 1);
                return (
                  <li key={stage} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <motion.span
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: stagesStart + i * stageStep, duration: 0.5, ease: EASE_OUT }}
                      className="flex w-full origin-bottom items-start justify-center rounded-t-xl bg-brand-cyan pt-2 text-[20px] font-extrabold text-brand-ink m:text-xs"
                      style={{ height: `${height}%`, opacity: 0.45 + (0.55 * i) / (slide.stages.length - 1) }}
                    >
                      {i + 1}
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: stagesStart + i * stageStep + 0.25, duration: 0.4 }}
                      className="text-center text-[17px] font-bold text-brand-ink m:text-[10px]"
                    >
                      {stage}
                    </motion.span>
                  </li>
                );
              })}
            </ol>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: usageDelay, duration: 0.55, ease: EASE_OUT }}
            className="flex items-start gap-4 rounded-card border-2 border-dashed border-brand-cyan-dark/50 bg-white p-6 m:gap-3 m:p-4"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-cyan m:h-9 m:w-9">
              <Icon name="calendar" className="h-6 w-6 text-brand-ink m:h-5 m:w-5" />
            </span>
            <span>
              <span className="block text-[20px] font-extrabold text-brand-ink m:text-base">{slide.usageTitle}</span>
              <span className="mt-1 block text-[18px] leading-snug text-brand-ink-2 m:text-sm">{slide.usage}</span>
            </span>
          </motion.div>
          <p className="text-[14px] text-brand-ink-2 m:text-xs">{slide.source}</p>
        </section>
      </div>
    </SlideFrame>
  );
}
