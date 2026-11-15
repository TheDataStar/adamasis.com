import { createElement } from 'react';
import { config, fields, collection, singleton } from '@keystatic/core';
import { mark } from '@keystatic/core/content-components';
import { Icon } from '@keystar/ui/icon';
import { superscriptIcon } from '@keystar/ui/icon/icons/superscriptIcon';
import { topics, topicIds } from './src/site.config';

const onGitHub = Boolean(import.meta.env.PUBLIC_KEYSTATIC_GITHUB_APP_SLUG);

const topicField = fields.multiselect({
  label: 'Topics',
  options: Object.entries(topics).map(([value, t]) => ({ label: t.name, value })),
});
const tagsField = fields.array(fields.text({ label: 'Tag' }), {
  label: 'Tags',
  description: 'Up to five short tags, e.g. zero-trust, llm, jetson.',
  itemLabel: (p) => p.value,
  validation: { length: { max: 5 } },
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
// The site's notebook favicon, used as the dashboard logo.
const BrandMark = () => createElement('img', { src: '/favicon.svg', width: 24, height: 24, alt: '', style: { borderRadius: 4 } });
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
      { label: 'DEV (dev.to)', value: 'devto' },
    ],
    defaultValue: defaults,
  });

export default config({
  storage: onGitHub ? { kind: 'github', repo: { owner: 'TheDataStar', name: 'adamasis.com' } } : { kind: 'local' },
  ui: {
    brand: { name: 'adamasis.com', mark: BrandMark },
    navigation: {
      Site: ['settings', 'contact', 'colophon'],
      About: ['profile', 'experience', 'education'],
      Writing: ['lectures', 'journal'],
      Work: ['labs', 'research', 'papers'],
      Resources: ['library'],
    },
  },
  singletons: {
    settings: singleton({
      label: 'Site settings',
      path: 'src/data/site',
      format: { data: 'json' },
      previewUrl: '/',
      schema: {
        name: fields.text({ label: 'Your name', validation: { length: { min: 1 } } }),
        headline: fields.text({ label: 'Home headline', description: 'The large first line on the home page.', validation: { length: { min: 1 } } }),
        tagline: fields.text({ label: 'Home tagline', description: 'The second line under the headline.' }),
        thesis: fields.text({
          label: 'Thesis',
          description: 'One or two sentences under the headline. Also the footer line and the default link-preview image.',
          multiline: true,
        }),
        description: fields.text({
          label: 'Site description',
          description: 'Used by search engines, feeds and link previews when a page has no summary of its own.',
          multiline: true,
          validation: { length: { min: 1, max: 200 } },
        }),
        email: fields.text({ label: 'Email', validation: { length: { min: 1 } } }),
        phone: fields.text({ label: 'Phone', description: 'Optional. Leave blank to hide it.' }),
        phoneHours: fields.text({ label: 'When you can be reached by phone', description: 'e.g. Weekdays 9–5 Pacific.' }),
        bookingUrl: fields.url({ label: 'Booking link', description: 'Optional. A Calendly or Cal.com link adds a "Book a time" card.' }),
        links: fields.object(
          {
            linkedin: fields.url({ label: 'LinkedIn' }),
            github: fields.url({ label: 'GitHub' }),
            x: fields.url({ label: 'X (Twitter)' }),
          },
          { label: 'Social links', description: 'Blank links are hidden everywhere on the site.' },
        ),
        cv: fields.file({
          label: 'CV (PDF)',
          description: 'Upload a PDF to add Download CV links to the Experience and Reference pages. Remove it to hide them.',
          directory: 'public',
          publicPath: '/',
        }),
        currently: fields.object(
          {
            studying: fields.text({ label: 'Studying' }),
            reading: fields.text({ label: 'Reading' }),
            building: fields.text({ label: 'Building' }),
          },
          { label: 'Right now', description: 'Shown on Home and Profile. Blank lines are hidden; leave all three blank to hide the strip.' },
        ),
        upcoming: fields.array(
          fields.object({
            date: fields.text({ label: 'Date', description: 'e.g. Mar 12, 2027' }),
            title: fields.text({ label: 'Event' }),
            url: fields.url({ label: 'Link' }),
          }),
          { label: 'Upcoming talks and events', description: 'Shown on the home page. Remove items once they pass.', itemLabel: (p) => [p.fields.date.value, p.fields.title.value].filter(Boolean).join(' · ') || 'Event' },
        ),
        sections: fields.object(
          Object.fromEntries(
            (
              [
                ['profile', 'Profile'],
                ['labs', 'Labs'],
                ['research', 'Research'],
                ['journal', 'Journal'],
                ['lectures', 'Lectures'],
                ['library', 'Library'],
                ['contact', 'Contact'],
              ] as const
            ).map(([key, label]) => [
              key,
              fields.object(
                {
                  blurb: fields.text({ label: 'Page intro', description: 'The lede at the top of the section page.', multiline: true }),
                  card: fields.text({ label: 'Home card text', description: 'Optional. Shown on the Explore card on Home; falls back to the page intro.', multiline: true }),
                },
                { label },
              ),
            ]),
          ),
          { label: 'Section text', description: 'The intro for each section page and its card on the home page.' },
        ),
        topics: fields.object(
          Object.fromEntries(
            topicIds.map((id) => [
              id,
              fields.object(
                {
                  name: fields.text({ label: 'Name', validation: { length: { min: 1 } } }),
                  blurb: fields.text({ label: 'Description', multiline: true }),
                },
                { label: topics[id].name },
              ),
            ]),
          ),
          { label: 'Topics', description: 'Rename a topic or change its description. Topics themselves are fixed because every entry points to them.' },
        ),
      },
    }),
    contact: singleton({
      label: 'Contact page',
      path: 'src/data/contact',
      format: { data: 'json' },
      previewUrl: '/contact',
      schema: {
        lede: fields.text({ label: 'Intro', description: 'The first, larger paragraph.', multiline: true }),
        intro: fields.text({ label: 'Lead-in to the list', defaultValue: 'Good reasons to write:' }),
        reasons: fields.array(
          fields.object({
            title: fields.text({ label: 'Reason', description: 'Shown in bold, e.g. Speaking or teaching.' }),
            text: fields.text({ label: 'Detail', multiline: true }),
          }),
          { label: 'Reasons to get in touch', itemLabel: (p) => p.fields.title.value || 'Reason' },
        ),
        closing: fields.text({ label: 'Closing paragraph', multiline: true }),
        cards: fields.object(
          {
            email: fields.text({ label: 'Email card' }),
            booking: fields.text({ label: 'Booking card', description: 'Shown when a booking link is set in Site settings.' }),
            linkedin: fields.text({ label: 'LinkedIn card' }),
            github: fields.text({ label: 'GitHub card' }),
          },
          { label: 'Contact card text', description: 'The addresses and links themselves are set in Site settings.' },
        ),
      },
    }),
    colophon: singleton({
      label: 'Colophon',
      path: 'src/pages/reference/colophon',
      format: { contentField: 'content' },
      entryLayout: 'content',
      previewUrl: '/reference/colophon',
      schema: {
        layout: fields.ignored(),
        title: fields.text({ label: 'Title', validation: { length: { min: 1 } } }),
        description: fields.text({ label: 'Intro', multiline: true }),
        content: fields.mdx({ label: 'Page', extension: 'md' }),
      },
    }),
    profile: singleton({
      label: 'Profile',
      path: 'src/data/profile',
      format: { data: 'yaml' },
      previewUrl: '/profile',
      schema: {
        subtitle: fields.text({ label: 'Subtitle', description: 'The line under your name.', multiline: true, validation: { length: { min: 1 } } }),
        based: fields.text({ label: 'Based in', validation: { length: { min: 1 } } }),
        focusLabel: fields.text({ label: 'Focus label', defaultValue: 'Focus' }),
        focus: fields.text({ label: 'Focus areas', validation: { length: { min: 1 } } }),
        hobby: fields.text({ label: 'Hobby R&D', description: 'Optional. Personal research outside your main focus.' }),
        portrait: fields.image({
          label: 'Headshot',
          description: 'Used on the home and Profile pages. A 4:5 portrait works best.',
          directory: 'public/images/profile',
          publicPath: '/images/profile/',
        }),
        photos: fields.array(
          fields.object({
            image: fields.image({ label: 'Photo', directory: 'public/images/profile', publicPath: '/images/profile/' }),
            caption: fields.text({ label: 'Caption' }),
          }),
          { label: 'Photos', itemLabel: (p) => p.fields.caption.value || 'Photo' },
        ),
        principles: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            text: fields.text({ label: 'Text', multiline: true }),
          }),
          { label: 'What I believe', itemLabel: (p) => p.fields.title.value || 'Principle' },
        ),
        skills: fields.array(
          fields.object({
            area: fields.text({ label: 'Area' }),
            items: fields.array(fields.text({ label: 'Skill' }), { label: 'Skills', itemLabel: (p) => p.value }),
          }),
          { label: 'Skills', itemLabel: (p) => p.fields.area.value || 'Skill area' },
        ),
        recognition: fields.array(
          fields.object({
            year: fields.text({ label: 'Year' }),
            title: fields.text({ label: 'Title' }),
            detail: fields.text({ label: 'Detail', multiline: true }),
          }),
          { label: 'Recognition', itemLabel: (p) => `${p.fields.year.value} ${p.fields.title.value}`.trim() || 'Recognition' },
        ),
        community: fields.array(
          fields.object({
            title: fields.text({ label: 'Role, group or organization' }),
            detail: fields.text({ label: 'Detail', multiline: true }),
          }),
          { label: 'Leadership & community', itemLabel: (p) => p.fields.title.value || 'Role' },
        ),
        next: fields.array(fields.text({ label: 'Step' }), { label: "What's next", itemLabel: (p) => p.value }),
        experienceIntro: fields.text({
          label: 'Experience page intro',
          description: 'The summary paragraph at the top of the Experience page.',
          multiline: true,
        }),
      },
    }),
  },
  collections: {
    experience: collection({
      label: 'Experience',
      slugField: 'role',
      path: 'src/content/experience/*',
      format: { data: 'yaml' },
      columns: ['role', 'organization', 'start', 'end'],
      schema: {
        role: fields.slug({ name: { label: 'Job title' } }),
        organization: fields.text({ label: 'Organization', validation: { length: { min: 1 } } }),
        location: fields.text({ label: 'Location' }),
        start: fields.text({ label: 'Start', description: 'e.g. Jan 2024', validation: { length: { min: 1 } } }),
        end: fields.text({ label: 'End', description: 'e.g. Mar 2026 or Present', defaultValue: 'Present', validation: { length: { min: 1 } } }),
        order: fields.integer({ label: 'Sort order', description: 'Lower numbers appear first. Use 0 for your current role.', defaultValue: 100 }),
        highlights: fields.array(fields.text({ label: 'Highlight', multiline: true }), {
          label: 'Highlights',
          description: 'Three to five results. Leave client names and confidential figures out.',
          itemLabel: (p) => p.value,
        }),
        caseStudies: fields.array(fields.relationship({ label: 'Case study', collection: 'lectures' }), {
          label: 'Case studies',
          description: 'Lectures written as case studies for this role.',
          itemLabel: (p) => p.value ?? 'Choose a lecture',
        }),
      },
    }),
    education: collection({
      label: 'Education & Credentials',
      slugField: 'title',
      path: 'src/content/education/*',
      format: { data: 'yaml' },
      columns: ['title', 'issuer', 'year', 'status'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        kind: fields.select({
          label: 'Type',
          options: [
            { label: 'Degree', value: 'degree' },
            { label: 'Certificate', value: 'certificate' },
            { label: 'Certification', value: 'certification' },
          ],
          defaultValue: 'certification',
        }),
        issuer: fields.text({ label: 'School or issuer', validation: { length: { min: 1 } } }),
        year: fields.text({ label: 'Year', description: 'e.g. 2024 or 2026 – 2028', validation: { length: { min: 1 } } }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Complete', value: 'complete' },
            { label: 'In progress', value: 'in-progress' },
            { label: 'Coursework', value: 'coursework' },
          ],
          defaultValue: 'complete',
        }),
        note: fields.text({ label: 'Note', description: 'Honors, societies or relevant coursework.', multiline: true }),
        url: fields.url({ label: 'Verification link', description: 'Optional. A Credly badge or issuer verification page; the title becomes a link.' }),
      },
    }),
    lectures: collection({
      label: 'Lectures',
      slugField: 'title',
      path: 'src/content/lectures/*',
      format: { contentField: 'content' },
      previewUrl: '/lectures/{slug}',
      entryLayout: 'content',
      columns: ['title', 'published', 'draft'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: summaryField,
        format: fields.select({
          label: 'Format',
          options: [
            { label: 'For the Board Room (for decision-makers)', value: 'for-the-room' },
            { label: 'In the Classroom (for students and new technologists)', value: 'classroom' },
            { label: 'Teardown (taking something apart)', value: 'teardown' },
            { label: 'Case Study (career work, no client names)', value: 'case-study' },
          ],
          defaultValue: 'for-the-room',
        }),
        forTheRoom: fields.text({
          label: 'Summary box',
          description: 'Two or three short paragraphs shown in a box at the top (titled For the Board Room or In Brief). Separate paragraphs with a blank line.',
          multiline: true,
          validation: { length: { min: 1 } },
        }),
        published: fields.date({ label: 'Published', defaultValue: { kind: 'today' }, validation: { isRequired: true } }),
        revised: fields.date({ label: 'Last revised' }),
        series: fields.text({ label: 'Series', description: 'Optional, for multi-part lectures.' }),
        role: fields.text({ label: 'Your role', description: 'Case studies only.' }),
        period: fields.text({ label: 'Period', description: 'Case studies only, e.g. 2022 – 2026.' }),
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
      label: 'Journal',
      slugField: 'title',
      path: 'src/content/journal/*',
      format: { contentField: 'content' },
      previewUrl: '/journal/{slug}',
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
      previewUrl: '/labs/{slug}',
      entryLayout: 'content',
      columns: ['title', 'track', 'status', 'draft'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: summaryField,
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
        track: fields.select({
          label: 'Track',
          description: 'Security labs are listed first; hobby R&D (e.g. robotics) is listed separately.',
          options: [
            { label: 'Security', value: 'security' },
            { label: 'Hobby R&D', value: 'hobby' },
          ],
          defaultValue: 'security',
        }),
        role: fields.text({ label: 'Your role', validation: { length: { min: 1 } } }),
        period: fields.text({ label: 'Period', description: 'e.g. 2025 – present', validation: { length: { min: 1 } } }),
        repo: fields.url({ label: 'GitHub repository', description: 'Optional. Shows the date of the latest commit.' }),
        url: fields.url({ label: 'Live link', description: 'Optional.' }),
        stack: fields.array(fields.text({ label: 'Technology' }), { label: 'Built with', itemLabel: (p) => p.value }),
        artifacts: fields.array(
          fields.object({
            label: fields.text({ label: 'Label', description: 'e.g. Architecture diagram, Detection rules, Demo video.', validation: { length: { min: 1 } } }),
            kind: fields.text({ label: 'Type', description: 'Optional short tag shown beside it, e.g. PDF, Video, Dataset.' }),
            file: fields.file({ label: 'File', description: 'Upload a file, or use a link below instead.', directory: 'public/files/labs', publicPath: '/files/labs/' }),
            url: fields.url({ label: 'Link', description: 'Used when no file is uploaded.' }),
          }),
          {
            label: 'Artifacts',
            description: 'Downloads and links listed under the write-up: diagrams, configs, slides, datasets, videos.',
            itemLabel: (p) => p.fields.label.value || 'Artifact',
          },
        ),
        order: fields.integer({ label: 'Sort order', description: 'Lower numbers appear first.', defaultValue: 100 }),
        published: fields.date({ label: 'Published', description: 'Needed for sharing to DEV.', defaultValue: { kind: 'today' } }),
        shareTo: shareField([]),
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
      previewUrl: '/research/{slug}',
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
      previewUrl: '/research/papers/{slug}',
      entryLayout: 'content',
      columns: ['title', 'published', 'draft'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: summaryField,
        authors: fields.array(fields.text({ label: 'Author' }), {
          label: 'Authors',
          description: 'Leave empty for a paper you wrote alone. For co-authored papers, list everyone in order, including yourself.',
          itemLabel: (p) => p.value,
        }),
        published: fields.date({ label: 'Published', defaultValue: { kind: 'today' }, validation: { isRequired: true } }),
        version: fields.text({ label: 'Version', defaultValue: '1.0' }),
        venue: fields.text({ label: 'Venue', description: 'Journal, conference or course.' }),
        pdf: fields.file({
          label: 'PDF',
          description: 'Upload the paper. Readers get a Download link and search engines get a citation link.',
          directory: 'public/papers',
          publicPath: '/papers/',
        }),
        doi: fields.text({ label: 'DOI' }),
        shareTo: shareField([]),
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
      columns: ['title', 'format', 'creator', 'added'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        format: fields.select({
          label: 'Type',
          options: [
            { label: 'Book', value: 'book' },
            { label: 'Paper', value: 'paper' },
            { label: 'Streaming content (video, podcast)', value: 'video' },
            { label: 'Website', value: 'website' },
            { label: 'Course', value: 'course' },
            { label: 'Tool', value: 'tool' },
          ],
          defaultValue: 'book',
        }),
        creator: fields.text({ label: 'Author, speaker or maker', validation: { length: { min: 1 } } }),
        year: fields.integer({ label: 'Year' }),
        url: fields.url({ label: 'Link' }),
        note: fields.text({ label: 'Review or why it is here', multiline: true, validation: { length: { min: 1 } } }),
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
