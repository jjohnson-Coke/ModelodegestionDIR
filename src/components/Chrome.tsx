import { motion } from 'framer-motion';
import type { SlideTheme } from './theme';
import { EASE_OUT } from './motion';

interface ChromeProps {
  index: number;
  total: number;
  theme: SlideTheme;
  onSelect: (index: number) => void;
}

/** Indicadores discretos: barra de progreso, puntos de navegación y contador. */
export function Chrome({ index, total, theme, onSelect }: ChromeProps) {
  const light = theme === 'light';
  return (
    <>
      <div className={`absolute inset-x-0 top-0 h-[6px] m:h-1 ${light ? 'bg-brand-ink/10' : 'bg-white/10'}`} aria-hidden>
        <motion.div
          className="h-full origin-left bg-brand-cyan"
          initial={false}
          animate={{ scaleX: (index + 1) / total }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        />
      </div>

      <nav
        data-no-nav
        aria-label="Navegación de diapositivas"
        className="absolute bottom-[34px] left-1/2 flex -translate-x-1/2 items-center gap-1 m:bottom-4 m:left-4 m:translate-x-0"
      >
        {Array.from({ length: total }, (_, i) => {
          const active = i === index;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Ir a la diapositiva ${i + 1}`}
              aria-current={active ? 'step' : undefined}
              className="group relative flex h-8 w-6 items-center justify-center m:h-7 m:w-[18px]"
            >
              <span
                className={`block h-[10px] w-[10px] rounded-full transition-opacity group-hover:opacity-100 m:h-2 m:w-2 ${
                  light ? 'bg-brand-ink' : 'bg-white'
                } ${active ? 'opacity-0' : 'opacity-30'}`}
              />
              {active ? (
                <motion.span
                  layoutId="active-dot"
                  className="absolute h-[14px] w-[14px] rounded-full bg-brand-cyan m:h-3 m:w-3"
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                />
              ) : null}
            </button>
          );
        })}
      </nav>

      <p
        data-testid="counter"
        aria-live="polite"
        className={`absolute bottom-[38px] right-[120px] text-[22px] font-semibold tabular-nums m:bottom-5 m:right-5 m:text-sm ${
          light ? 'text-brand-ink-2' : 'text-white/80'
        }`}
      >
        {index + 1} / {total}
      </p>
    </>
  );
}
