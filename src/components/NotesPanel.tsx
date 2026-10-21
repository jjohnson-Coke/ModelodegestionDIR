import { AnimatePresence, motion } from 'framer-motion';
import { EASE_OUT } from './motion';

export function NotesPanel({ open, notes, index, total }: { open: boolean; notes: string; index: number; total: number }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          key="notes"
          data-no-nav
          data-testid="notes"
          role="note"
          aria-label="Notas del presentador"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-4xl rounded-2xl border border-white/10 bg-brand-ink/95 px-6 py-4 text-white shadow-2xl"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-cyan">
            Notas del presentador · {index + 1} / {total}
          </p>
          <p className="mt-2 text-base leading-relaxed text-white/90 sm:text-lg">{notes}</p>
          <p className="mt-2 text-xs text-white/60">Presiona N para ocultar.</p>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
