import {
  CalendarDays,
  CalendarX,
  Cpu,
  Clock,
  ClipboardList,
  FileText,
  FolderOpen,
  Gauge,
  GraduationCap,
  Handshake,
  Inbox,
  Layers,
  Lightbulb,
  ListChecks,
  ListOrdered,
  Mail,
  MessageCircle,
  NotebookPen,
  PenTool,
  PackageCheck,
  Presentation,
  RefreshCw,
  Route,
  Scale,
  ShieldCheck,
  UserRound,
  Users,
  Wallet,
  Workflow,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { IconName } from '../data/slides';

const iconMap: Record<IconName, LucideIcon> = {
  inbox: Inbox,
  scale: Scale,
  graduation: GraduationCap,
  mail: Mail,
  whatsapp: MessageCircle,
  meeting: Users,
  lightbulb: Lightbulb,
  clipboard: ClipboardList,
  package: PackageCheck,
  shield: ShieldCheck,
  gauge: Gauge,
  folder: FolderOpen,
  file: FileText,
  form: NotebookPen,
  list: ListChecks,
  calendar: CalendarDays,
  users: Users,
  report: Presentation,
  route: Route,
  wrench: Wrench,
  queue: ListOrdered,
  'calendar-x': CalendarX,
  clock: Clock,
  refresh: RefreshCw,
  wallet: Wallet,
  handshake: Handshake,
  user: UserRound,
  pen: PenTool,
  workflow: Workflow,
  layers: Layers,
  cpu: Cpu,
};

interface IconProps {
  name: IconName;
  className?: string;
  strokeWidth?: number;
  label?: string;
}

export function Icon({ name, className, strokeWidth = 1.75, label }: IconProps) {
  const Component = iconMap[name];
  return (
    <Component
      className={className}
      strokeWidth={strokeWidth}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
    />
  );
}
