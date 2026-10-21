import { motion } from 'framer-motion';
import type { CoverSlideData } from '../../data/slides';
import { EASE_OUT, at } from '../motion';
import { Logo } from '../ui';

const wordContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.45 } },
};

const word = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

export function CoverSlide({ slide }: { slide: CoverSlideData }) {
  const words = slide.title.split(' ');
  return (
    <motion.section
      initial="hidden"
      animate="show"
      className="relative flex h-full flex-col justify-center px-[140px] m:min-h-full m:justify-end m:px-6 m:pb-44 m:pt-24"
    >
      <motion.h1
        variants={wordContainer}
        className="max-w-[1000px] text-[112px] font-extrabold leading-[1.02] tracking-[-0.03em] text-white m:text-[44px]"
        aria-label={slide.title}
      >
        {words.map((w, i) => (
          <motion.span key={`${w}-${i}`} variants={word} className="mr-[0.25em] inline-block" aria-hidden>
            {w}
          </motion.span>
        ))}
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={at(1.25, 0.7)}
        className="mt-10 h-[6px] w-[140px] origin-left rounded-full bg-brand-cyan m:mt-6 m:w-20"
        aria-hidden
      />
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={at(1.4)}
        className="mt-8 text-[40px] font-medium text-white/90 m:mt-5 m:text-xl"
      >
        {slide.subtitle}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={at(1.7)}
        className="absolute bottom-[56px] left-[140px] text-[24px] font-semibold text-white/85 m:bottom-24 m:left-6 m:text-base"
      >
        <span className="flex items-center gap-3" aria-hidden>
          <Logo className="text-[30px] m:text-lg" />
          <span>·</span>
          <span>®2026</span>
        </span>
        <span className="sr-only">{slide.footer}</span>
      </motion.p>
    </motion.section>
  );
}
