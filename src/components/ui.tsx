import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { deckMeta, type EnablerStatus } from '../data/slides';
import { useDeckContext } from '../hooks/deckContext';
import { logoImage } from './assets';
import { fadeUp, stagger } from './motion';

export function Kicker({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'dark' }) {
  return (
    <motion.p
      variants={fadeUp}
      className={`text-[22px] font-bold uppercase leading-snug tracking-[0.2em] m:text-xs m:tracking-[0.16em] ${
        tone === 'dark' ? 'text-brand-cyan' : 'text-brand-cyan-ink'
      }`}
    >
      {children}
    </motion.p>
  );
}

export function Title({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'dark' }) {
  return (
    <motion.h2
      variants={fadeUp}
      className={`mt-4 text-[68px] font-extrabold leading-[1.05] tracking-[-0.02em] m:mt-2 m:text-[30px] ${
        tone === 'dark' ? 'text-white' : 'text-brand-ink'
      }`}
    >
      {children}
    </motion.h2>
  );
}

interface SlideFrameProps {
  kicker: string;
  title?: string;
  tone?: 'light' | 'dark';
  /** Elemento opcional a la derecha del encabezado (p. ej. la mini barra de pilares). */
  aside?: ReactNode;
  /** Clases para limitar el ancho del encabezado (por defecto 1320 px). */
  headerClassName?: string;
  children: ReactNode;
}

/** Estructura común de las slides de contenido: encabezado, cuerpo y pie de página. */
export function SlideFrame({ kicker, title, tone = 'light', aside, headerClassName = 'max-w-[1320px]', children }: SlideFrameProps) {
  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={stagger(0.1)}
      className="relative flex h-full flex-col px-[120px] pb-[120px] pt-[84px] m:h-auto m:min-h-full m:px-5 m:pb-28 m:pt-12"
    >
      <header className="flex items-start justify-between gap-12 m:flex-col m:gap-4">
        <div className={headerClassName}>
          <Kicker tone={tone}>{kicker}</Kicker>
          {title ? <Title tone={tone}>{title}</Title> : null}
        </div>
        {aside}
      </header>
      <div className="relative mt-12 flex min-h-0 flex-1 flex-col m:mt-8">{children}</div>
      <Footer tone={tone} />
    </motion.section>
  );
}

export function Footer({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <motion.p
      variants={fadeUp}
      className={`absolute bottom-[40px] left-[120px] text-[17px] font-medium m:static m:mt-10 m:text-xs ${
        tone === 'dark' ? 'text-white/70' : 'text-brand-ink-2'
      }`}
    >
      {deckMeta.footer}
    </motion.p>
  );
}

export function Logo({ className = '', tone = 'dark' }: { className?: string; tone?: 'light' | 'dark' }) {
  if (logoImage) {
    return <img src={logoImage} alt="TEC360" className={className} />;
  }
  return (
    <span className={`font-extrabold tracking-[-0.02em] ${className}`} aria-label="TEC360" role="img">
      <span className={tone === 'dark' ? 'text-white' : 'text-brand-ink'}>TEC</span>
      <span className={tone === 'dark' ? 'text-brand-cyan' : 'text-brand-cyan-dark'}>360</span>
    </span>
  );
}

export function StatusBadge({ status }: { status: EnablerStatus }) {
  if (status === 'listo') {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-ok-bg px-3 py-1 text-[16px] font-semibold text-brand-ok m:text-xs">
        <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
        Listo
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-pending-bg px-3 py-1 text-[16px] font-semibold text-brand-pending m:text-xs">
      <span className="h-2 w-2 rounded-full bg-brand-pending/60" aria-hidden />
      Por desarrollar
    </span>
  );
}

/**
 * Escala un dibujo de tamaño fijo para que quepa en el ancho disponible.
 * En modo presentación el dibujo ya cabe y la escala es 1.
 */
export function FitBox({ width, height, children, className = '' }: { width: number; height: number; children: ReactNode; className?: string }) {
  const { flow } = useDeckContext();
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(flow ? Math.min(1, el.offsetWidth / width) : 1);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [flow, width]);

  return (
    <div ref={ref} className={`relative w-full ${className}`} style={{ height: height * scale, maxWidth: flow ? undefined : width }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width, height, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}
