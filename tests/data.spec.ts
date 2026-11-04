import { expect, test } from '@playwright/test';
import { pillars, slides } from '../src/data/slides';

test('lógica del contenido', () => {
  expect(slides).toHaveLength(14);
  const order = pillars.map((p) => p.id);
  expect(order).toEqual(['madurez', 'conciencia', 'levantamiento', 'control', 'entrega']);

  // Slides 5–9 siguen el mismo orden de pilares.
  const detail = slides.filter((s) => s.kind === 'pillar-detail').map((s) => (s.kind === 'pillar-detail' ? s.pillarId : ''));
  expect(detail).toEqual(order);
  expect(slides.slice(5, 10).every((s) => s.kind === 'pillar-detail')).toBe(true);

  // Estado de journeys: los grupos suman el total.
  for (const s of slides) {
    if (s.kind !== 'journeys') continue;
    expect(s.groups.reduce((sum, g) => sum + g.journeys.length, 0)).toBe(s.total);
  }

  // Cada herramienta se conecta solo con alcances de su mismo pilar.
  for (const s of slides) {
    if (s.kind !== 'pillar-detail') continue;
    const scopeIds = new Set(s.scopes.map((x) => x.id));
    for (const e of s.enablers) {
      expect(e.serves.length).toBeGreaterThan(0);
      for (const id of e.serves) expect(scopeIds.has(id), `${e.id} → ${id}`).toBe(true);
    }
  }

  // Los textos visibles usan "bimestral" de forma consistente.
  const all = JSON.stringify(slides);
  expect(all).not.toMatch(/bimensual|cada dos meses/i);
  expect(all.match(/bimestrales/g)?.length).toBeGreaterThanOrEqual(2);

  // Sin cifras inventadas: solo "7" (pasos), "2026", "360" (marca TEC360) y el total de journeys (6).
  const numbers = (all.replace(/B2[BC]/g, '').match(/\d+/g) ?? []).filter((n) => !['6', '7', '2026', '360'].includes(n));
  expect(numbers).toEqual([]);

  // Cada slide tiene notas del presentador.
  for (const s of slides) expect(s.notes.length).toBeGreaterThan(10);
});
