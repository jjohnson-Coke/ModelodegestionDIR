# Modelo de gestión de experiencia · TEC360

Presentación web (SPA) del Modelo de gestión de experiencia del equipo de Experiencia de la VPAF.
Construida con Vite, React 18, TypeScript (en modo estricto), Framer Motion, Tailwind CSS y lucide-react.

## Uso

```bash
npm install
npm run dev        # servidor de desarrollo
npm run build      # build estático en dist/ (rutas relativas, funciona en cualquier hosting)
npm run preview    # sirve el build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run test:e2e   # pruebas Playwright (compila y prueba el build de producción)
```

## Atajos

| Acción | Teclas / gesto |
| --- | --- |
| Siguiente | → ↓ Espacio PageDown Enter · deslizar a la izquierda · clic en el tercio derecho |
| Anterior | ← ↑ PageUp Backspace · deslizar a la derecha · clic en el tercio izquierdo |
| Primera / última | Home / End |
| Pantalla completa | F (Esc para salir) |
| Notas del presentador | N |
| Ir a una slide | puntos inferiores o URL `#/n` |

## Editar contenido

Todo el texto vive en `src/data/slides.ts`. Cada tipo de slide es un componente en `src/components/slides/`.

## Imágenes del deck original

El `.pptx` no estaba disponible al construir la presentación. Para usar la foto de portada y el logo,
extrae `ppt/media/` del `.pptx` (`unzip deck.pptx 'ppt/media/*' -d media`) y copia los archivos a:

- `src/assets/cover.jpg` (o `.png`/`.webp`): foto de portada
- `src/assets/logo-tec360.svg` (o `.png`/`.webp`): logo

Se detectan en el build automáticamente. Mientras no existan, la portada usa un fondo oscuro de respaldo
y el logo se escribe como texto ("TEC" en blanco, "360" en cian).
