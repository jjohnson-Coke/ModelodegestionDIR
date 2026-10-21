import { motion } from 'framer-motion';
import { coverImage } from './assets';
import type { SlideTheme } from './theme';

/** Fondos por tema; se cruzan con un fundido (solo opacidad) al cambiar de slide. */
export function Backgrounds({ theme }: { theme: SlideTheme }) {
  const layer = (name: SlideTheme) => ({
    initial: false as const,
    animate: { opacity: theme === name ? 1 : 0 },
    transition: { duration: 0.6 },
  });

  return (
    <div className="pointer-events-none fixed inset-0" aria-hidden>
      <motion.div {...layer('light')} className="absolute inset-0 bg-brand-paper" />
      <motion.div {...layer('dark')} className="absolute inset-0 bg-brand-ink" />
      <motion.div {...layer('black')} className="absolute inset-0 bg-brand-black" />
      <motion.div {...layer('cover')} className="absolute inset-0 bg-brand-black">
        {coverImage ? (
          <img src={coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_40%,rgba(30,184,230,0.35),transparent_55%),radial-gradient(ellipse_at_90%_90%,rgba(95,208,224,0.22),transparent_50%),linear-gradient(135deg,#000000_0%,#111111_60%,#0b2a36_100%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/0" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
      </motion.div>
    </div>
  );
}
