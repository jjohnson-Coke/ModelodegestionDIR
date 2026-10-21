import { motion } from 'framer-motion';
import type { ClosingSlideData } from '../../data/slides';
import { EASE_OUT } from '../motion';
import { Logo } from '../ui';

const SIZE = 640;
const R = 300;

export function ClosingSlide({ slide }: { slide: ClosingSlideData }) {
  return (
    <section className="relative flex h-full flex-col items-center justify-center m:min-h-full">
      <div className="relative flex items-center justify-center" style={{ width: SIZE, height: SIZE, maxWidth: '86vw', maxHeight: '86vw' }}>
        <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden>
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="#1EB8E6" strokeOpacity={0.12} strokeWidth={10} />
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="#1EB8E6"
            strokeWidth={10}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 1.8, ease: EASE_OUT }}
            style={{ rotate: -90, originX: '50%', originY: '50%' }}
          />
        </svg>
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.9, ease: EASE_OUT }}
        >
          <Logo className="text-[150px] leading-none m:text-[56px]" />
        </motion.div>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6, ease: EASE_OUT }}
        className="mt-10 text-[22px] font-medium tracking-wide text-white/70 m:mt-6 m:text-sm"
      >
        {slide.caption}
      </motion.p>
    </section>
  );
}
