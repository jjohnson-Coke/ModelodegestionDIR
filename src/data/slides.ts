/**
 * Fuente única de contenido de la presentación.
 * Cualquier cambio de texto se hace aquí; los componentes solo leen estos datos.
 */

export type IconName =
  | 'inbox'
  | 'scale'
  | 'graduation'
  | 'mail'
  | 'whatsapp'
  | 'meeting'
  | 'lightbulb'
  | 'clipboard'
  | 'package'
  | 'shield'
  | 'gauge'
  | 'folder'
  | 'file'
  | 'form'
  | 'list'
  | 'calendar'
  | 'users'
  | 'report'
  | 'route'
  | 'wrench'
  | 'queue'
  | 'calendar-x'
  | 'clock'
  | 'refresh'
  | 'wallet'
  | 'handshake'
  | 'user'
  | 'pen'
  | 'workflow'
  | 'layers'
  | 'cpu'
  | 'target'
  | 'trending'
  | 'zap'
  | 'eye'
  | 'sparkles';

export type PillarId = 'madurez' | 'conciencia' | 'levantamiento' | 'control' | 'entrega';

export interface Pillar {
  id: PillarId;
  name: string;
  purpose: string;
  /** Verbo clave mostrado en el ciclo (slide 11). */
  verb: string;
  icon: IconName;
  /** Entregable de la etapa (se muestra debajo de cada pilar en la vista general). */
  deliverable: string;
}

/** Orden canónico de los pilares (se usa en todas las slides). */
export const pillars: readonly Pillar[] = [
  {
    id: 'madurez',
    name: 'Madurez',
    purpose: 'Asegurar que el avance es real y aceptado por el equipo.',
    verb: 'Medir',
    icon: 'gauge',
    deliverable: 'Respuestas del índice de madurez de CX',
  },
  {
    id: 'conciencia',
    name: 'Conciencia',
    purpose: 'Conocer nuestro proceso y lo que es la experiencia.',
    verb: 'Entender',
    icon: 'lightbulb',
    deliverable: 'Documentos de familiarización de experiencia',
  },
  {
    id: 'levantamiento',
    name: 'Levantamiento',
    purpose: 'Facilitar y homologar las solicitudes de journeys y experiencias.',
    verb: 'Solicitar',
    icon: 'clipboard',
    deliverable: 'Punto único de entrada',
  },
  {
    id: 'control',
    name: 'Control',
    purpose: 'Institucionalizar las responsabilidades y la mejora continua.',
    verb: 'Gobernar',
    icon: 'shield',
    deliverable: 'Reuniones bimestrales',
  },
  {
    id: 'entrega',
    name: 'Entrega',
    purpose: 'Asegurar la priorización e implementación de los journeys y experiencias.',
    verb: 'Priorizar e implementar',
    icon: 'package',
    deliverable: 'Fechas de priorización con TD',
  },
];

export function getPillar(id: PillarId): Pillar {
  const pillar = pillars.find((p) => p.id === id);
  if (!pillar) throw new Error(`Pilar desconocido: ${id}`);
  return pillar;
}

export const deckMeta = {
  title: 'Modelo de gestión de experiencia',
  footer: 'Modelo de gestión de experiencia · TEC360 · ®2026',
} as const;

/* ------------------------------------------------------------------ */
/* Tipos de slide                                                      */
/* ------------------------------------------------------------------ */

interface BaseSlide {
  id: string;
  /** Notas del presentador (tecla N). */
  notes: string;
  /** true para ocultar la slide sin borrar su contenido. */
  hidden?: boolean;
}

export interface CoverSlideData extends BaseSlide {
  kind: 'cover';
  title: string;
  subtitle: string;
  footer: string;
}

export type ProblemId = 'homologacion' | 'aprobador' | 'conocimiento';

export interface ProblemCard {
  id: ProblemId;
  icon: IconName;
  title: string;
  description: string;
}

export interface ProblemSlideData extends BaseSlide {
  kind: 'problem';
  kicker: string;
  title: string;
  cards: readonly ProblemCard[];
}

export interface StatementSegment {
  text: string;
  /** Verbo clave que se ilumina en cian. */
  highlight?: boolean;
}

export interface StatementSlideData extends BaseSlide {
  kind: 'statement';
  kicker: string;
  /** El enunciado, dividido en frases; cada frase se compone de segmentos. */
  phrases: readonly (readonly StatementSegment[])[];
  chips: readonly string[];
}

export type JourneyStatusTone = 'active' | 'queued' | 'unscheduled';

export interface JourneyStatusGroup {
  id: string;
  /** Nombres de los journeys en este estado (la cantidad sale de aquí). */
  journeys: readonly string[];
  label: string;
  tone: JourneyStatusTone;
  icon: IconName;
}

export interface JourneysSlideData extends BaseSlide {
  kind: 'journeys';
  kicker: string;
  /** El título se arma como: `${titleBefore} ${total} ${titleAfter}` (el número se anima). */
  titleBefore: string;
  total: number;
  titleAfter: string;
  groups: readonly JourneyStatusGroup[];
}

export interface ProcessStep {
  id: string;
  icon: IconName;
  title: string;
  /** Área responsable del paso. */
  owner: string;
  /** true si el paso lo lidera el equipo de Experiencia (se destaca en cian). */
  ledByExperience?: boolean;
  /** Área que acompaña el paso (se muestra debajo de la tarjeta). */
  support?: string;
}

export interface ProcessSlideData extends BaseSlide {
  kind: 'process';
  kicker: string;
  title: string;
  ownerLabel: string;
  steps: readonly ProcessStep[];
  legend: { experience: string; others: string; support: string };
  note: string;
}

export interface PillarsOverviewSlideData extends BaseSlide {
  kind: 'pillars-overview';
  kicker: string;
  title: string;
}

export interface Scope {
  id: string;
  label: string;
  /** Texto pequeño opcional debajo del alcance. */
  note?: string;
}

export type EnablerStatus = 'listo' | 'por-desarrollar';

export interface Enabler {
  id: string;
  label: string;
  /** Ids de los alcances (del mismo pilar) a los que sirve. */
  serves: readonly string[];
  status: EnablerStatus;
  /** Pilar con el que también se conecta (enlace pequeño). */
  linksTo?: PillarId;
}

export type PillarExtra =
  | { type: 'steps'; count: number; label: string }
  | { type: 'funnel'; output: string }
  | { type: 'gauge'; label: string };

export interface PillarDetailSlideData extends BaseSlide {
  kind: 'pillar-detail';
  pillarId: PillarId;
  kicker: string;
  scopes: readonly Scope[];
  enablers: readonly Enabler[];
  extra?: PillarExtra;
}

export interface MappingTarget {
  pillarId: PillarId;
  detail?: string;
}

export interface MappingRow {
  problemId: ProblemId;
  targets: readonly MappingTarget[];
}

export interface MappingSlideData extends BaseSlide {
  kind: 'mapping';
  kicker: string;
  title: string;
  rows: readonly MappingRow[];
  /** Pilar que no resuelve un problema directo, sino que mide el cambio. */
  measuringPillar: PillarId;
  note: string;
}

export interface CycleSlideData extends BaseSlide {
  kind: 'cycle';
  kicker: string;
  title: string;
  support: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  /** true mientras el testimonio real no se ha incorporado (se muestra como marcador). */
  pending?: boolean;
}

export interface TestimonialsSlideData extends BaseSlide {
  kind: 'testimonials';
  kicker: string;
  title: string;
  testimonials: readonly Testimonial[];
}

export interface FaqItem {
  id: string;
  icon: IconName;
  question: string;
  answer: string;
  /** Idea clave en una frase corta, destacada en la tarjeta. */
  highlight: string;
}

export interface FaqSlideData extends BaseSlide {
  kind: 'faq';
  kicker: string;
  title: string;
  items: readonly FaqItem[];
}

export interface MaturityCompetency {
  id: string;
  icon: IconName;
  name: string;
  /** Nombre original del XM Institute. */
  original: string;
  description: string;
}

export interface MaturityIndexSlideData extends BaseSlide {
  kind: 'maturity-index';
  kicker: string;
  title: string;
  lead: string;
  competenciesTitle: string;
  competencies: readonly MaturityCompetency[];
  stagesTitle: string;
  stages: readonly string[];
  usageTitle: string;
  usage: string;
  source: string;
}

export interface CadenceChip {
  label: string;
  detail: string;
}

export interface RoadmapSlideData extends BaseSlide {
  kind: 'roadmap';
  kicker: string;
  title: string;
  steps: readonly string[];
  cadence: { title: string; chips: readonly CadenceChip[] };
  repository: { title: string; label: string };
}

export interface TeamSlideData extends BaseSlide {
  kind: 'team';
  kicker: string;
  /** Se lee: `${lead}` + `${name} ${suffix}` (el sufijo va en cian). */
  lead: string;
  name: string;
  suffix: string;
}

export interface ClosingSlideData extends BaseSlide {
  kind: 'closing';
  caption: string;
}

export type SlideData =
  | CoverSlideData
  | ProblemSlideData
  | StatementSlideData
  | JourneysSlideData
  | ProcessSlideData
  | PillarsOverviewSlideData
  | PillarDetailSlideData
  | MappingSlideData
  | CycleSlideData
  | TestimonialsSlideData
  | MaturityIndexSlideData
  | FaqSlideData
  | RoadmapSlideData
  | TeamSlideData
  | ClosingSlideData;

/* ------------------------------------------------------------------ */
/* Contenido (texto definitivo)                                        */
/* ------------------------------------------------------------------ */

const problemCards: readonly ProblemCard[] = [
  {
    id: 'homologacion',
    icon: 'inbox',
    title: 'Solicitudes sin homologación',
    description:
      'Recibimos solicitudes para desarrollar journeys y experiencias a través de correo, WhatsApp y reuniones, todas sin una estructura.',
  },
  {
    id: 'aprobador',
    icon: 'scale',
    title: 'Aprobador juez y parte',
    description: 'El líder funcional es el solicitante y aprobador de qué experiencias se diseñan.',
  },
  {
    id: 'conocimiento',
    icon: 'graduation',
    title: 'Etapa de descubrimiento',
    description: 'Los equipos operativos aún están descubriendo todo lo que implica diseñar una experiencia.',
  },
];

export function getProblem(id: ProblemId): ProblemCard {
  const card = problemCards.find((c) => c.id === id);
  if (!card) throw new Error(`Problema desconocido: ${id}`);
  return card;
}

/** Todas las slides, incluidas las ocultas (`hidden: true`). */
export const allSlides: readonly SlideData[] = [
  {
    id: 'portada',
    kind: 'cover',
    title: 'Modelo de gestión de experiencia',
    subtitle: 'Experiencias VPAF',
    footer: 'TEC360 · ®2026',
    notes: 'Presentamos el Modelo de gestión de experiencia para las experiencias de la VPAF.',
  },
  {
    id: 'as-is',
    hidden: true,
    kind: 'problem',
    kicker: 'ESTE ES NUESTRO AS IS',
    title: 'Esto sucede al día de hoy',
    cards: problemCards,
    notes:
      'Hoy las solicitudes llegan por correo, WhatsApp y reuniones sin estructura, el líder funcional es solicitante y aprobador a la vez, y los equipos operativos aún están descubriendo todo lo que implica diseñar una experiencia.',
  },
  {
    id: 'objetivo',
    kind: 'statement',
    kicker: 'OBJETIVO · HACIA DÓNDE VAMOS',
    phrases: [
      [{ text: 'Institucionalizar', highlight: true }, { text: ' un modelo de gestión de experiencia' }],
      [{ text: 'que ' }, { text: 'estandarice', highlight: true }, { text: ' su diseño,' }],
      [{ text: 'homologue', highlight: true }, { text: ' los criterios de priorización' }],
      [
        { text: 'y ' },
        { text: 'establezca', highlight: true },
        { text: ' mecanismos de control, seguimiento y gobernanza' },
      ],
      [{ text: 'para todas las experiencias de la VPAF.' }],
    ],
    chips: ['Institucionalizar', 'Estandarizar', 'Homologar', 'Establecer control'],
    notes:
      'El objetivo: institucionalizar un modelo de gestión de experiencia que estandarice su diseño, homologue los criterios de priorización y establezca control, seguimiento y gobernanza para todas las experiencias de la VPAF.',
  },
  {
    id: 'journeys-hoy',
    hidden: true,
    kind: 'journeys',
    kicker: 'LO QUE HEMOS TRABAJADO AL DÍA DE HOY',
    titleBefore: 'Hemos desarrollado',
    total: 6,
    titleAfter: 'journeys',
    groups: [
      { id: 'desarrollo', journeys: ['B2C'], label: 'En priorización y desarrollo', tone: 'active', icon: 'wrench' },
      { id: 'fila', journeys: ['B2B', 'Freemium'], label: 'En la fila', tone: 'queued', icon: 'queue' },
      {
        id: 'sin-fecha',
        journeys: ['Centro de idiomas', 'Educación para el desarrollo', 'Membresías'],
        label: 'Sin una fecha clara para priorizarlos',
        tone: 'unscheduled',
        icon: 'calendar-x',
      },
    ],
    notes:
      'Al día de hoy hemos desarrollado 6 journeys: B2C está en priorización y desarrollo; B2B y Freemium están en la fila; Centro de idiomas, Educación para el desarrollo y Membresías no tienen una fecha clara para priorizarlos.',
  },
  {
    id: 'pilares',
    kind: 'pillars-overview',
    kicker: 'ESTO SÍ O SÍ DEBE SUCEDER',
    title: 'Pilares del modelo de gestión',
    notes:
      'Cinco pilares, en este orden: Madurez, Conciencia, Levantamiento, Control y Entrega.',
  },
  {
    id: 'ciclo',
    kind: 'cycle',
    kicker: 'CÓMO SE CONECTAN LOS PILARES',
    title: 'Un modelo de mejora continua',
    support: 'Lo que mide Madurez alimenta la siguiente vuelta del ciclo.',
    notes: 'Los pilares forman un ciclo: lo que mide Madurez alimenta la siguiente vuelta del ciclo.',
  },
  {
    id: 'indice-madurez',
    kind: 'maturity-index',
    kicker: 'ÍNDICE DE MADUREZ DE CX · QUALTRICS',
    title: '¿Qué es el índice de madurez de CX?',
    lead: 'Una autoevaluación del XM Institute de Qualtrics que mide qué tan preparada está la organización para gestionar la experiencia de sus clientes y en qué etapa de madurez se encuentra.',
    competenciesTitle: 'Evalúa 6 competencias',
    competencies: [
      {
        id: 'lead',
        icon: 'target',
        name: 'Liderar',
        original: 'Lead',
        description: 'Definir y sostener la visión, la hoja de ruta y la gobernanza de experiencia.',
      },
      {
        id: 'realize',
        icon: 'trending',
        name: 'Generar valor',
        original: 'Realize',
        description: 'Asegurar que la experiencia logre objetivos de negocio claros y medibles.',
      },
      {
        id: 'activate',
        icon: 'zap',
        name: 'Activar',
        original: 'Activate',
        description: 'Dar a los equipos las habilidades, el apoyo y la motivación para lograrlo.',
      },
      {
        id: 'enlighten',
        icon: 'eye',
        name: 'Dar visibilidad',
        original: 'Enlighten',
        description: 'Generar y distribuir información accionable en toda la organización.',
      },
      {
        id: 'respond',
        icon: 'refresh',
        name: 'Responder',
        original: 'Respond',
        description: 'Priorizar e implementar mejoras a partir de esa información.',
      },
      {
        id: 'disrupt',
        icon: 'sparkles',
        name: 'Innovar',
        original: 'Disrupt',
        description: 'Diseñar experiencias que diferencien a la organización.',
      },
    ],
    stagesTitle: 'Ubica a la organización en 5 etapas',
    stages: ['Investigar', 'Iniciar', 'Movilizar', 'Escalar', 'Integrar'],
    usageTitle: 'Cómo lo usamos',
    usage: 'Se responde en noviembre y mayo con un formulario en Qualtrics; el resultado alimenta la siguiente vuelta del modelo.',
    source: 'Fuente: modelo de madurez de CX del XM Institute (Qualtrics).',
    notes:
      'El índice de madurez de CX es una autoevaluación del XM Institute de Qualtrics: mide 6 competencias (liderar, generar valor, activar, dar visibilidad, responder e innovar) y ubica a la organización en 5 etapas, de Investigar a Integrar. Lo aplicamos en noviembre y mayo.',
  },
  {
    id: 'proceso-habilitacion',
    kind: 'process',
    kicker: 'PROCESO DE HABILITACIÓN DE UN JOURNEY',
    title: 'Del diseño a la habilitación tecnológica',
    ownerLabel: 'Responsable',
    steps: [
      { id: 'diseno', icon: 'pen', title: 'Diseño', owner: 'Experiencia', ledByExperience: true },
      { id: 'procesos', icon: 'workflow', title: 'Procesos', owner: 'Equipo de Procesos' },
      {
        id: 'epicas',
        icon: 'layers',
        title: 'Épicas, HU’s y priorización',
        owner: 'Gerentes de producto',
        support: 'Experiencia',
      },
      {
        id: 'habilitacion',
        icon: 'cpu',
        title: 'Habilitación tecnológica y factibilidad',
        owner: 'Transformación digital',
      },
    ],
    legend: {
      experience: 'Lidera Experiencia',
      others: 'Lidera otra área',
      support: 'Experiencia acompaña',
    },
    note: 'Experiencia diseña el journey y acompaña su priorización hasta que pasa a habilitación tecnológica.',
    notes:
      'Un journey se habilita en cuatro pasos: Diseño (Experiencia), Procesos (Equipo de Procesos), Épicas, HU’s y priorización (Gerentes de producto, con acompañamiento de Experiencia) y Habilitación tecnológica y factibilidad (Transformación digital).',
  },
  {
    id: 'siguientes-pasos',
    kind: 'roadmap',
    kicker: 'CÓMO LO HACEMOS REALIDAD',
    title: 'Siguientes pasos',
    steps: [
      'Desarrollo de encuesta índice de madurez de CX',
      'Presentación con equipo directivo',
      'Socialización con equipos operativos',
      'Envío de encuesta índice de madurez de CX',
    ],
    cadence: {
      title: 'Cadencia de gobernanza',
      chips: [
        { label: 'Reuniones de seguimiento', detail: 'bimestrales' },
        { label: 'Índice de madurez de CX', detail: 'noviembre y mayo' },
      ],
    },
    repository: { title: 'Repositorio del modelo', label: 'SharePoint · Experiencia de aprendedores' },
    notes:
      'Siguientes pasos: desarrollo de encuesta índice de madurez de CX, presentación con equipo directivo, socialización con equipos operativos y envío de encuesta índice de madurez de CX.',
  },
  {
    id: 'cierre',
    kind: 'closing',
    caption: 'Modelo de gestión de experiencia · ®2026',
    notes: 'Cierre: Modelo de gestión de experiencia de TEC360.',
  },
];

/** Slides visibles en la presentación, en orden. */
export const slides: readonly SlideData[] = allSlides.filter((slide) => !slide.hidden);
