import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { getPillar, pillars, type PillarDetailSlideData, type PillarId } from '../../data/slides';
import { useDeckContext } from '../../hooks/deckContext';
import { curvePath, useConnectors, type ConnectorPair } from '../../hooks/useConnectors';
import { EASE_OUT } from '../motion';
import { SlideFrame, StatusBadge } from '../ui';
import { Funnel, Gauge, MethodSteps } from './pillarExtras';

const SCOPE_START = 0.45;
const SCOPE_STEP = 0.12;
const ENABLER_STEP = 0.5;

function PillarProgress({ current }: { current: PillarId }) {
  const index = pillars.findIndex((p) => p.id === current);
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: EASE_OUT }}
      className="shrink-0 pt-1 m:w-full"
      aria-label={`Pilar ${index + 1} de ${pillars.length}`}
    >
      <p className="text-right text-[20px] font-bold text-brand-ink m:text-left m:text-sm" aria-hidden>
        Pilar {index + 1} de {pillars.length}
      </p>
      <ol className="mt-3 flex gap-2 m:mt-2" aria-hidden>
        {pillars.map((p, i) => {
          const active = i === index;
          return (
            <li key={p.id} className="w-[124px] m:w-auto m:flex-1">
              <span className={`block h-[8px] rounded-full ${active ? 'bg-brand-cyan' : 'bg-brand-ink/15'}`} />
              <span
                className={`mt-2 block truncate text-[15px] m:hidden ${
                  active ? 'font-bold text-brand-ink' : 'font-medium text-brand-ink-2'
                }`}
              >
                {p.name}
              </span>
            </li>
          );
        })}
      </ol>
    </motion.div>
  );
}

function ColumnHeading({ title, description, delay }: { title: string; description: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: EASE_OUT }}
      className="mb-6 h-[84px] m:mb-3 m:h-auto"
    >
      <h3 className="text-[32px] font-extrabold text-brand-ink m:text-xl">{title}</h3>
      <p className="mt-1 text-[21px] text-brand-ink-2 m:text-sm">{description}</p>
    </motion.div>
  );
}

function NumberBadge({ n, tone = 'solid' }: { n: number; tone?: 'solid' | 'outline' }) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[18px] font-bold m:h-7 m:w-7 m:text-xs ${
        tone === 'solid' ? 'bg-brand-cyan text-brand-ink' : 'border-2 border-brand-cyan-dark text-brand-cyan-ink'
      }`}
    >
      {n}
    </span>
  );
}

export function PillarDetailSlide({ slide }: { slide: PillarDetailSlideData }) {
  const { flow, goToPillar } = useDeckContext();
  const pillar = getPillar(slide.pillarId);
  const containerRef = useRef<HTMLDivElement>(null);

  const pairs = useMemo<ConnectorPair[]>(
    () =>
      slide.enablers.flatMap((enabler) =>
        enabler.serves.map((scopeId) => ({
          key: `${scopeId}->${enabler.id}`,
          from: `scope-${scopeId}`,
          to: `enabler-${enabler.id}`,
        })),
      ),
    [slide.enablers],
  );
  const { connectors, size } = useConnectors(containerRef, pairs, !flow);

  const scopeNumber = (id: string) => slide.scopes.findIndex((s) => s.id === id) + 1;
  const enablerStart = SCOPE_START + slide.scopes.length * SCOPE_STEP + 0.45;
  const enablerDelay = (j: number) => enablerStart + j * ENABLER_STEP;
  const enablerIndex = (enablerId: string) => slide.enablers.findIndex((e) => e.id === enablerId);
  const extraDelay = enablerDelay(slide.enablers.length) + 0.2;
  const sideExtra = slide.extra && slide.extra.type !== 'steps' ? slide.extra : undefined;

  return (
    <SlideFrame kicker={slide.kicker} title={pillar.name} aside={<PillarProgress current={pillar.id} />}>
      <div className="flex flex-1 items-center gap-14 pb-6 m:flex-col m:items-stretch m:gap-8 m:pb-0">
        <div
          ref={containerRef}
          className={`relative grid flex-1 items-start m:grid-cols-1 m:gap-6 ${
            sideExtra ? 'grid-cols-[1fr_150px_1fr]' : 'grid-cols-[1fr_220px_1fr]'
          }`}
        >
          {!flow && size.width > 0 ? (
            <svg
              className="pointer-events-none absolute inset-0 overflow-visible"
              width={size.width}
              height={size.height}
              viewBox={`0 0 ${size.width} ${size.height}`}
              aria-hidden
            >
              {connectors.map((c) => {
                const delay = enablerDelay(enablerIndex(c.to.replace('enabler-', ''))) + 0.25;
                return (
                  <g key={c.key}>
                    <motion.path
                      d={curvePath(c)}
                      fill="none"
                      stroke="#1EB8E6"
                      strokeWidth={3}
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ delay, duration: 0.7, ease: EASE_OUT }}
                    />
                    <motion.circle
                      cx={c.x1}
                      cy={c.y1}
                      r={7}
                      fill="#1EB8E6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay, duration: 0.3 }}
                    />
                    <motion.circle
                      cx={c.x2}
                      cy={c.y2}
                      r={7}
                      fill="#1EB8E6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: delay + 0.6, duration: 0.3 }}
                    />
                  </g>
                );
              })}
            </svg>
          ) : null}

          <div>
            <ColumnHeading title="Alcances" description="Lo que el pilar debe lograr." delay={SCOPE_START - 0.1} />
            <ul className="flex flex-col gap-5 m:gap-3">
              {slide.scopes.map((scope, i) => (
                <motion.li
                  key={scope.id}
                  data-anchor={`scope-${scope.id}`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: SCOPE_START + i * SCOPE_STEP, duration: 0.55, ease: EASE_OUT }}
                  className="flex min-h-[96px] items-center gap-5 rounded-card bg-white px-7 py-5 shadow-card m:min-h-0 m:gap-3 m:px-4 m:py-3"
                >
                  <NumberBadge n={i + 1} />
                  <span className="text-[27px] font-semibold leading-snug text-brand-ink m:text-base">{scope.label}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="m:hidden" aria-hidden />

          <div>
            <ColumnHeading
              title="Habilitadores"
              description="Lo que necesitamos construir para lograrlo."
              delay={enablerStart - 0.15}
            />
            <ul className="flex flex-col gap-5 m:gap-3">
              {slide.enablers.map((enabler, j) => (
                <motion.li
                  key={enabler.id}
                  data-anchor={`enabler-${enabler.id}`}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: enablerDelay(j), duration: 0.55, ease: EASE_OUT }}
                  className="flex min-h-[96px] flex-col justify-center gap-3 rounded-card bg-brand-sky px-7 py-5 shadow-card m:min-h-0 m:gap-2 m:px-4 m:py-3"
                >
                  <span className="text-[27px] font-semibold leading-snug text-brand-ink m:text-base">{enabler.label}</span>
                  <span className="flex flex-wrap items-center gap-3 m:gap-2">
                    <StatusBadge status={enabler.status} />
                    <span className="flex items-center gap-1.5" aria-label={`Sirve a: ${enabler.serves.map(scopeNumber).join(', ')}`}>
                      {enabler.serves.map((id) => (
                        <NumberBadge key={id} n={scopeNumber(id)} tone="outline" />
                      ))}
                    </span>
                    {enabler.linksTo ? (
                      <button
                        type="button"
                        data-no-nav
                        onClick={() => enabler.linksTo && goToPillar(enabler.linksTo)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-brand-cyan-dark/40 bg-white px-3 py-1 text-[16px] font-semibold text-brand-cyan-ink transition-colors hover:bg-brand-cyan/10 m:text-xs"
                      >
                        <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                        {getPillar(enabler.linksTo).name}
                      </button>
                    ) : null}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {sideExtra ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: extraDelay - 0.2, duration: 0.5 }}
            className="flex w-[440px] shrink-0 items-start justify-center m:w-full"
          >
            {sideExtra.type === 'funnel' ? <Funnel output={sideExtra.output} delay={extraDelay} /> : null}
            {sideExtra.type === 'gauge' ? <Gauge label={sideExtra.label} delay={extraDelay} /> : null}
          </motion.div>
        ) : null}
      </div>

      {slide.extra?.type === 'steps' ? (
        <MethodSteps count={slide.extra.count} label={slide.extra.label} delay={extraDelay} />
      ) : null}
    </SlideFrame>
  );
}
