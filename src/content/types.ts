import type { MvpFeature, MvpOutcome } from '../features/mvp/score';

export type SectionId =
  | 'top'
  | 'origin'
  | 'motto'
  | 'shop'
  | 'work'
  | 'mvp'
  | 'timeline'
  | 'lessons'
  | 'next'
  | 'contact';

export type World = 'paper' | 'hinge' | 'dusk' | 'screen' | 'night';
export type Era = 'gingerbread' | 'holo' | 'modern';

export interface SiteMeta {
  name: string;
  role: string;
  duration: string;
  durationLength: string;
  location: string;
  summary: string;
}

export interface NavLink {
  id: SectionId;
  label: string;
}

export interface NavContent {
  wordmark: string;
  links: NavLink[];
  menuLabel: string;
  themeToLight: string;
  themeToDark: string;
  /** The year on the status-bar clock while each interface era is on screen. */
  eraClock: Record<Era, string>;
}

export interface PreloaderContent {
  lines: string[];
  skipHint: string;
  statusLabel: string;
}

export interface HeroContent {
  headline: string;
  subline: string;
  cta: string;
  scrollHint: string;
}

export type OriginSceneId = 'desk' | 'client' | 'live' | 'android';

export interface OriginFrame {
  id: OriginSceneId;
  title: string;
  body: string;
  /** Alt text for the line drawing. */
  alt: string;
}

export interface OriginContent {
  number: string;
  title: string;
  frames: OriginFrame[];
}

export interface MottoPillar {
  id: string;
  title: string;
  body: string;
}

export interface MottoContent {
  number: string;
  text: string;
  pillarsTitle: string;
  pillars: MottoPillar[];
}

export type BusinessId =
  'spice-trader' | 'coir-maker' | 'handloom-weaver' | 'bakery' | 'auto-workshop';

export interface Business {
  id: BusinessId;
  label: string;
  sampleName: string;
  tagline: string;
  phone: string;
  ledger: string[];
  appAction: string;
  colors: {
    /** Dark brand colour, with white text on it. */
    primary: string;
    /** Bright detail colour. */
    accent: string;
    /** Page tint behind the mock site. */
    tint: string;
  };
}

export interface ShopContent {
  number: string;
  title: string;
  lead: string;
  demoNotice: string;
  chooseLabel: string;
  nameLabel: string;
  namePlaceholder: string;
  nameHelp: string;
  sliderLabel: string;
  offlineLabel: string;
  onlineLabel: string;
  offlineAlt: string;
  onlineAlt: string;
  deployLabel: string;
  deployingLabel: string;
  deployAgainLabel: string;
  liveMessage: string;
  liveDetail: string;
  deploySteps: string[];
  mockNav: string[];
  mockCall: string;
  mockFind: string;
  appInstalled: string;
  domainSuffix: string;
  fallbackSlug: string;
  businesses: Business[];
}

export type WorkIcon = 'devices' | 'seedling' | 'podium' | 'community';

export interface WorkBlock {
  id: string;
  icon: WorkIcon;
  title: string;
  body: string;
}

/**
 * Impact numbers. Anything left undefined is hidden on the page, so these never need a
 * placeholder value. Only fill in figures you can stand behind.
 */
export interface ImpactStats {
  monthsBuilding?: number;
  businessesDigitized?: number;
  appsShipped?: number;
  talksGiven?: number;
  startupsMentored?: number;
}

export type StatLabels = Record<keyof ImpactStats, string>;

export interface WorkContent {
  number: string;
  title: string;
  blocks: WorkBlock[];
  stats: ImpactStats;
  statLabels: StatLabels;
  statsTitle: string;
}

export interface MvpOutcomeCopy {
  title: string;
  message: string;
}

export interface MvpContent {
  number: string;
  title: string;
  lead: string;
  poolTitle: string;
  zoneTitle: string;
  zoneEmpty: string;
  dragHint: string;
  addLabel: string;
  removeLabel: string;
  submitLabel: string;
  tryAgainLabel: string;
  overBudget: string;
  budgetLabel: string;
  gaugeLabel: string;
  resultTitle: string;
  pickedLabel: string;
  lesson: string;
  budget: number;
  features: MvpFeature[];
  outcomes: Record<MvpOutcome, MvpOutcomeCopy>;
}

export interface Milestone {
  id: string;
  title: string;
  /** Hidden on the page when undefined. */
  date?: string;
  detail: string;
  /** False until the founder has confirmed the date and wording. */
  verified: boolean;
}

export interface TimelineContent {
  number: string;
  title: string;
  milestones: Milestone[];
}

export interface Lesson {
  id: string;
  front: string;
  back: string;
  /** True until the founder has rewritten or approved the wording. */
  draft: boolean;
}

export interface LessonsContent {
  number: string;
  title: string;
  hint: string;
  previousLabel: string;
  nextLabel: string;
  flipLabel: string;
  cardHint: string;
  lessons: Lesson[];
}

export interface NextChapterContent {
  number: string;
  title: string;
  paragraphs: string[];
  closing: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterContent {
  title: string;
  links: FooterLink[];
  backToTop: string;
  credit: string;
}

export interface EasterEggContent {
  onMessage: string;
  offMessage: string;
  exitLabel: string;
}

export interface SiteContent {
  meta: SiteMeta;
  nav: NavContent;
  preloader: PreloaderContent;
  hero: HeroContent;
  origin: OriginContent;
  motto: MottoContent;
  shop: ShopContent;
  work: WorkContent;
  mvp: MvpContent;
  timeline: TimelineContent;
  lessons: LessonsContent;
  next: NextChapterContent;
  footer: FooterContent;
  easterEgg: EasterEggContent;
}
