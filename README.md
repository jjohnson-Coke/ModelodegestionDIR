# Modelo de gestión de experiencia · TEC360 · Versión DIRECTIVOS

Presentación web (SPA) del Modelo de gestión de experiencia del equipo de Experiencia de la VPAF,
versión para **directivos**. Parte de una copia de `jjohnson-Coke/ModelodeExperiencia`; los cambios
de esta versión se hacen solo en este repositorio.
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

## Deploy en Cloudflare

El proyecto `modelodegestiondir` está creado como **Worker** con conexión a GitHub (Workers Builds):

| Campo | Valor |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

`wrangler.jsonc` le indica a Wrangler que publique la carpeta `dist/` como sitio estático. Cada `push` a `main`
compila y publica solo.

### Alternativa: Cloudflare Pages

1. En Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** y elige `jjohnson-Coke/ModelodegestionDIR`.
2. Configuración del build:

   | Campo | Valor |
   | --- | --- |
   | Production branch | `main` |
   | Framework preset | `Vite` (o `None`) |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | *(vacío)* |
   | Variable de entorno | `NODE_VERSION` = `20` |

3. **Save and Deploy.** Cada `push` a `main` publica una versión nueva.

Notas:
- La versión de Node también queda fijada en `.node-version` (20).
- `public/_headers` define la caché: los archivos de `/assets` (con hash) se guardan un año y la página
  principal siempre se revalida, así cada deploy se ve de inmediato.
- No hace falta `_redirects`: la navegación usa `#/n`, por lo que `https://<proyecto>.pages.dev/#/5` abre la slide 5.
- `npm run build` también revisa los tipos; si un cambio rompe TypeScript, el deploy falla en lugar de publicar algo roto.

## Atajos

| Acción | Teclas / gesto |
| --- | --- |
| Siguiente | → ↓ Espacio PageDown Enter · deslizar a la izquierda · clic en el tercio derecho |
| Anterior | ← ↑ PageUp Backspace · deslizar a la derecha · clic en el tercio izquierdo |
| Primera / última | Home / End |
| Pantalla completa | F o el botón junto al contador (Esc para salir) |
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
