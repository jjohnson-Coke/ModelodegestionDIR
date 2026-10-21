import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: '#1EB8E6', // acentos, íconos y texto sobre fondos oscuros
          'cyan-light': '#5FD0E0', // arcos decorativos
          'cyan-dark': '#0A8DB8', // texto grande destacado sobre fondos claros
          'cyan-ink': '#066D8E', // texto pequeño cian sobre fondos claros (AA)
          sky: '#E3EEFA', // tarjetas
          paper: '#F2F2F2', // fondo de slides de contenido
          ink: '#111111', // texto principal
          'ink-2': '#4A4A4A', // texto secundario
          black: '#000000',
          ok: '#1B7F45',
          'ok-bg': '#E3F3EA',
          pending: '#4A4A4A',
          'pending-bg': '#E4E4E4',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { card: '20px' },
      boxShadow: {
        card: '0 10px 30px -12px rgba(17, 17, 17, 0.18), 0 2px 6px -2px rgba(17, 17, 17, 0.06)',
      },
    },
  },
  plugins: [
    // Variante `m:` para el modo de flujo (móvil y tablet vertical): `<html class="flow">`.
    plugin(({ addVariant }) => {
      addVariant('m', '.flow &');
    }),
  ],
} satisfies Config;
