import { motion } from 'framer-motion';
import type { TeamSlideData } from '../../data/slides';
import { EASE_OUT } from '../motion';
import { FitBox, SlideFrame } from '../ui';

const CREST_W = 520;
const CREST_H = 620;
const SHIELD =
  'M260 24 L478 86 V300 C478 440 380 540 260 596 C140 540 42 440 42 300 V86 Z';
const SHIELD_INNER =
  'M260 54 L450 108 V300 C450 422 366 510 260 562 C154 510 70 422 70 300 V108 Z';

/** Estrella de 5 puntas centrada en (cx, cy). */
function starPath(cx: number, cy: number, r: number) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 === 0 ? r : r * 0.45;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    return `${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`;
  });
  return `M${pts.join('L')}Z`;
}

/** Pentágono regular centrado en (cx, cy), con una punta hacia arriba. */
function pentagon(cx: number, cy: number, r: number, rotation = 0) {
  const pts = Array.from({ length: 5 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2 + rotation;
    return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`;
  });
  return `M${pts.join('L')}Z`;
}

/** Balón: pentágono central, cinco pentágonos recortados en el borde y costuras. */
function SoccerBall({ r }: { r: number }) {
  const inner = r * 0.36;
  const spokes = Array.from({ length: 5 }, (_, i) => (Math.PI * 2 * i) / 5 - Math.PI / 2);
  return (
    <g>
      <defs>
        <clipPath id="ball-clip">
          <circle cx={0} cy={0} r={r} />
        </clipPath>
      </defs>
      <circle cx={0} cy={0} r={r} fill="#FFFFFF" />
      <g clipPath="url(#ball-clip)" fill="#111111" stroke="#111111" strokeWidth={4} strokeLinejoin="round">
        <path d={pentagon(0, 0, inner)} />
        {spokes.map((a, i) => {
          const px = Math.cos(a) * inner;
          const py = Math.sin(a) * inner;
          const ox = Math.cos(a) * r * 0.98;
          const oy = Math.sin(a) * r * 0.98;
          return (
            <g key={i}>
              <line x1={px} y1={py} x2={Math.cos(a) * r * 0.78} y2={Math.sin(a) * r * 0.78} fill="none" />
              <path d={pentagon(ox, oy, inner * 0.62, a + Math.PI)} />
            </g>
          );
        })}
      </g>
      <circle cx={0} cy={0} r={r} fill="none" stroke="#1EB8E6" strokeWidth={6} />
    </g>
  );
}

function Crest() {
  return (
    <svg width={CREST_W} height={CREST_H} viewBox={`0 0 ${CREST_W} ${CREST_H}`} role="img" aria-label="Escudo de Journeys FC">
      {/* Escudo: se dibuja el contorno y luego entra el relleno. */}
      <motion.path
        d={SHIELD}
        fill="#111111"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      />
      <motion.path
        d={SHIELD}
        fill="none"
        stroke="#1EB8E6"
        strokeWidth={12}
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 1.2, ease: EASE_OUT }}
      />
      <motion.path
        d={SHIELD_INNER}
        fill="none"
        stroke="#5FD0E0"
        strokeOpacity={0.5}
        strokeWidth={3}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.7, duration: 1.1, ease: EASE_OUT }}
      />

      {/* Tres estrellas. */}
      {[200, 260, 320].map((x, i) => (
        <motion.path
          key={x}
          d={starPath(x, i === 1 ? 112 : 122, i === 1 ? 20 : 15)}
          fill="#1EB8E6"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3 + i * 0.12, duration: 0.4, ease: EASE_OUT }}
        />
      ))}

      {/* Nombre del equipo en el escudo. */}
      <motion.text
        x={260}
        y={198}
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize={50}
        fontWeight={800}
        letterSpacing={4}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.5 }}
      >
        JOURNEYS
      </motion.text>

      {/* Balón: cae girando hasta el centro del escudo. */}
      <g transform="translate(260 330)">
        <motion.g
          initial={{ y: -260, rotate: -200, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          transition={{ delay: 1.4, duration: 1, ease: EASE_OUT }}
        >
          <SoccerBall r={78} />
        </motion.g>
      </g>

      {/* Franja inferior con "FC". */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1, duration: 0.5 }}>
        <rect x={190} y={432} width={140} height={64} rx={14} fill="#1EB8E6" />
        <text x={260} y={480} textAnchor="middle" fill="#111111" fontSize={44} fontWeight={800} letterSpacing={4}>
          FC
        </text>
      </motion.g>
    </svg>
  );
}

export function TeamSlide({ slide }: { slide: TeamSlideData }) {
  return (
    <SlideFrame kicker={slide.kicker} tone="dark">
      <div className="flex flex-1 items-center justify-between gap-16 m:flex-col-reverse m:items-start m:gap-8">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: EASE_OUT }}
            className="text-[48px] font-semibold text-white/85 m:text-xl"
          >
            {slide.lead}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7, ease: EASE_OUT }}
            className="mt-2 text-[150px] font-extrabold leading-[0.95] tracking-[-0.03em] text-white m:text-[56px]"
          >
            {slide.name} <span className="text-brand-cyan">{slide.suffix}</span>
          </motion.h2>
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.4, duration: 0.7, ease: EASE_OUT }}
            className="mt-10 block h-[6px] w-[160px] origin-left rounded-full bg-brand-cyan m:mt-5 m:w-20"
          />
        </div>
        <div className="w-[520px] shrink-0 m:mx-auto m:w-full m:max-w-[260px]">
          <FitBox width={CREST_W} height={CREST_H}>
            <Crest />
          </FitBox>
        </div>
      </div>
    </SlideFrame>
  );
}
