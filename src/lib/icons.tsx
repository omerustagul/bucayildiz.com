/* Buca Yıldız — icon helpers.
   Line icons come from lucide-react; brand/social marks are inline SVG
   (Lucide dropped brand glyphs). Usable in both server and client components. */
import {
  Lock,
  ClipboardList,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Menu,
  X,
  MapPin,
  Phone,
  Mail,
  Play,
  Image as ImageIcon,
  Clock,
  ShieldCheck,
  CalendarCheck,
  Users,
  Trophy,
  Check,
  LayoutDashboard,
  Shield,
  Dumbbell,
  CalendarDays,
  Newspaper,
  Images,
  Shirt,
  ExternalLink,
  PanelLeft,
  ChevronRight,
  ChevronLeft,
  Bell,
  UserRound,
  LogOut,
  Inbox,
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Zap,
  Mic,
  Megaphone,
  HeartPulse,
  Send,
  FolderPlus,
  Folder,
  FolderOpen,
  Star,
  Gift,
  ArrowDown,
  Brain,
  Settings,
  Gauge,
  TrafficCone,
  ArrowUpFromLine,
  FileText,
  Apple,
  EyeOff,
  Camera,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  lock: Lock,
  "clipboard-list": ClipboardList,
  "arrow-right": ArrowRight,
  "arrow-left": ArrowLeft,
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  menu: Menu,
  x: X,
  "map-pin": MapPin,
  phone: Phone,
  mail: Mail,
  play: Play,
  image: ImageIcon,
  clock: Clock,
  "shield-check": ShieldCheck,
  "calendar-check": CalendarCheck,
  users: Users,
  trophy: Trophy,
  check: Check,
  "layout-dashboard": LayoutDashboard,
  shield: Shield,
  dumbbell: Dumbbell,
  "calendar-days": CalendarDays,
  newspaper: Newspaper,
  images: Images,
  shirt: Shirt,
  "external-link": ExternalLink,
  "panel-left": PanelLeft,
  "chevron-right": ChevronRight,
  bell: Bell,
  "user-round": UserRound,
  "log-out": LogOut,
  inbox: Inbox,
  search: Search,
  plus: Plus,
  pencil: Pencil,
  "trash-2": Trash2,
  eye: Eye,
  zap: Zap,
  mic: Mic,
  megaphone: Megaphone,
  "heart-pulse": HeartPulse,
  send: Send,
  "folder-plus": FolderPlus,
  folder: Folder,
  "folder-open": FolderOpen,
  star: Star,
  gift: Gift,
  "arrow-down": ArrowDown,
  brain: Brain,
  settings: Settings,
  gauge: Gauge,
  "traffic-cone": TrafficCone,
  "arrow-up-from-line": ArrowUpFromLine,
  "file-text": FileText,
  apple: Apple,
  "eye-off": EyeOff,
  camera: Camera,
};

export type IconName = keyof typeof ICONS;

export function Icon({
  name,
  size = 17,
  className,
  style,
}: {
  name: IconName;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const Cmp = ICONS[name];
  if (!Cmp) return null;
  return <Cmp size={size} className={className} style={style} aria-hidden />;
}

const BRAND_PATHS: Record<string, string> = {
  instagram:
    "M12 2c-2.7 0-3 0-4.1.1-1 0-1.8.2-2.4.5-.7.2-1.3.6-1.8 1.1S2.8 4.8 2.6 5.5c-.3.6-.4 1.4-.5 2.4C2 9 2 9.3 2 12s0 3 .1 4.1c0 1 .2 1.8.5 2.4.2.7.6 1.3 1.1 1.8s1.1.9 1.8 1.1c.6.3 1.4.4 2.4.5C9 22 9.3 22 12 22s3 0 4.1-.1c1 0 1.8-.2 2.4-.5.7-.2 1.3-.6 1.8-1.1s.9-1.1 1.1-1.8c.3-.6.4-1.4.5-2.4 0-1.1.1-1.4.1-4.1s0-3-.1-4.1c0-1-.2-1.8-.5-2.4-.2-.7-.6-1.3-1.1-1.8s-1.1-.9-1.8-1.1c-.6-.3-1.4-.4-2.4-.5C15 2 14.7 2 12 2zm0 1.8c2.7 0 3 0 4 .1.9 0 1.5.2 1.8.3.5.2.8.4 1.1.7.3.3.6.6.7 1.1.1.3.3.9.3 1.8.1 1 .1 1.3.1 4s0 3-.1 4c0 .9-.2 1.5-.3 1.8-.2.5-.4.8-.7 1.1-.3.3-.6.6-1.1.7-.3.1-.9.3-1.8.3-1 .1-1.3.1-4 .1s-3 0-4-.1c-.9 0-1.5-.2-1.8-.3-.5-.2-.8-.4-1.1-.7-.3-.3-.6-.6-.7-1.1-.1-.3-.3-.9-.3-1.8-.1-1-.1-1.3-.1-4s0-3 .1-4c0-.9.2-1.5.3-1.8.2-.5.4-.8.7-1.1.3-.3.6-.6 1.1-.7.3-.1.9-.3 1.8-.3 1-.1 1.3-.1 4-.1zm0 3.1a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2zm0 8.4a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6zm6.5-8.6a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z",
  facebook:
    "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z",
  youtube:
    "M23 8.2a3 3 0 0 0-2.1-2.1C19 5.5 12 5.5 12 5.5s-7 0-8.9.6A3 3 0 0 0 1 8.2 31 31 0 0 0 .7 12 31 31 0 0 0 1 15.8a3 3 0 0 0 2.1 2.1c1.9.6 8.9.6 8.9.6s7 0 8.9-.6a3 3 0 0 0 2.1-2.1c.3-1.2.3-3.8.3-3.8s0-2.6-.3-3.8zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z",
  x: "M17.5 3h3.1l-6.7 7.7L21.7 21h-6.1l-4.8-6.3L5.3 21H2.2l7.2-8.2L2 3h6.3l4.4 5.8L17.5 3zm-1.1 16.2h1.7L7.4 4.7H5.6l10.8 14.5z",
};

export type BrandName = keyof typeof BRAND_PATHS;

export function BrandGlyph({ name, size = 17 }: { name: BrandName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={BRAND_PATHS[name]} />
    </svg>
  );
}
