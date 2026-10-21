import { motion } from 'framer-motion';
import { useMemo, useRef } from 'react';
import { getProblem, pillars, type MappingSlideData, type PillarId } from '../../data/slides';
import { useDeckContext } from '../../hooks/deckContext';
import { curvePath, useConnectors, type ConnectorPair } from '../../hooks/useConnectors';
import { Icon } from '../icons';
import { EASE_OUT } from '../motion';
import { SlideFrame } from '../ui';

const PROBLEM_START = 0.45;
const LINES_START = 1.25;
const ROW_STEP = 0.6;
const LINE_DURATION = 0.75;

function ColumnLabel({ children, delay }: { children: string; delay: number }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="mb-5 text-[18px] font-bold uppercase tracking-[0.2em] text-brand-ink-2 m:mb-2 m:text-xs"
    >
      {children}
    </motion.p>
  );
}

export function MappingSlide({ slide }: { slide: MappingSlideData }) {
  const { flow } = useDeckContext();
  const containerRef = useRef<HTMLDivElement>(null);

  const pairs = useMemo<ConnectorPair[]>(
    () =>
      slide.rows.flatMap((row) =>
        row.targets.map((t) => ({ key: `${row.problemId}->${t.pillarId}`, from: `problem-${row.problemId}`, to: `pillar-${t.pillarId}` })),
      ),
    [slide.rows],
  );
  const { connectors, size } = useConnectors(containerRef, pairs, !flow);

  // Momento en que cada pilar "se enciende": cuando termina de dibujarse su línea.
  const lightDelay = new Map<PillarId, number>();
  const details = new Map<PillarId, string>();
  slide.rows.forEach((row, r) => {
    row.targets.forEach((t) => {
      lightDelay.set(t.pillarId, LINES_START + r * ROW_STEP + LINE_DURATION - 0.1);
      if (t.detail) details.set(t.pillarId, t.detail);
    });
  });
  const measuringDelay = LINES_START + slide.rows.length * ROW_STEP + LINE_DURATION;
  lightDelay.set(slide.measuringPillar, measuringDelay);

  const note = (
    <motion.p
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (flow ? 1.2 : measuringDelay + 0.2), duration: 0.6, ease: EASE_OUT }}
      className="mt-8 flex items-center gap-4 self-end rounded-full border-2 border-dashed border-brand-cyan-dark bg-white px-7 py-3 text-[24px] font-semibold text-brand-ink m:mt-6 m:self-stretch m:rounded-card m:px-4 m:text-sm"
    >
      <Icon name="gauge" className="h-7 w-7 shrink-0 text-brand-cyan-dark m:h-5 m:w-5" />
      {slide.note}
    </motion.p>
  );

  if (flow) {
    return (
      <SlideFrame kicker={slide.kicker} title={slide.title}>
        <ul className="flex flex-col gap-4">
          {slide.rows.map((row, i) => {
            const problem = getProblem(row.problemId);
            return (
              <motion.li
                key={row.problemId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.2, duration: 0.5, ease: EASE_OUT }}
                className="rounded-card bg-white p-4 shadow-card"
              >
                <p className="flex items-center gap-3 text-base font-bold text-brand-ink-2">
                  <Icon name={problem.icon} className="h-5 w-5 shrink-0" />
                  {problem.title}
                </p>
                <ul className="mt-3 flex flex-col gap-2 border-l-2 border-brand-cyan pl-4">
                  {row.targets.map((t) => {
                    const pillar = pillars.find((p) => p.id === t.pillarId);
                    if (!pillar) return null;
                    return (
                      <li key={t.pillarId} className="flex items-center gap-2 text-base font-extrabold text-brand-ink">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-cyan">
                          <Icon name={pillar.icon} className="h-4 w-4 text-brand-ink" />
                        </span>
                        <span>
                          {pillar.name}
                          {t.detail ? <span className="block text-xs font-semibold text-brand-cyan-ink">{t.detail}</span> : null}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </motion.li>
            );
          })}
        </ul>
        {note}
      </SlideFrame>
    );
  }

  return (
    <SlideFrame kicker={slide.kicker} title={slide.title}>
      <div ref={containerRef} className="relative grid flex-1 grid-cols-[600px_1fr_560px] m:grid-cols-1 m:gap-6">
        {!flow && size.width > 0 ? (
          <svg
            className="pointer-events-none absolute inset-0 overflow-visible"
            width={size.width}
            height={size.height}
            viewBox={`0 0 ${size.width} ${size.height}`}
            aria-hidden
          >
            {connectors.map((c) => {
              const r = slide.rows.findIndex((row) => `problem-${row.problemId}` === c.from);
              const delay = LINES_START + r * ROW_STEP;
              return (
                <g key={c.key}>
                  <motion.path
                    d={curvePath(c)}
                    fill="none"
                    stroke="#1EB8E6"
                    strokeWidth={4}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay, duration: LINE_DURATION, ease: EASE_OUT }}
                  />
                  <motion.circle
                    cx={c.x2}
                    cy={c.y2}
                    r={8}
                    fill="#1EB8E6"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: delay + LINE_DURATION - 0.1, duration: 0.3 }}
                  />
                </g>
              );
            })}
          </svg>
        ) : null}

        <div className="flex flex-col">
          <ColumnLabel delay={PROBLEM_START - 0.1}>AS IS</ColumnLabel>
          <ul className="flex flex-1 flex-col justify-around gap-5 m:gap-3">
            {slide.rows.map((row, i) => {
              const problem = getProblem(row.problemId);
              return (
                <motion.li
                  key={row.problemId}
                  data-anchor={`problem-${row.problemId}`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: PROBLEM_START + i * 0.15, duration: 0.55, ease: EASE_OUT }}
                  className="flex items-center gap-5 rounded-card border-2 border-dashed border-brand-ink/20 bg-white/60 px-7 py-6 m:gap-3 m:px-4 m:py-3"
                >
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-ink/5 m:h-10 m:w-10 m:rounded-xl">
                    <Icon name={problem.icon} className="h-8 w-8 text-brand-ink-2 m:h-5 m:w-5" />
                  </span>
                  <span className="text-[30px] font-bold leading-tight text-brand-ink-2 m:text-base">{problem.title}</span>
                </motion.li>
              );
            })}
          </ul>
        </div>

        <div className="m:hidden" aria-hidden />

        <div className="flex flex-col">
          <ColumnLabel delay={LINES_START}>TO BE</ColumnLabel>
          <ul className="flex flex-col gap-4 m:gap-3">
            {pillars.map((pillar, i) => {
              const delay = lightDelay.get(pillar.id) ?? measuringDelay;
              const measuring = pillar.id === slide.measuringPillar;
              const detail = details.get(pillar.id);
              return (
                <motion.li
                  key={pillar.id}
                  data-anchor={`pillar-${pillar.id}`}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: LINES_START - 0.3 + i * 0.06, duration: 0.5, ease: EASE_OUT }}
                  className={`relative flex min-h-[92px] items-center gap-5 rounded-card border-2 bg-white px-6 py-3 m:min-h-0 m:gap-3 m:px-4 m:py-3 ${
                    measuring ? 'border-dashed border-brand-ink/25' : 'border-brand-ink/10'
                  }`}
                >
                  <motion.span
                    aria-hidden
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay, duration: 0.5 }}
                    className={`absolute -inset-[2px] rounded-card border-2 ${
                      measuring ? 'border-dashed border-brand-cyan-dark bg-white' : 'border-brand-cyan bg-brand-sky shadow-card'
                    }`}
                  />
                  <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-ink/5 m:h-10 m:w-10">
                    <Icon name={pillar.icon} className="h-8 w-8 text-brand-ink-2/60 m:h-5 m:w-5" />
                    <motion.span
                      aria-hidden
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay, duration: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center rounded-xl bg-brand-cyan"
                    >
                      <Icon name={pillar.icon} className="h-8 w-8 text-brand-ink m:h-5 m:w-5" />
                    </motion.span>
                  </span>
                  <span className="relative flex flex-col">
                    <span className="text-[30px] font-extrabold leading-tight text-brand-ink m:text-base">{pillar.name}</span>
                    {detail ? (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: delay + 0.15, duration: 0.5 }}
                        className="text-[20px] font-semibold text-brand-cyan-ink m:text-xs"
                      >
                        {detail}
                      </motion.span>
                    ) : null}
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>

      {note}
    </SlideFrame>
  );
}
