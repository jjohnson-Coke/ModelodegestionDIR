import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const TOTAL = 14;
const LOCK_WAIT = 420; // > bloqueo de navegación (350 ms)
const REVEAL_WAIT = 5500; // tiempo para que terminen los revelados internos

// Falla si aparece cualquier error o warning en la consola del navegador.
let consoleProblems: string[] = [];
test.beforeEach(async ({ page }) => {
  consoleProblems = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') consoleProblems.push(`[${msg.type()}] ${msg.text()}`);
  });
  page.on('pageerror', (err) => consoleProblems.push(`[pageerror] ${err.message}`));
});
test.afterEach(() => {
  expect(consoleProblems, 'Mensajes de consola inesperados').toEqual([]);
});

const counter = (page: Page) => page.getByTestId('counter');

async function expectSlide(page: Page, n: number) {
  await expect(page.locator('html[data-deck-ready="true"]')).toHaveCount(1);
  await expect(counter(page)).toHaveText(`${n} / ${TOTAL}`);
  await expect(page).toHaveURL(new RegExp(`#/${n}$`));
}

async function press(page: Page, key: string) {
  await page.keyboard.press(key);
  await page.waitForTimeout(LOCK_WAIT);
}

test('recorre todas las slides con flechas y regresa', async ({ page }) => {
  await page.goto('./');
  await expectSlide(page, 1);

  await press(page, 'ArrowLeft');
  await expectSlide(page, 1);

  for (let n = 2; n <= TOTAL; n++) {
    await press(page, 'ArrowRight');
    await expectSlide(page, n);
  }

  await press(page, 'ArrowRight');
  await expectSlide(page, TOTAL);

  for (let n = TOTAL - 1; n >= 1; n--) {
    await press(page, 'ArrowLeft');
    await expectSlide(page, n);
  }
});

test('hash: #/7 abre la slide 7 y #/99 redirige a la 1', async ({ page }) => {
  await page.goto('./#/7');
  await expectSlide(page, 7);
  await expect(page.getByTestId('slide')).toHaveAttribute('data-slide-id', 'conciencia');

  await page.goto('about:blank');
  await page.goto('./#/99');
  await expectSlide(page, 1);

  await page.goto('about:blank');
  await page.goto('./#/abc');
  await expectSlide(page, 1);

  // Edición manual del hash con la página abierta.
  await page.evaluate(() => (window.location.hash = '#/4'));
  await expectSlide(page, 4);
  await page.evaluate(() => (window.location.hash = '#/0'));
  await expectSlide(page, 1);
});

test('resto de atajos, puntos, clics laterales y notas', async ({ page }) => {
  await page.goto('./');
  await expectSlide(page, 1);
  await press(page, 'End');
  await expectSlide(page, TOTAL);
  await press(page, 'Home');
  await expectSlide(page, 1);
  await press(page, ' ');
  await expectSlide(page, 2);
  await press(page, 'PageDown');
  await expectSlide(page, 3);
  await press(page, 'Enter');
  await expectSlide(page, 4);
  await press(page, 'ArrowDown');
  await expectSlide(page, 5);
  await press(page, 'Backspace');
  await expectSlide(page, 4);
  await press(page, 'PageUp');
  await expectSlide(page, 3);
  await press(page, 'ArrowUp');
  await expectSlide(page, 2);

  // Mantener la flecha presionada no salta slides de forma caótica (bloqueo de ~350 ms).
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(LOCK_WAIT);
  await expectSlide(page, 3);

  // Puntos de navegación.
  await page.getByRole('button', { name: 'Ir a la diapositiva 10' }).click();
  await page.waitForTimeout(LOCK_WAIT);
  await expectSlide(page, 10);

  // Clic en zonas laterales.
  const vp = page.viewportSize();
  if (!vp) throw new Error('Sin viewport');
  await page.mouse.click(vp.width * 0.9, vp.height * 0.5);
  await page.waitForTimeout(LOCK_WAIT);
  await expectSlide(page, 11);
  await page.mouse.click(vp.width * 0.1, vp.height * 0.5);
  await page.waitForTimeout(LOCK_WAIT);
  await expectSlide(page, 10);
  await page.mouse.click(vp.width * 0.5, vp.height * 0.5);
  await page.waitForTimeout(LOCK_WAIT);
  await expectSlide(page, 10);

  // Enlace "→ Levantamiento" en Conciencia.
  await page.goto('./#/7');
  await expectSlide(page, 7);
  await page.waitForTimeout(3500);
  await page.getByRole('button', { name: 'Levantamiento' }).click();
  await page.waitForTimeout(LOCK_WAIT);
  await expectSlide(page, 8);

  // Notas del presentador: ocultas por defecto, N las alterna.
  await expect(page.getByTestId('notes')).toHaveCount(0);
  await press(page, 'n');
  await expect(page.getByTestId('notes')).toBeVisible();
  await press(page, 'N');
  await expect(page.getByTestId('notes')).toHaveCount(0);

  // F alterna pantalla completa sin errores.
  await press(page, 'f');
  await press(page, 'Escape');
  await expectSlide(page, 8);
});

test('botón de pantalla completa', async ({ page }) => {
  await page.goto('./#/2');
  await expectSlide(page, 2);
  const button = page.getByTestId('fullscreen');
  await expect(button).toHaveAttribute('aria-label', 'Pantalla completa (F)');

  await button.click();
  await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement))).toBe(true);
  await expect(button).toHaveAttribute('aria-label', 'Salir de pantalla completa (F)');
  await expect(button).toHaveAttribute('aria-pressed', 'true');

  // Tras el clic, Espacio sigue avanzando slides (el botón no conserva el foco).
  await press(page, ' ');
  await expectSlide(page, 3);
  await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement))).toBe(true);

  await button.click();
  await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement))).toBe(false);
  await expect(button).toHaveAttribute('aria-label', 'Pantalla completa (F)');

  // La tecla F hace lo mismo.
  await press(page, 'f');
  await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement))).toBe(true);
  await press(page, 'f');
  await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement))).toBe(false);
  await expectSlide(page, 3);
});

test('el foco en un input ignora las teclas de navegación', async ({ page }) => {
  await page.goto('./#/3');
  await expectSlide(page, 3);
  await page.evaluate(() => {
    const input = document.createElement('input');
    input.id = 'probe';
    input.setAttribute('data-no-nav', '');
    input.style.position = 'fixed';
    input.style.top = '0';
    input.style.left = '0';
    document.body.appendChild(input);
    input.focus();
  });
  await press(page, 'ArrowRight');
  await press(page, 'ArrowLeft');
  await expectSlide(page, 3);
});

/** Detecta textos que se salen del lienzo visible o quedan recortados por su contenedor. */
async function findOverflow(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const problems: string[] = [];
    const slide = document.querySelector('[data-testid="slide"]');
    if (!slide) return ['sin slide'];
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const elements = Array.from(slide.querySelectorAll<HTMLElement>('h1, h2, h3, p, li, span'));
    for (const el of elements) {
      const text = el.textContent?.trim() ?? '';
      if (!text || el.closest('[aria-hidden="true"]') || el.classList.contains('sr-only')) continue;
      const style = getComputedStyle(el);
      if (style.visibility === 'hidden' || style.display === 'none') continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.left < -1 || r.right > vw + 1 || r.top < -1 || r.bottom > vh + 1) {
        problems.push(`fuera del lienzo: "${text.slice(0, 60)}"`);
      }
      if (el.scrollWidth > el.clientWidth + 2 && style.overflow !== 'visible') {
        problems.push(`recortado horizontal: "${text.slice(0, 60)}"`);
      }
    }
    return problems;
  });
}

for (const size of [
  { width: 1920, height: 1080 },
  { width: 1366, height: 768 },
]) {
  test(`capturas a ${size.width}×${size.height} sin desbordes`, async ({ page }) => {
    await page.setViewportSize(size);
    const dir = `screenshots/${size.width}x${size.height}`;
    mkdirSync(dir, { recursive: true });
    const report: string[] = [];
    for (let n = 1; n <= TOTAL; n++) {
      await page.goto('about:blank');
      await page.goto(`./#/${n}`);
      await expectSlide(page, n);
      await page.waitForTimeout(REVEAL_WAIT);
      await page.screenshot({ path: `${dir}/${String(n).padStart(2, '0')}.png` });
      for (const p of await findOverflow(page)) report.push(`slide ${n}: ${p}`);
    }
    expect(report).toEqual([]);
  });
}

test('móvil: tarjetas apiladas sin scroll horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const dir = 'screenshots/390x844';
  mkdirSync(dir, { recursive: true });
  for (let n = 1; n <= TOTAL; n++) {
    await page.goto('about:blank');
    await page.goto(`./#/${n}`);
    await expectSlide(page, n);
    await page.waitForTimeout(REVEAL_WAIT);
    const slide = page.getByTestId('slide');
    const { scrollWidth, clientWidth, scrollHeight } = await slide.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      scrollHeight: el.scrollHeight,
    }));
    expect(scrollWidth, `slide ${n} con scroll horizontal`).toBeLessThanOrEqual(clientWidth);
    // Captura del contenido completo de la slide (con scroll vertical).
    await page.setViewportSize({ width: 390, height: Math.max(844, scrollHeight) });
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${dir}/${String(n).padStart(2, '0')}.png` });
    await page.setViewportSize({ width: 390, height: 844 });
  }
});

test.describe('prefers-reduced-motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('la navegación sigue funcionando', async ({ page }) => {
    await page.goto('./');
    await expectSlide(page, 1);
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
    for (let n = 2; n <= TOTAL; n++) {
      await press(page, 'ArrowRight');
      await expectSlide(page, n);
    }
    await press(page, 'Home');
    await expectSlide(page, 1);
    mkdirSync('screenshots/reduced', { recursive: true });
    for (const n of [2, 6, 10, 11]) {
      await page.goto(`./#/${n}`);
      await page.waitForTimeout(REVEAL_WAIT);
      await page.screenshot({ path: `screenshots/reduced/${String(n).padStart(2, '0')}.png` });
    }
  });
});
