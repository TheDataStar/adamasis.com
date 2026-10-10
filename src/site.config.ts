export const hero = {
  lead: 'I Architect and Build',
  words: ['Edge Compute', 'Robotics', 'AI', 'Innovative'],
  end: 'Solutions',
  tagline: 'Then teach others how to do the same.',
};

export const site = {
  name: 'Adam J. Asis',
  headline: `${hero.lead} ${hero.words.at(-1)} ${hero.end}\n${hero.tagline}`,
  description: 'Lectures, notes, research and development on AI, edge computing, robotics and all things technology.',
  url: 'https://adamasis.com',
  email: 'hello@adamasis.com',
  phone: '',
  bookingUrl: '',
  links: {
    linkedin: 'https://www.linkedin.com/in/adamasis',
    github: 'https://github.com/TheDataStar',
    x: '',
  },
  thesis: '',
  currently: {
    studying: '',
    reading: '',
    building: '',
  },
  upcoming: [] as { date: string; title: string; url?: string }[],
};

export const blurb = (href: string) => sections.find((s) => s.href === href)?.blurb ?? '';

export const sections = [
  { name: 'Profile', note: 'About Me', href: '/profile', blurb: 'Professional CV, experience and credentials.' },
  { name: 'Labs', note: 'Projects', href: '/labs', blurb: 'Personal projects with their development artifacts: links, images, graphics, resources and more.' },
  { name: 'Research', href: '/research', blurb: 'Thought experiments and research, with the data and artifacts that connect them to current Labs and Lectures.' },
  { name: 'Journal', href: '/journal', blurb: 'Opinion pieces, briefs and general thoughts. Mostly thought leadership, mental exercises and daily musings on the changing landscape of technology.' },
  { name: 'Lectures', href: '/lectures', blurb: 'Professional essays, articles and white papers. For the Board Room pieces explain technology for decision-makers; In the Classroom pieces are written for students and new technologists.' },
  { name: 'Library', note: 'Resources & Reviews', href: '/library', blurb: 'A curated list of learning materials, tools and content I have used, recommend or reviewed.' },
  { name: 'Contact', href: '/contact', blurb: 'For speaking, advising, collaboration or a conversation about the work.' },
];

export const topics = {
  ai: { name: 'AI & Machine Learning', blurb: 'Models, methods and what they mean for the people who use them.' },
  edge: { name: 'Edge Computing', blurb: 'Computing where the data is born, not where the data center is.' },
  robotics: { name: 'Robotics', blurb: 'Sensing, simulation and machines that act in the physical world.' },
  data: { name: 'Data Engineering', blurb: 'Pipelines, platforms and the plumbing underneath every model.' },
  networking: { name: 'Networking', blurb: '5G, private networks and how things actually get connected.' },
  access: { name: 'Education & Access', blurb: 'Getting knowledge to people and places that are usually left out.' },
  leadership: { name: 'Leadership & Career', blurb: 'Teams, teaching and building a career without a straight path.' },
} as const;

export type TopicId = keyof typeof topics;
export const topicIds = Object.keys(topics) as [TopicId, ...TopicId[]];
