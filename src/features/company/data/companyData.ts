export interface Value {
  title: string;
  description: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  summary: string;
}

export interface PressItem {
  id: string;
  title: string;
  outlet: string;
  date: string; // ISO date
  excerpt: string;
  href?: string;
  kind: 'Press release' | 'Coverage';
}

export const ABOUT_STATS: Stat[] = [
  { label: 'Verified suppliers', value: '—' },
  { label: 'Equipment listings', value: '—' },
  { label: 'Countries served', value: '—' },
  { label: 'Escrow-protected deals', value: '—' },
];

export const VALUES: Value[] = [
  {
    title: 'Trust first',
    description:
      'KYC-verified buyers and suppliers, and escrow-protected payments, so every deal starts from confidence.',
  },
  {
    title: 'Transparency',
    description:
      'Clear pricing, clear quotes and clear dispute resolution. No hidden steps between listing and delivery.',
  },
  {
    title: 'Built for Africa',
    description:
      'Designed around the realities of African mining supply chains, payments and logistics.',
  },
  {
    title: 'Access for everyone',
    description:
      'From junior miners to institutional investors, one marketplace with the right tools for each.',
  },
];

export const OPENINGS: JobOpening[] = [
  {
    id: 'frontend-engineer',
    title: 'Frontend Engineer',
    department: 'Engineering',
    location: 'Lagos, Nigeria (Hybrid)',
    type: 'Full-time',
    summary:
      'Build and ship marketplace, escrow and vendor-dashboard experiences in React and TypeScript.',
  },
  {
    id: 'backend-engineer',
    title: 'Backend Engineer',
    department: 'Engineering',
    location: 'Remote (Africa)',
    type: 'Full-time',
    summary:
      'Own payments, wallet and payout services that move money safely between buyers and suppliers.',
  },
  {
    id: 'kyc-analyst',
    title: 'KYC & Compliance Analyst',
    department: 'Operations',
    location: 'Lagos, Nigeria',
    type: 'Full-time',
    summary:
      'Review supplier and buyer verification submissions and keep the marketplace trustworthy.',
  },
];

export const PRESS_ITEMS: PressItem[] = [
  {
    id: 'launch',
    title: 'Afrimine launches marketplace for mining equipment and assets',
    outlet: 'Afrimine',
    date: '2026-01-15',
    excerpt:
      'Afrimine opens its B2B marketplace connecting equipment suppliers, buyers and investors across Africa.',
    kind: 'Press release',
  },
];

export const COMPANY_EMAILS = {
  careers: 'careers@afrimine.com',
  press: 'press@afrimine.com',
  support: 'support@afrimine.com',
} as const;