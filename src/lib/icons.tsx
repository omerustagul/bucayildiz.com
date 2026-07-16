/* Buca Yıldız — icon helpers.
   Line icons come from lucide-react; brand/social marks are inline SVG
   (Lucide dropped brand glyphs). Usable in both server and client components. */
import {
  AlertTriangle,
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
  Footprints,
} from "lucide-react";

// DİKKAT: `Record<string, LucideIcon>` ile TİPLEME — o zaman `keyof typeof ICONS`
// düz `string`e çöker ve IconName hiçbir güvenlik sağlamaz (yanlış yazılan ikon adı
// typecheck'ten geçip SESSİZCE boş render eder). `satisfies` ile hem literal anahtarlar
// korunur hem de değerlerin LucideIcon olduğu doğrulanır.
const ICONS = {
  "alert-triangle": AlertTriangle,
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
  foot: Footprints,
  "footprints": Footprints,
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
} satisfies Record<string, LucideIcon>;

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
  tiktok:
    "M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  linkedin:
    "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z",
  whatsapp:
    "M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.11 3.22 5.1 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 7 2.9 9.83 9.83 0 0 1 2.89 7c0 5.45-4.44 9.88-9.9 9.88m8.42-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.59 5.94L.06 24l6.33-1.66a11.88 11.88 0 0 0 5.66 1.44h.01c6.55 0 11.89-5.33 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41",
  telegram:
    "M11.94 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.06 0zm4.96 7.22c.11 0 .37.03.53.16.11.09.14.22.16.31.02.09.04.3.02.46-.19 2.05-1.04 7.02-1.47 9.31-.18.97-.54 1.3-.88 1.33-.75.07-1.32-.5-2.05-.97-1.14-.75-1.78-1.21-2.89-1.94-1.28-.84-.45-1.31.28-2.07.19-.2 3.5-3.21 3.57-3.48.01-.03.01-.16-.06-.23s-.18-.05-.26-.03c-.11.03-1.94 1.23-5.46 3.62-.52.35-.99.53-1.41.52-.46-.01-1.36-.26-2.02-.48-.81-.27-1.46-.41-1.4-.86.03-.24.35-.48.98-.74 3.83-1.67 6.39-2.77 7.66-3.3 3.65-1.52 4.41-1.78 4.9-1.79z",
};

export type BrandName = keyof typeof BRAND_PATHS;

export function BrandGlyph({ name, size = 17 }: { name: BrandName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={BRAND_PATHS[name]} />
    </svg>
  );
}
