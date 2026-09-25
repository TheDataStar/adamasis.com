import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import { site, topicIds } from './site.config';

const blank = (v: unknown) => (v === '' || v === null ? undefined : v);
const opt = <T extends z.ZodType>(schema: T) => z.preprocess(blank, schema.optional());
const optDate = () => opt(z.coerce.date());

const common = {
  title: z.string(),
  summary: z.string().max(200),
  topics: z.array(z.enum(topicIds)).default([]),
  tags: z.array(z.string()).max(5).default([]),
  research: z.array(reference('research')).default([]),
  draft: z.boolean().default(false),
};

const changelog = z
  .array(z.object({ date: z.coerce.date(), note: z.string() }))
  .default([]);

const lectures = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lectures' }),
  schema: z.object({
    ...common,
    format: z.enum(['for-the-room', 'teardown']),
    forTheRoom: z.string(),
    published: z.coerce.date(),
    revised: optDate(),
    changelog,
    series: opt(z.string()),
    shareTo: z.array(z.enum(['linkedin', 'newsletter'])).default(['linkedin', 'newsletter']),
  }),
});

const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    ...common,
    date: z.coerce.date(),
    status: z.enum(['hypothesis', 'testing', 'confirmed']),
    setup: opt(z.string()),
    shareTo: z.array(z.enum(['linkedin', 'newsletter'])).default(['newsletter']),
  }),
});

const labs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/labs' }),
  schema: z.object({
    ...common,
    kind: z.enum(['project', 'case-study']),
    status: z.enum(['active', 'shipped', 'paused', 'complete']),
    role: z.string(),
    period: z.string(),
    repo: opt(z.string().url()),
    url: opt(z.string().url()),
    stack: z.array(z.string()).default([]),
    order: z.number().default(100),
  }),
});

const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(200),
    status: z.enum(['active', 'exploratory', 'concluded']),
    pinned: z.boolean().default(false),
    version: z.string(),
    started: z.coerce.date(),
    revised: optDate(),
    questions: z.array(z.string()).default([]),
    changelog,
    topics: z.array(z.enum(topicIds)).default([]),
    tags: z.array(z.string()).max(5).default([]),
    draft: z.boolean().default(false),
  }),
});

const papers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/papers' }),
  schema: z.object({
    ...common,
    authors: z.array(z.string()).default([site.name]),
    published: z.coerce.date(),
    version: z.string().default('1.0'),
    pdf: opt(z.string()),
    doi: opt(z.string()),
    venue: opt(z.string()),
  }),
});

const library = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/library' }),
  schema: z.object({
    title: z.string(),
    format: z.enum(['book', 'paper', 'video', 'tool', 'course']),
    creator: z.string(),
    year: opt(z.coerce.number()),
    url: opt(z.string().url()),
    note: z.string(),
    cover: opt(z.string()),
    added: z.coerce.date(),
    topics: z.array(z.enum(topicIds)).default([]),
    tags: z.array(z.string()).max(5).default([]),
    research: z.array(reference('research')).default([]),
  }),
});

const experience = defineCollection({
  loader: file('src/data/experience.yaml'),
  schema: z.object({
    role: z.string(),
    organization: z.string(),
    location: z.string().optional(),
    start: z.string(),
    end: z.string(),
    highlights: z.array(z.string()),
    caseStudies: z.array(reference('labs')).default([]),
  }),
});

const education = defineCollection({
  loader: file('src/data/education.yaml'),
  schema: z.object({
    kind: z.enum(['degree', 'certificate', 'certification']),
    title: z.string(),
    issuer: z.string(),
    year: z.string(),
    status: z.enum(['complete', 'in-progress', 'coursework']).default('complete'),
    note: z.string().optional(),
  }),
});

export const collections = { lectures, journal, labs, research, papers, library, experience, education };
