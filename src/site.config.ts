// Site-wide settings. The values live in src/data/site.json, which is edited in the
// admin dashboard under Site → Site settings. This file adds the fixed structure
// (URLs, nav order, topic ids) and fallbacks, so a blank field never breaks a page.
import data from './data/site.json';

type Text = string | null | undefined;
type Settings = {
  name?: Text; headline?: Text; tagline?: Text; thesis?: Text; description?: Text;
  email?: Text; phone?: Text; phoneHours?: Text; bookingUrl?: Text; cv?: Text;
  links?: { linkedin?: Text; github?: Text; x?: Text };
  currently?: { studying?: Text; reading?: Text; building?: Text };
  upcoming?: { date?: Text; title?: Text; url?: Text }[];
  sections?: Record<string, { blurb?: Text; card?: Text }>;
  topics?: Record<string, { name?: Text; blurb?: Text }>;
};
const s = data as Settings;
const str = (v: Text, fallback = '') => (v ?? '').trim() || fallback;

export const hero = {
  headline: str(s.headline, 'I architect secure systems.'),
  tagline: str(s.tagline),
};

export const site = {
  name: str(s.name, 'Adam J. Asis'),
  headline: [hero.headline, hero.tagline].filter(Boolean).join('\n'),
  description: str(s.description),
  url: 'https://adamasis.com',
  email: str(s.email),
  phone: str(s.phone),
  phoneHours: str(s.phoneHours),
  bookingUrl: str(s.bookingUrl),
  cv: str(s.cv),
  links: {
    linkedin: str(s.links?.linkedin),
    github: str(s.links?.github),
    x: str(s.links?.x),
  },
  thesis: str(s.thesis),
  currently: {
    studying: str(s.currently?.studying),
    reading: str(s.currently?.reading),
    building: str(s.currently?.building),
  },
  upcoming: (s.upcoming ?? [])
    .filter((u) => str(u.title))
    .map((u) => ({ date: str(u.date), title: str(u.title), url: str(u.url) || undefined })),
};

const nav = [
  { key: 'profile', name: 'Profile', note: 'About Me', href: '/profile' },
  { key: 'labs', name: 'Labs', note: 'Projects', href: '/labs' },
  { key: 'research', name: 'Research', href: '/research' },
  { key: 'journal', name: 'Journal', href: '/journal' },
  { key: 'lectures', name: 'Lectures', href: '/lectures' },
  { key: 'library', name: 'Library', note: 'Resources & Reviews', href: '/library' },
  { key: 'contact', name: 'Contact', href: '/contact' },
] as const;

export const sections: { name: string; note?: string; href: string; blurb: string; card?: string }[] = nav.map(
  ({ key, ...n }) => ({
    ...n,
    blurb: str(s.sections?.[key]?.blurb),
    card: str(s.sections?.[key]?.card) || undefined,
  }),
);

export const blurb = (href: string) => sections.find((x) => x.href === href)?.blurb ?? '';

// Topic ids are fixed because every entry stores them; names and blurbs are editable.
const topicDefaults = {
  security: 'Cybersecurity',
  ai: 'AI & AI Security',
  edge: 'Edge & IoT Security',
  networking: 'Networks & Zero Trust',
  data: 'Data Engineering',
  leadership: 'Leadership & Career',
  access: 'Education & Access',
  robotics: 'Robotics (Hobby R&D)',
} as const;

export type TopicId = keyof typeof topicDefaults;
export const topicIds = Object.keys(topicDefaults) as [TopicId, ...TopicId[]];
export const topics = Object.fromEntries(
  topicIds.map((id) => [id, { name: str(s.topics?.[id]?.name, topicDefaults[id]), blurb: str(s.topics?.[id]?.blurb) }]),
) as Record<TopicId, { name: string; blurb: string }>;
