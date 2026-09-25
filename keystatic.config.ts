import { createElement } from 'react';
import { config, fields, collection } from '@keystatic/core';
import { mark } from '@keystatic/core/content-components';
import { Icon } from '@keystar/ui/icon';
import { superscriptIcon } from '@keystar/ui/icon/icons/superscriptIcon';
import { topics } from './src/site.config';

const onGitHub = Boolean(import.meta.env.PUBLIC_KEYSTATIC_GITHUB_APP_SLUG);

const topicField = fields.multiselect({
  label: 'Topics',
  options: Object.entries(topics).map(([value, t]) => ({ label: t.name, value })),
});
const tagsField = fields.array(fields.text({ label: 'Tag' }), {
  label: 'Tags',
  description: 'Up to five short tags, e.g. jetson, 5g, offline-first.',
  itemLabel: (p) => p.value,
});
const researchField = fields.array(fields.relationship({ label: 'Research topic', collection: 'research' }), {
  label: 'Supports research',
  description: 'Research topics this piece is evidence for. It will appear in their evidence logs.',
  itemLabel: (p) => p.value ?? 'Choose a topic',
});
const summaryField = fields.text({
  label: 'Summary',
  description: 'One sentence. Shown in lists, search results and link previews.',
  multiline: true,
  validation: { length: { min: 1, max: 200 } },
});
const draftField = fields.checkbox({
  label: 'Draft',
  description: 'Drafts are hidden on the live site until unchecked.',
  defaultValue: true,
});
const changelogField = fields.array(
  fields.object({
    date: fields.date({ label: 'Date', defaultValue: { kind: 'today' }, validation: { isRequired: true } }),
    note: fields.text({ label: 'What changed' }),
  }),
  { label: 'Revision history', itemLabel: (p) => p.fields.note.value || 'Revision' },
);
const noteIcon = createElement(Icon, { src: superscriptIcon });
const body = (label: string, section: string) =>
  fields.mdx({
    label,
    extension: 'md',
    options: { image: { directory: `public/images/${section}`, publicPath: `/images/${section}/` } },
    components: {
      Note: mark({
        label: 'Margin note',
        icon: noteIcon,
        schema: {},
        tag: 'span',
        style: { background: 'rgba(176, 57, 46, 0.12)', borderBottom: '1px dashed #b0392e' },
      }),
    },
  });
const shareField = (defaults: string[]) =>
  fields.multiselect({
    label: 'Share to',
    options: [
      { label: 'LinkedIn', value: 'linkedin' },
      { label: 'Newsletter', value: 'newsletter' },
    ],
    defaultValue: defaults,
  });

export default config({
  storage: onGitHub ? { kind: 'github', repo: { owner: 'TheDataStar', name: 'adamasis.com' } } : { kind: 'local' },
  ui: {
    brand: { name: 'adamasis.com' },
    navigation: {
      Writing: ['lectures', 'journal'],
      Work: ['labs', 'research', 'papers'],
      Resources: ['library'],
    },
  },
  collections: {
    lectures: collection({
      label: 'Lectures',
      slugField: 'title',
      path: 'src/content/lectures/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'published', 'draft'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: summaryField,
        format: fields.select({
          label: 'Format',
          options: [
            { label: 'For the Room (for decision-makers)', value: 'for-the-room' },
            { label: 'Teardown (taking something apart)', value: 'teardown' },
          ],
          defaultValue: 'for-the-room',
        }),
        forTheRoom: fields.text({
          label: 'For the Room summary',
          description: 'Two or three short paragraphs shown in a box at the top. Separate paragraphs with a blank line.',
          multiline: true,
          validation: { length: { min: 1 } },
        }),
        published: fields.date({ label: 'Published', defaultValue: { kind: 'today' }, validation: { isRequired: true } }),
        revised: fields.date({ label: 'Last revised' }),
        series: fields.text({ label: 'Series', description: 'Optional, for multi-part lectures.' }),
        topics: topicField,
        tags: tagsField,
        research: researchField,
        shareTo: shareField(['linkedin', 'newsletter']),
        changelog: changelogField,
        draft: draftField,
        content: body('Lecture', 'lectures'),
      },
    }),
    journal: collection({
      label: 'Lab Journal',
      slugField: 'title',
      path: 'src/content/journal/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'date', 'status', 'draft'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: summaryField,
        date: fields.date({ label: 'Date', defaultValue: { kind: 'today' }, validation: { isRequired: true } }),
        status: fields.select({
          label: 'How sure are you?',
          options: [
            { label: 'Hypothesis (an idea, untested)', value: 'hypothesis' },
            { label: 'Testing (working on it)', value: 'testing' },
            { label: 'Confirmed (evidence I stand behind)', value: 'confirmed' },
          ],
          defaultValue: 'hypothesis',
        }),
        setup: fields.text({ label: 'Setup', description: 'Optional: the hardware, software or course you worked with.' }),
        topics: topicField,
        tags: tagsField,
        research: researchField,
        shareTo: shareField(['newsletter']),
        draft: draftField,
        content: body('Entry', 'journal'),
      },
    }),
    labs: collection({
      label: 'Labs',
      slugField: 'title',
      path: 'src/content/labs/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'kind', 'status', 'draft'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: summaryField,
        kind: fields.select({
          label: 'Type',
          options: [
            { label: 'Project (work you own)', value: 'project' },
            { label: 'Case study (career work, no client names)', value: 'case-study' },
          ],
          defaultValue: 'project',
        }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Shipped', value: 'shipped' },
            { label: 'Paused', value: 'paused' },
            { label: 'Complete', value: 'complete' },
          ],
          defaultValue: 'active',
        }),
        role: fields.text({ label: 'Your role', validation: { length: { min: 1 } } }),
        period: fields.text({ label: 'Period', description: 'e.g. 2025 – present', validation: { length: { min: 1 } } }),
        repo: fields.url({ label: 'GitHub repository', description: 'Optional. Shows the date of the latest commit.' }),
        url: fields.url({ label: 'Live link', description: 'Optional.' }),
        stack: fields.array(fields.text({ label: 'Technology' }), { label: 'Built with', itemLabel: (p) => p.value }),
        order: fields.integer({ label: 'Sort order', description: 'Lower numbers appear first.', defaultValue: 100 }),
        topics: topicField,
        tags: tagsField,
        research: researchField,
        draft: draftField,
        content: body('Write-up', 'labs'),
      },
    }),
    research: collection({
      label: 'Research',
      slugField: 'title',
      path: 'src/content/research/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'status', 'version'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: summaryField,
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Exploratory', value: 'exploratory' },
            { label: 'Concluded', value: 'concluded' },
          ],
          defaultValue: 'exploratory',
        }),
        pinned: fields.checkbox({ label: 'Primary research', description: 'Pin to the home and Research pages. Only one topic should be pinned.' }),
        version: fields.text({ label: 'Version', defaultValue: '0.1' }),
        started: fields.date({ label: 'Started', defaultValue: { kind: 'today' }, validation: { isRequired: true } }),
        revised: fields.date({ label: 'Last revised' }),
        questions: fields.array(fields.text({ label: 'Question', multiline: true }), {
          label: 'Research questions',
          itemLabel: (p) => p.value,
        }),
        topics: topicField,
        tags: tagsField,
        changelog: changelogField,
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        content: body('Abstract', 'research'),
      },
    }),
    papers: collection({
      label: 'Papers',
      slugField: 'title',
      path: 'src/content/papers/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: summaryField,
        authors: fields.array(fields.text({ label: 'Author' }), { label: 'Authors', itemLabel: (p) => p.value }),
        published: fields.date({ label: 'Published', defaultValue: { kind: 'today' }, validation: { isRequired: true } }),
        version: fields.text({ label: 'Version', defaultValue: '1.0' }),
        venue: fields.text({ label: 'Venue', description: 'Journal, conference or course.' }),
        pdf: fields.text({ label: 'PDF path', description: 'e.g. /papers/my-paper.pdf, with the file saved in public/papers/.' }),
        doi: fields.text({ label: 'DOI' }),
        topics: topicField,
        tags: tagsField,
        research: researchField,
        draft: draftField,
        content: body('Abstract', 'papers'),
      },
    }),
    library: collection({
      label: 'Library',
      slugField: 'title',
      path: 'src/content/library/*',
      format: { data: 'yaml' },
      columns: ['title', 'format', 'creator'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        format: fields.select({
          label: 'Type',
          options: [
            { label: 'Book', value: 'book' },
            { label: 'Paper', value: 'paper' },
            { label: 'Video', value: 'video' },
            { label: 'Course', value: 'course' },
            { label: 'Tool', value: 'tool' },
          ],
          defaultValue: 'book',
        }),
        creator: fields.text({ label: 'Author, speaker or maker', validation: { length: { min: 1 } } }),
        year: fields.integer({ label: 'Year' }),
        url: fields.url({ label: 'Link' }),
        note: fields.text({ label: 'Why it is here', multiline: true, validation: { length: { min: 1 } } }),
        cover: fields.image({
          label: 'Cover or thumbnail',
          description: 'Optional: a book cover, video still or tool logo.',
          directory: 'public/images/library',
          publicPath: '/images/library/',
        }),
        added: fields.date({ label: 'Added', defaultValue: { kind: 'today' }, validation: { isRequired: true } }),
        topics: topicField,
        tags: tagsField,
        research: researchField,
      },
    }),
  },
});
