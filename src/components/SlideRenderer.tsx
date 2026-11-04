import type { SlideData } from '../data/slides';
import { ClosingSlide } from './slides/ClosingSlide';
import { CoverSlide } from './slides/CoverSlide';
import { CycleSlide } from './slides/CycleSlide';
import { FaqSlide } from './slides/FaqSlide';
import { JourneysSlide } from './slides/JourneysSlide';
import { MappingSlide } from './slides/MappingSlide';
import { PillarDetailSlide } from './slides/PillarDetailSlide';
import { PillarsOverviewSlide } from './slides/PillarsOverviewSlide';
import { ProcessSlide } from './slides/ProcessSlide';
import { ProblemSlide } from './slides/ProblemSlide';
import { RoadmapSlide } from './slides/RoadmapSlide';
import { StatementSlide } from './slides/StatementSlide';
import { TestimonialsSlide } from './slides/TestimonialsSlide';

export function SlideRenderer({ slide }: { slide: SlideData }) {
  switch (slide.kind) {
    case 'cover':
      return <CoverSlide slide={slide} />;
    case 'problem':
      return <ProblemSlide slide={slide} />;
    case 'statement':
      return <StatementSlide slide={slide} />;
    case 'journeys':
      return <JourneysSlide slide={slide} />;
    case 'process':
      return <ProcessSlide slide={slide} />;
    case 'pillars-overview':
      return <PillarsOverviewSlide slide={slide} />;
    case 'pillar-detail':
      return <PillarDetailSlide slide={slide} />;
    case 'mapping':
      return <MappingSlide slide={slide} />;
    case 'cycle':
      return <CycleSlide slide={slide} />;
    case 'testimonials':
      return <TestimonialsSlide slide={slide} />;
    case 'faq':
      return <FaqSlide slide={slide} />;
    case 'roadmap':
      return <RoadmapSlide slide={slide} />;
    case 'closing':
      return <ClosingSlide slide={slide} />;
  }
}
