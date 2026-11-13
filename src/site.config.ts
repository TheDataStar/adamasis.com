// Home hero: types the original line, strikes through `struck`, then writes `word` beside it.
// Visitors who prefer reduced motion (and search engines) see the finished edit.
export const hero = {
  lead: 'I',
  struck: 'build',
  word: 'secure',
  rest: 'the systems AI runs on.',
  tagline: 'Then I teach others to do the same.',
};

export const site = {
  name: 'Adam J. Asis',
  headline: `${hero.lead} ${hero.word} ${hero.rest}\n${hero.tagline}`,
  description: 'Lectures, notes, research and labs on cybersecurity, with a focus on securing AI and edge computing.',
  url: 'https://adamasis.com',
  email: 'hello@adamasis.com',
  phone: '',
  bookingUrl: '',
  links: {
    linkedin: 'https://www.linkedin.com/in/adamasis',
    github: 'https://github.com/TheDataStar',
    x: '',
  },
  thesis: 'Every AI model and edge device is only as trustworthy as the system around it. I study how to secure the systems that think and act outside the data center.',
  currently: {
    studying: '[Security certification you are studying for, e.g. CompTIA Security+]',
    reading: '[Security book you are reading now]',
    building: '[Home security lab, e.g. a home SOC with Wazuh]',
  },
  upcoming: [] as { date: string; title: string; url?: string }[],
};

export const blurb = (href: string) => sections.find((s) => s.href === href)?.blurb ?? '';

export const sections = [
  { name: 'Profile', note: 'About Me', href: '/profile', blurb: 'Professional CV, experience and credentials.' },
  { name: 'Labs', note: 'Projects', href: '/labs', blurb: 'Security labs, home-lab builds and tools, plus hobby robotics R&D, each with its artifacts and write-up.' },
  { name: 'Research', href: '/research', blurb: 'Long-running security research on AI and the edge, with the evidence and artifacts that connect it to Labs and Lectures.' },
  { name: 'Journal', href: '/journal', blurb: 'Learning in public: short notes on what I am studying, testing and breaking in security, AI and edge, plus opinions on where the field is heading.' },
  { name: 'Lectures', href: '/lectures', blurb: 'Essays, white papers and case studies. For the Board Room pieces translate security risk for decision-makers; In the Classroom pieces are for students and career changers entering security.' },
  { name: 'Library', note: 'Resources & Reviews', href: '/library', blurb: 'The courses, books, tools and labs I am using to learn security, with honest reviews of what was worth the time.' },
  { name: 'Contact', href: '/contact', blurb: 'For speaking, advising, collaboration or a conversation about the work.' },
];

export const topics = {
  security: { name: 'Cybersecurity', blurb: 'Threats, defenses and the architecture decisions that decide which one wins.' },
  ai: { name: 'AI & AI Security', blurb: 'Securing models and agents, and putting AI to work for defenders.' },
  edge: { name: 'Edge & IoT Security', blurb: 'Protecting compute where the data is born, from devices to private 5G.' },
  networking: { name: 'Networks & Zero Trust', blurb: 'SASE, ZTNA, 5G and how trust gets built into the connection.' },
  data: { name: 'Data Engineering', blurb: 'Pipelines, platforms and the plumbing underneath every model.' },
  leadership: { name: 'Leadership & Career', blurb: 'Teams, teaching and building a career without a straight path.' },
  access: { name: 'Education & Access', blurb: 'Getting knowledge to people and places that are usually left out.' },
  robotics: { name: 'Robotics (Hobby R&D)', blurb: 'Personal experiments with machines that sense and act in the physical world.' },
} as const;

export type TopicId = keyof typeof topics;
export const topicIds = Object.keys(topics) as [TopicId, ...TopicId[]];
