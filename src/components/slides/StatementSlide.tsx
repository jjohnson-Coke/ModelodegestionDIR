import { motion, type Variants } from 'framer-motion';
import type { StatementSlideData } from '../../data/slides';
import { EASE_OUT } from '../motion';
import { SlideFrame } from '../ui';

const PHRASE_START = 0.5;
const PHRASE_STEP = 0.3;

const phraseVariants: Variants = {
  hidden: { opacity: 0 },
  show: (i: number) => ({
    opacity: 1,
    transition: { delay: PHRASE_START + i * PHRASE_STEP, duration: 0.6, ease: EASE_OUT },
  }),
};

export function StatementSlide({ slide }: { slide: StatementSlideData }) {
  const phrasesEnd = PHRASE_START + slide.phrases.length * PHRASE_STEP + 0.2;
  const verbDelay = (i: number) => phrasesEnd + i * 0.25;
  const chipsStart = verbDelay(slide.chips.length) + 0.1;
  let verbIndex = -1;

  return (
    <SlideFrame kicker={slide.kicker} tone="dark">
      <div className="flex flex-1 flex-col justify-center">
        <p className="max-w-[1580px] text-[60px] font-bold leading-[1.28] tracking-[-0.01em] text-white m:text-[24px] m:leading-[1.4]">
          {slide.phrases.map((phrase, p) => (
            <motion.span key={p} custom={p} variants={phraseVariants} className="inline">
              {phrase.map((segment, s) => {
                if (!segment.highlight) return <span key={s}>{segment.text}</span>;
                verbIndex += 1;
                return (
                  <span key={s} className="relative inline-block">
                    <span>{segment.text}</span>
                    <motion.span
                      aria-hidden
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: verbDelay(verbIndex), duration: 0.5, ease: EASE_OUT }}
                      className="absolute inset-0 text-brand-cyan [text-shadow:0_0_28px_rgba(30,184,230,0.55)]"
                    >
                      {segment.text}
                    </motion.span>
                  </span>
                );
              })}
              {p < slide.phrases.length - 1 ? ' ' : null}
            </motion.span>
          ))}
        </p>
        <ul className="mt-16 flex flex-wrap items-center gap-5 m:mt-10 m:gap-3">
          {slide.chips.map((chip, i) => (
            <motion.li
              key={chip}
              initial={{ opacity: 0, y: 18, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: chipsStart + i * 0.12, duration: 0.5, ease: EASE_OUT }}
              className="flex items-center gap-4 rounded-full border-2 border-brand-cyan/70 bg-brand-cyan/10 py-3 pl-3 pr-8 text-[28px] font-semibold text-white m:gap-2 m:py-1.5 m:pl-1.5 m:pr-4 m:text-sm"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-cyan text-[22px] font-extrabold text-brand-ink m:h-7 m:w-7 m:text-xs">
                {i + 1}
              </span>
              {chip}
            </motion.li>
          ))}
        </ul>
      </div>
    </SlideFrame>
  );
}
