import { motion } from 'framer-motion';
import { Maximize, Minimize } from 'lucide-react';
import type { MouseEvent } from 'react';
import type { SlideTheme } from './theme';
import { EASE_OUT } from './motion';

interface ChromeProps {
  index: number;
  total: number;
  theme: SlideTheme;
  onSelect: (index: number) => void;
  /** Botón de pantalla completa; se omite si el navegador no la permite. */
  fullscreen?: { active: boolean; toggle: () => void };
}

/** Quita el foco tras un clic para que Espacio/Enter sigan avanzando slides. */
function blurAfter(action: () => void) {
  return (event: MouseEvent<HTMLButtonElement>) => {
    action();
    event.currentTarget.blur();
  };
}

/** Indicadores discretos: barra de progreso, puntos de navegación y contador. */
export function Chrome({ index, total, theme, onSelect, fullscreen }: ChromeProps) {
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
        className="absolute bottom-[34px] left-1/2 flex -translate-x-1/2 items-center gap-1 m:bottom-4 m:left-3 m:translate-x-0 m:gap-0"
      >
        {Array.from({ length: total }, (_, i) => {
          const active = i === index;
          return (
            <button
              key={i}
              type="button"
              onClick={blurAfter(() => onSelect(i))}
              aria-label={`Ir a la diapositiva ${i + 1}`}
              aria-current={active ? 'step' : undefined}
              className="group relative flex h-8 w-6 items-center justify-center m:h-7 m:w-3.5"
            >
              <span
                className={`block h-[10px] w-[10px] rounded-full transition-opacity group-hover:opacity-100 m:h-1.5 m:w-1.5 ${
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

      <div className="absolute bottom-[30px] right-[120px] flex items-center gap-5 m:bottom-3 m:right-4 m:gap-2">
        <p
          data-testid="counter"
          aria-live="polite"
          className={`text-[22px] font-semibold tabular-nums m:text-sm ${
            light ? 'text-brand-ink-2' : 'text-white/80'
          }`}
        >
          {index + 1} / {total}
        </p>
        {fullscreen ? (
          <button
            type="button"
            data-testid="fullscreen"
            onClick={blurAfter(fullscreen.toggle)}
            aria-label={fullscreen.active ? 'Salir de pantalla completa (F)' : 'Pantalla completa (F)'}
            title={fullscreen.active ? 'Salir de pantalla completa (F)' : 'Pantalla completa (F)'}
            aria-pressed={fullscreen.active}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors m:h-9 m:w-9 ${
              light ? 'text-brand-ink-2 hover:bg-brand-ink/10' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            {fullscreen.active ? (
              <Minimize className="h-6 w-6 m:h-5 m:w-5" strokeWidth={2} aria-hidden />
            ) : (
              <Maximize className="h-6 w-6 m:h-5 m:w-5" strokeWidth={2} aria-hidden />
            )}
          </button>
        ) : null}
      </div>
    </>
  );
}
