import { createContext, useContext } from 'react';
import type { PillarId } from '../data/slides';

export interface DeckContextValue {
  flow: boolean;
  /** Navega a la slide de detalle de un pilar. */
  goToPillar: (id: PillarId) => void;
}

export const DeckContext = createContext<DeckContextValue>({
  flow: false,
  goToPillar: () => undefined,
});

export function useDeckContext(): DeckContextValue {
  return useContext(DeckContext);
}
