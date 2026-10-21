import { AnimatePresence, MotionConfig, motion, useReducedMotion, type Variants } from 'framer-motion';
import { useCallback, useMemo, useRef, useState, type MouseEvent, type TouchEvent } from 'react';
import { Backgrounds } from './components/Backgrounds';
import { Chrome } from './components/Chrome';
import { EASE_OUT, SLIDE_DURATION } from './components/motion';
import { NotesPanel } from './components/NotesPanel';
import { SlideRenderer } from './components/SlideRenderer';
import { themeOf } from './components/theme';
import { ThreadArc } from './components/ThreadArc';
import { slides, type PillarId } from './data/slides';
import { DeckContext, type DeckContextValue } from './hooks/deckContext';
import { useDeck, useDeckKeyboard } from './hooks/useDeck';
import { STAGE_HEIGHT, STAGE_WIDTH, useViewport } from './hooks/useViewport';

const SWIPE_MIN = 50;

function slideVariants(reduce: boolean): Variants {
  if (reduce) {
    return {
      enter: { opacity: 0 },
      center: { opacity: 1, transition: { duration: 0.2 } },
      exit: { opacity: 0, transition: { duration: 0.2 } },
    };
  }
  return {
    enter: (direction: number) => ({ x: direction * 160, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: SLIDE_DURATION, ease: EASE_OUT } },
    exit: (direction: number) => ({ x: direction * -160, opacity: 0, transition: { duration: SLIDE_DURATION, ease: EASE_OUT } }),
  };
}

function toggleFullscreen() {
  if (document.fullscreenElement) {
    void document.exitFullscreen().catch(() => undefined);
  } else if (document.fullscreenEnabled) {
    void document.documentElement.requestFullscreen().catch(() => undefined);
  }
}

function exitFullscreen() {
  if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
}

export default function App() {
  const deck = useDeck(slides.length);
  const { flow, scale } = useViewport();
  const reduce = useReducedMotion() ?? false;
  const [notesOpen, setNotesOpen] = useState(false);
  const toggleNotes = useCallback(() => setNotesOpen((open) => !open), []);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useDeckKeyboard({ deck, toggleFullscreen, exitFullscreen, toggleNotes });

  const slide = slides[deck.index] ?? slides[0];
  if (!slide) throw new Error('La presentación no tiene slides');
  const theme = themeOf(slide);

  const { goTo, next, prev } = deck;
  const context = useMemo<DeckContextValue>(
    () => ({
      flow,
      goToPillar: (id: PillarId) => {
        const target = slides.findIndex((s) => s.kind === 'pillar-detail' && s.pillarId === id);
        if (target >= 0) goTo(target);
      },
    }),
    [flow, goTo],
  );

  // Clic en zonas laterales: tercio izquierdo = atrás, tercio derecho = adelante.
  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('button, a, input, textarea, select, [data-no-nav]')) return;
    const x = event.clientX / window.innerWidth;
    if (x < 1 / 3) prev();
    else if (x > 2 / 3) next();
  };

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const t = event.touches[0];
    touchStart.current = t ? { x: t.clientX, y: t.clientY } : null;
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    const t = event.changedTouches[0];
    touchStart.current = null;
    if (!start || !t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    event.preventDefault(); // evita el clic sintético posterior al gesto
    if (dx < 0) next();
    else prev();
  };

  const stageStyle = flow
    ? undefined
    : {
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT,
        transform: `translate(-50%, -50%) scale(${scale})`,
      };

  return (
    <MotionConfig reducedMotion="user">
      <DeckContext.Provider value={context}>
        <main
          className="deck-stage fixed inset-0 overflow-hidden"
          onClick={onClick}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          aria-roledescription="presentación"
          aria-label="Modelo de gestión de experiencia"
        >
          <Backgrounds theme={theme} />

          <div className={flow ? 'absolute inset-0' : 'absolute left-1/2 top-1/2 origin-center'} style={stageStyle}>
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
              <div
                className="absolute left-0 top-0 origin-top-left"
                style={
                  flow
                    ? { width: STAGE_WIDTH, height: STAGE_HEIGHT, transform: `scale(${window.innerWidth / STAGE_WIDTH})` }
                    : { width: STAGE_WIDTH, height: STAGE_HEIGHT }
                }
              >
                <ThreadArc index={deck.index} theme={theme} />
              </div>
            </div>

            <AnimatePresence initial={false} custom={deck.direction}>
              <motion.div
                key={slide.id}
                custom={deck.direction}
                variants={slideVariants(reduce)}
                initial="enter"
                animate="center"
                exit="exit"
                className={`absolute inset-0 ${flow ? 'scrollbar-none overflow-y-auto overflow-x-hidden' : 'overflow-hidden'}`}
                data-testid="slide"
                data-slide-id={slide.id}
                role="group"
                aria-roledescription="diapositiva"
                aria-label={`${deck.index + 1} de ${deck.total}`}
              >
                <SlideRenderer slide={slide} />
              </motion.div>
            </AnimatePresence>

            {flow ? (
              <div
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t ${
                  theme === 'light' ? 'from-brand-paper' : 'from-black'
                } to-transparent`}
                aria-hidden
              />
            ) : null}
            <Chrome index={deck.index} total={deck.total} theme={theme} onSelect={goTo} />
          </div>

          <NotesPanel open={notesOpen} notes={slide.notes} index={deck.index} total={deck.total} />
        </main>
      </DeckContext.Provider>
    </MotionConfig>
  );
}
