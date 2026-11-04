import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, Plus } from 'lucide-react';
import { Fragment } from 'react';
import type { ProcessSlideData } from '../../data/slides';
import { Icon } from '../icons';
import { EASE_OUT } from '../motion';
import { SlideFrame } from '../ui';

const START = 0.5;
const STEP = 0.45;

export function ProcessSlide({ slide }: { slide: ProcessSlideData }) {
  const stepsDone = START + slide.steps.length * STEP;
  const supportDelay = stepsDone + 0.1;
  const footerDelay = supportDelay + 0.7;

  return (
    <SlideFrame kicker={slide.kicker} title={slide.title}>
      <div className="my-auto m:my-0">
        <ol className="flex items-stretch m:flex-col">
          {slide.steps.map((step, i) => {
            const delay = START + i * STEP;
            const lead = step.ledByExperience ?? false;
            return (
              <Fragment key={step.id}>
                {i > 0 ? (
                  <li aria-hidden className="flex w-[76px] shrink-0 items-center justify-center m:h-10 m:w-full">
                    <motion.span
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: delay - 0.15, duration: 0.4, ease: EASE_OUT }}
                      className="text-brand-cyan-dark"
                    >
                      <ArrowRight className="h-10 w-10 m:hidden" strokeWidth={2.25} />
                      <ArrowDown className="hidden h-6 w-6 m:block" strokeWidth={2.25} />
                    </motion.span>
                  </li>
                ) : null}

                <li className="relative min-w-0 flex-1">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay, duration: 0.55, ease: EASE_OUT }}
                    className={`flex h-[360px] flex-col justify-between gap-4 rounded-card border-2 p-8 shadow-card m:h-auto m:gap-4 m:p-5 ${
                      lead ? 'border-brand-cyan bg-brand-cyan' : 'border-brand-cyan/40 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-4 m:gap-3">
                        <span
                          className={`flex h-12 w-12 items-center justify-center rounded-full text-[22px] font-extrabold m:h-8 m:w-8 m:text-sm ${
                            lead ? 'bg-brand-ink text-white' : 'bg-brand-sky text-brand-cyan-ink'
                          }`}
                        >
                          {i + 1}
                        </span>
                        <Icon name={step.icon} className={`h-9 w-9 m:h-6 m:w-6 ${lead ? 'text-brand-ink' : 'text-brand-cyan-dark'}`} />
                      </div>
                      <h3 className="mt-6 text-[32px] font-extrabold leading-tight text-brand-ink m:mt-3 m:text-lg">{step.title}</h3>
                    </div>
                    <div>
                      <p
                        className={`text-[15px] font-bold uppercase tracking-[0.18em] m:text-[10px] ${
                          lead ? 'text-brand-ink/75' : 'text-brand-cyan-ink'
                        }`}
                      >
                        {slide.ownerLabel}
                      </p>
                      <p className="mt-1 text-[26px] font-semibold leading-snug text-brand-ink m:text-base">{step.owner}</p>
                    </div>
                  </motion.div>

                  {/* Área que acompaña el paso: línea punteada + píldora debajo de la tarjeta. */}
                  {step.support ? (
                    <div className="absolute inset-x-0 top-full flex flex-col items-center m:static">
                      <motion.span
                        aria-hidden
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: supportDelay, duration: 0.4, ease: EASE_OUT }}
                        className="h-14 origin-top border-l-[3px] border-dashed border-brand-cyan-dark/60 m:h-5"
                      />
                      <motion.span
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: supportDelay + 0.3, duration: 0.45, ease: EASE_OUT }}
                        className="flex items-center gap-2 rounded-full border-2 border-brand-cyan bg-brand-cyan/15 px-7 py-3 text-[24px] font-bold text-brand-ink shadow-card m:px-4 m:py-1.5 m:text-sm"
                      >
                        <Plus className="h-6 w-6 text-brand-cyan-dark m:h-4 m:w-4" strokeWidth={3} aria-hidden />
                        {step.support}
                      </motion.span>
                    </div>
                  ) : null}
                </li>
              </Fragment>
            );
          })}
        </ol>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: footerDelay, duration: 0.6, ease: EASE_OUT }}
          className="mt-[140px] flex items-center justify-between gap-10 m:mt-8 m:flex-col m:items-start m:gap-4"
        >
          <p className="flex max-w-[1000px] items-center gap-4 text-[26px] font-semibold leading-snug text-brand-ink m:gap-3 m:text-base">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-cyan m:h-9 m:w-9 m:rounded-xl">
              <Icon name="handshake" className="h-7 w-7 text-brand-ink m:h-5 m:w-5" />
            </span>
            {slide.note}
          </p>
          <ul className="flex shrink-0 flex-col gap-2 text-[18px] font-medium text-brand-ink-2 m:text-xs">
            <li className="flex items-center gap-3">
              <span className="h-5 w-5 rounded-md bg-brand-cyan m:h-3.5 m:w-3.5" aria-hidden />
              {slide.legend.experience}
            </li>
            <li className="flex items-center gap-3">
              <span className="h-5 w-5 rounded-md border-2 border-brand-cyan/40 bg-white m:h-3.5 m:w-3.5" aria-hidden />
              {slide.legend.others}
            </li>
            <li className="flex items-center gap-3">
              <span className="h-5 w-5 rounded-full border-2 border-brand-cyan bg-brand-cyan/15 m:h-3.5 m:w-3.5" aria-hidden />
              {slide.legend.support}
            </li>
          </ul>
        </motion.div>
      </div>
    </SlideFrame>
  );
}
