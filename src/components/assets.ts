/**
 * Imágenes opcionales extraídas del .pptx original (carpeta `ppt/media/`).
 * Coloca los archivos en `src/assets/` con estos nombres y se usarán automáticamente:
 *   - cover.(jpg|jpeg|png|webp)       → foto de portada
 *   - logo-tec360.(svg|png|webp)      → logo TEC360
 * Si no existen, la portada usa un fondo de respaldo y el logo se escribe como texto.
 */
const coverModules = import.meta.glob<string>('../assets/cover.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});
const logoModules = import.meta.glob<string>('../assets/logo-tec360.{svg,png,webp}', {
  eager: true,
  import: 'default',
});

export const coverImage: string | undefined = Object.values(coverModules)[0];
export const logoImage: string | undefined = Object.values(logoModules)[0];
