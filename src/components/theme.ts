import type { SlideData } from '../data/slides';

export type SlideTheme = 'cover' | 'light' | 'dark' | 'black';

export function themeOf(slide: SlideData): SlideTheme {
  switch (slide.kind) {
    case 'cover':
      return 'cover';
    case 'statement':
      return 'dark';
    case 'closing':
      return 'black';
    default:
      return 'light';
  }
}
