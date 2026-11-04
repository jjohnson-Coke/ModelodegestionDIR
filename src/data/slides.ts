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
  | 'cpu';

export type PillarId = 'madurez' | 'conciencia' | 'levantamiento' | 'control' | 'entrega';

export interface Pillar {
  id: PillarId;
  name: string;
  purpose: string;
  /** Verbo clave mostrado en el ciclo (slide 11). */
  verb: string;
  icon: IconName;
}

/** Orden canónico de los pilares (se usa en todas las slides). */
export const pillars: readonly Pillar[] = [
  {
    id: 'madurez',
    name: 'Madurez',
    purpose: 'Asegurar que el avance es real y aceptado por el equipo.',
    verb: 'Medir',
    icon: 'gauge',
  },
  {
    id: 'conciencia',
    name: 'Conciencia',
    purpose: 'Conocer nuestro proceso y lo que es la experiencia.',
    verb: 'Entender',
    icon: 'lightbulb',
  },
  {
    id: 'levantamiento',
    name: 'Levantamiento',
    purpose: 'Facilitar y homologar las solicitudes de journeys y experiencias.',
    verb: 'Solicitar',
    icon: 'clipboard',
  },
  {
    id: 'control',
    name: 'Control',
    purpose: 'Institucionalizar las responsabilidades y la mejora continua.',
    verb: 'Gobernar',
    icon: 'shield',
  },
  {
    id: 'entrega',
    name: 'Entrega',
    purpose: 'Asegurar la priorización e implementación de los journeys y experiencias.',
    verb: 'Priorizar e implementar',
    icon: 'package',
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
  | FaqSlideData
  | RoadmapSlideData
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

export const slides: readonly SlideData[] = [
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
    id: 'pilares',
    kind: 'pillars-overview',
    kicker: 'ESTO SÍ O SÍ DEBE SUCEDER',
    title: 'Pilares del modelo de gestión',
    notes:
      'Cinco pilares, en este orden: Madurez, Conciencia, Levantamiento, Control y Entrega.',
  },
  {
    id: 'madurez',
    kind: 'pillar-detail',
    pillarId: 'madurez',
    kicker: 'ASEGURAR QUE EL AVANCE ES REAL Y ACEPTADO POR EL EQUIPO',
    scopes: [
      { id: 'respuesta', label: 'Respuesta del índice de madurez de CX' },
      { id: 'analisis', label: 'Análisis del nivel de madurez' },
      { id: 'recopilacion', label: 'Recopilación en noviembre y mayo' },
    ],
    enablers: [
      {
        id: 'qualtrics',
        label: 'Formulario en Qualtrics',
        serves: ['respuesta', 'recopilacion'],
        status: 'por-desarrollar',
      },
    ],
    extra: { type: 'gauge', label: 'Índice de madurez de CX · se mide dos veces al año' },
    notes: 'Madurez: el índice de madurez de CX se recopila en noviembre y mayo con un formulario en Qualtrics.',
  },
  {
    id: 'conciencia',
    kind: 'pillar-detail',
    pillarId: 'conciencia',
    kicker: 'CONOCE NUESTRO PROCESO Y LO QUE ES LA EXPERIENCIA',
    scopes: [
      { id: 'metodologia', label: 'Metodología de experiencia (7 pasos)' },
      { id: 'minimos', label: 'Mínimos a cubrir', note: '(Presupuesto, tiempo, aprobador, etc.)' },
      { id: 'entregables', label: 'Entregables otorgados', note: '(Journey infinito, lineal, experiencia diseñada, etc.)' },
    ],
    enablers: [
      { id: 'doc-metodologia', label: 'Documento de metodología', serves: ['metodologia'], status: 'listo' },
      {
        id: 'lista-entregables',
        label: 'Lista de entregables otorgados',
        serves: ['minimos', 'entregables'],
        status: 'por-desarrollar',
      },
      {
        id: 'embeber-documentos',
        label: 'Embeber documentos en formulario de levantamiento',
        serves: ['metodologia'],
        status: 'por-desarrollar',
        linksTo: 'levantamiento',
      },
    ],
    extra: { type: 'steps', count: 7, label: 'Metodología de experiencia · 7 pasos' },
    notes:
      'Conciencia: conocer nuestro proceso y la metodología de experiencia de 7 pasos. El documento de metodología ya está listo.',
  },
  {
    id: 'levantamiento',
    kind: 'pillar-detail',
    pillarId: 'levantamiento',
    kicker: 'FACILITAR Y HOMOLOGAR LAS SOLICITUDES DE JOURNEYS Y EXPERIENCIAS',
    scopes: [
      { id: 'sistema', label: 'Sistema de levantamiento de solicitudes independientes y estratégicas' },
      { id: 'criterios', label: 'Homologación de criterios de aceptación' },
      { id: 'razones', label: 'Conocimiento de razones de aceptación o rechazo' },
    ],
    enablers: [
      {
        id: 'typeform',
        label: 'Formulario en Typeform para levantamiento de solicitudes',
        serves: ['sistema', 'criterios', 'razones'],
        status: 'por-desarrollar',
      },
    ],
    extra: { type: 'funnel', output: 'Solicitud' },
    notes:
      'Levantamiento: correo, WhatsApp y reuniones se convierten en una sola solicitud homologada mediante un formulario en Typeform.',
  },
  {
    id: 'control',
    kind: 'pillar-detail',
    pillarId: 'control',
    kicker: 'INSTITUCIONALIZAR LAS RESPONSABILIDADES Y LA MEJORA CONTINUA',
    scopes: [
      { id: 'roles', label: 'Roles y funciones definidos' },
      { id: 'reuniones', label: 'Reuniones de seguimiento bimestrales' },
      { id: 'benchmark', label: 'Benchmark para actualización de journeys y experiencias' },
    ],
    enablers: [
      { id: 'matriz', label: 'Matriz de roles y funciones', serves: ['roles'], status: 'por-desarrollar' },
      { id: 'calendario', label: 'Calendario de reuniones', serves: ['reuniones'], status: 'por-desarrollar' },
    ],
    notes:
      'Control: roles y funciones definidos, reuniones de seguimiento bimestrales y benchmark para actualización de journeys y experiencias.',
  },
  {
    id: 'entrega',
    kind: 'pillar-detail',
    pillarId: 'entrega',
    kicker: 'ASEGURAR LA PRIORIZACIÓN E IMPLEMENTACIÓN DE LOS JOURNEYS Y EXPERIENCIAS',
    scopes: [
      { id: 'reporte-td', label: 'Reporte a TD para priorización' },
      { id: 'reporte-lideres', label: 'Reporte a líderes de journey' },
      { id: 'reporte-gerentes', label: 'Reporte a gerentes de producto' },
    ],
    enablers: [
      {
        id: 'calendarizacion',
        label: 'Calendarización de entregas a TD',
        serves: ['reporte-td'],
        status: 'por-desarrollar',
      },
    ],
    notes:
      'Entrega: reporte a TD para priorización, reporte a líderes de journey y reporte a gerentes de producto, con la calendarización de entregas a TD.',
  },
  {
    id: 'mapeo',
    kind: 'mapping',
    kicker: 'DEL AS IS AL TO BE',
    title: 'Cada problema tiene un pilar que lo resuelve',
    rows: [
      { problemId: 'homologacion', targets: [{ pillarId: 'levantamiento' }] },
      {
        problemId: 'aprobador',
        targets: [
          { pillarId: 'entrega', detail: 'priorización con TD' },
          { pillarId: 'control', detail: 'matriz de roles y funciones' },
        ],
      },
      { problemId: 'conocimiento', targets: [{ pillarId: 'conciencia' }] },
    ],
    measuringPillar: 'madurez',
    note: 'Madurez mide que el cambio sea real y aceptado por el equipo.',
    notes:
      'Cada problema del AS IS tiene un pilar que lo resuelve; Madurez mide que el cambio sea real y aceptado por el equipo.',
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
    id: 'testimonios',
    kind: 'testimonials',
    kicker: 'LO QUE DICEN LOS EQUIPOS',
    title: 'Testimonios',
    testimonials: [
      {
        id: 'testimonio-a',
        quote:
          'Fueron un gran apoyo en la construcción del journey del modelo de membresías. Siempre estuvieron dispuestos a escuchar las necesidades e ideas que teníamos y nos ayudaron a aterrizarlas y plasmarlas en un journey que posteriormente nos dio luz para identificar los pasos a seguir, las áreas a las que tenemos que involucrar y los puntos claves que debemos cuidar para llegar al sueño de brindarle la mejor experiencia a nuestro cliente.',
        author: 'Natalia',
        role: 'Equipo de Membresías',
      },
      {
        id: 'testimonio-b',
        quote:
          'Me gustó mucho la experiencia, ya que fue un proceso guiado con cuidado y apertura a la creatividad. Me permitió aportar ideas desde mi experiencia y el conocimiento adquirido durante tantos años de atención a nuestros clientes. Fue muy enriquecedor construir juntos una visión centrada en el aprendedor buscando mejorar su experiencia en cada etapa.',
        author: 'Bertha',
        role: 'Equipo de Vivencia B2C',
      },
    ],
    notes:
      'Natalia (Membresías) destaca cómo el journey les ayudó a identificar pasos, áreas a involucrar y puntos clave; Bertha (Vivencia B2C) valora un proceso guiado, abierto a la creatividad y centrado en el aprendedor.',
  },
  {
    id: 'preguntas-frecuentes',
    kind: 'faq',
    kicker: 'PREGUNTAS FRECUENTES',
    title: 'Lo que necesitas saber',
    items: [
      {
        id: 'tiempo',
        icon: 'clock',
        question: '¿Cuánto tiempo toma diseñar un journey?',
        answer: 'Diseñar un journey desde cero requiere un mínimo de 3 semanas.',
        highlight: 'Mínimo 3 semanas',
      },
      {
        id: 'participacion',
        icon: 'users',
        question: '¿Tengo que participar?',
        answer: 'Sí. Tu participación y la de tu equipo son clave para desarrollar el journey.',
        highlight: 'Participación clave',
      },
      {
        id: 'despues',
        icon: 'refresh',
        question: '¿Qué sigue después de la entrega del journey?',
        answer:
          'Te integras formalmente a este modelo de gestión: iniciamos las reuniones de seguimiento bimestrales y definimos innovaciones y ajustes.',
        highlight: 'Seguimiento bimestral',
      },
      {
        id: 'presupuesto',
        icon: 'wallet',
        question: '¿Por qué el presupuesto es clave?',
        answer: 'Contar con presupuesto permite al equipo de TD priorizar y desarrollar el journey con mayor eficiencia.',
        highlight: 'Eficiencia en TD',
      },
      {
        id: 'independiente',
        icon: 'handshake',
        question: '¿Puedo hacerlo por mi cuenta?',
        answer:
          'La metodología está diseñada para funcionar de forma independiente; aun así, te ofrecemos el acompañamiento del equipo de Experiencia.',
        highlight: 'Acompañamiento',
      },
    ],
    notes:
      'Preguntas frecuentes: mínimo 3 semanas por journey, participación clave del equipo, seguimiento bimestral después de la entrega, presupuesto para que TD sea más eficiente y acompañamiento del equipo de Experiencia.',
  },
  {
    id: 'siguientes-pasos',
    kind: 'roadmap',
    kicker: 'CÓMO LO HACEMOS REALIDAD',
    title: 'Siguientes pasos',
    steps: [
      'Desarrollo de herramientas',
      'Toque de base con el equipo DEAP',
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
      'Siguientes pasos: desarrollo de herramientas, toque de base con el equipo DEAP, socialización con equipos operativos y envío de encuesta índice de madurez de CX.',
  },
  {
    id: 'cierre',
    kind: 'closing',
    caption: 'Modelo de gestión de experiencia · ®2026',
    notes: 'Cierre: Modelo de gestión de experiencia de TEC360.',
  },
];
