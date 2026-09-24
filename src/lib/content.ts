import { getCollection, type CollectionEntry } from 'astro:content';

type Section = 'lectures' | 'journal' | 'labs' | 'research' | 'papers';
type Entry = CollectionEntry<Section>;

const visible = ({ data }: { data: { draft?: boolean } }) => import.meta.env.DEV || !data.draft;

export const dateOf = (e: Entry): Date =>
  'published' in e.data ? e.data.published : 'date' in e.data ? e.data.date : 'started' in e.data ? e.data.started : new Date(0);

const newestFirst = (a: Entry, b: Entry) => dateOf(b).getTime() - dateOf(a).getTime();

export async function lectures() {
  return (await getCollection('lectures', visible)).sort(newestFirst);
}

export async function journal() {
  const entries = (await getCollection('journal', visible)).sort(
    (a, b) => a.data.date.getTime() - b.data.date.getTime(),
  );
  return entries.map((entry, i) => ({ ...entry, number: String(i + 1).padStart(3, '0') })).reverse();
}

export async function labs() {
  return (await getCollection('labs', visible)).sort((a, b) => a.data.order - b.data.order);
}

export async function research() {
  const order = { active: 0, exploratory: 1, concluded: 2 };
  return (await getCollection('research', visible)).sort(
    (a, b) => Number(b.data.pinned) - Number(a.data.pinned) || order[a.data.status] - order[b.data.status],
  );
}

const hasPapers = Object.keys(import.meta.glob('/src/content/papers/**/*.md')).length > 0;

export async function papers() {
  if (!hasPapers) return [];
  return (await getCollection('papers', visible)).sort(newestFirst);
}

export async function everything(): Promise<Entry[]> {
  return [...(await lectures()), ...(await journal()), ...(await labs()), ...(await research()), ...(await papers())];
}

export const urlOf = (e: { collection: string; id: string }) =>
  e.collection === 'papers' ? `/research/papers/${e.id}` : `/${e.collection}/${e.id}`;

export const sectionName: Record<string, string> = {
  lectures: 'Lecture',
  journal: 'Lab Journal',
  labs: 'Lab',
  research: 'Research',
  papers: 'Paper',
};

export async function backlinks(target: { collection: string; id: string }) {
  const path = urlOf(target);
  const all = await everything();
  return all.filter((e) => {
    if (e.collection === target.collection && e.id === target.id) return false;
    const cites = 'research' in e.data && Array.isArray(e.data.research)
      ? e.data.research.some((r) => target.collection === 'research' && r.id === target.id)
      : false;
    return cites || (e.body ?? '').includes(`](${path})`) || (e.body ?? '').includes(`](${path}#`);
  });
}

export function formatDate(d: Date, style: 'long' | 'short' = 'long') {
  return d.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    day: 'numeric',
  });
}

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const formatLabel: Record<string, string> = {
  'for-the-room': 'For the Room',
  teardown: 'Teardown',
};
