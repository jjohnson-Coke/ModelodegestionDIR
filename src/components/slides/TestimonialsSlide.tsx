import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Testimonial, TestimonialsSlideData } from '../../data/slides';
import { Icon } from '../icons';
import { EASE_OUT } from '../motion';
import { SlideFrame } from '../ui';

/** Momento en que cada tarjeta empieza a "escribir" y cuánto dura antes de mostrar el testimonio. */
const TYPING_START = [0.7, 1.5];
const TYPING_DURATION = 1.9;

function TypingDots() {
  return (
    <span className="flex items-center gap-4 m:gap-2" role="status" aria-label="Escribiendo">
      <span className="flex items-center gap-2 m:gap-1.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-4 w-4 rounded-full bg-brand-cyan m:h-2.5 m:w-2.5"
            animate={{ y: [0, -10, 0], opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          />
        ))}
      </span>
      <span className="text-[20px] font-medium text-brand-ink-2 m:text-xs">escribiendo…</span>
    </span>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const reduce = useReducedMotion();
  const start = TYPING_START[index] ?? TYPING_START[0] ?? 0.7;
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const delay = reduce ? 0 : (start + TYPING_DURATION) * 1000;
    const id = window.setTimeout(() => setRevealed(true), delay);
    return () => window.clearTimeout(id);
  }, [reduce, start]);

  const pending = testimonial.pending ?? false;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: start - 0.3, duration: 0.55, ease: EASE_OUT }}
      className="flex flex-col"
    >
      {/* Burbuja de mensaje: primero el indicador de escritura, luego el testimonio. */}
      <div
        className={`relative flex min-h-[300px] items-center rounded-card rounded-bl-md border-2 px-12 py-10 shadow-card m:min-h-[150px] m:px-5 m:py-5 ${
          pending ? 'border-dashed border-brand-ink/25 bg-white/80' : 'border-transparent bg-white'
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {revealed ? (
            <motion.blockquote
              key="quote"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="flex w-full flex-col gap-5 m:gap-3"
            >
              <Quote className="h-12 w-12 text-brand-cyan m:h-7 m:w-7" strokeWidth={2} aria-hidden />
              <p
                className={`text-[34px] font-semibold leading-snug m:text-lg ${
                  pending ? 'italic text-brand-ink-2' : 'text-brand-ink'
                }`}
              >
                “{testimonial.quote}”
              </p>
            </motion.blockquote>
          ) : (
            <motion.div key="typing" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <TypingDots />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Autor, como en un chat. */}
      <div className="mt-5 flex items-center gap-4 pl-2 m:mt-3 m:gap-3">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-sky m:h-10 m:w-10">
          <Icon name="user" className="h-8 w-8 text-brand-cyan-dark m:h-5 m:w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[24px] font-bold text-brand-ink m:text-base">{testimonial.author}</p>
          <p className="text-[20px] text-brand-ink-2 m:text-sm">{testimonial.role}</p>
        </div>
        {pending ? (
          <span className="ml-auto shrink-0 rounded-full bg-brand-pending-bg px-3 py-1 text-[16px] font-semibold text-brand-pending m:text-xs">
            Por confirmar
          </span>
        ) : null}
      </div>
    </motion.article>
  );
}

export function TestimonialsSlide({ slide }: { slide: TestimonialsSlideData }) {
  return (
    <SlideFrame kicker={slide.kicker} title={slide.title}>
      <div className="my-auto grid grid-cols-2 gap-14 m:my-0 m:grid-cols-1 m:gap-8">
        {slide.testimonials.map((t, i) => (
          <TestimonialCard key={t.id} testimonial={t} index={i} />
        ))}
      </div>
    </SlideFrame>
  );
}
