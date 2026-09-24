export const site = {
  name: 'Adam J. Asis',
  headline: 'I study, build and write about AI, edge computing and robotics.',
  intro:
    'This site is my working notebook. It is where I publish what I am learning, building and researching, from short lab notes to long-form lectures, so the thinking happens in the open and anyone can follow along.',
  description: 'Lectures, notes, research and development on AI, edge computing, robotics and all things technology.',
  url: 'https://adamasis.com',
  email: 'hello@adamasis.com',
  phone: '',
  bookingUrl: '',
  links: {
    linkedin: 'https://www.linkedin.com/in/adamasis',
    github: 'https://github.com/TheDataStar',
  },
  thesis: '',
  currently: {
    studying: '',
    reading: '',
    building: '',
  },
  upcoming: [] as { date: string; title: string; url?: string }[],
};

export const sections = [
  { name: 'Profile', href: '/profile', plain: 'About me', blurb: 'Who I am, what I have done and where I am headed: experience, skills and credentials in one place.' },
  { name: 'Lectures', href: '/lectures', plain: 'Long-form essays', blurb: 'In-depth writing. For the Room pieces explain a technology for decision-makers; Teardowns take a product or claim apart to see how it really works.' },
  { name: 'Lab Journal', href: '/journal', plain: 'Short notes', blurb: 'Brief, dated entries from whatever I am studying or building, each marked by how sure I am: hypothesis, testing or confirmed.' },
  { name: 'Labs', href: '/labs', plain: 'Projects and case studies', blurb: 'The work behind the writing: projects I build and own, and case studies from my career.' },
  { name: 'Research', href: '/research', plain: 'Long-term questions', blurb: 'The questions I plan to spend years on, each with its research questions, evidence and revision history.' },
  { name: 'Library', href: '/library', plain: 'Recommended resources', blurb: 'Books, papers, videos, courses and tools that shaped my thinking, with a note on why each one is here.' },
  { name: 'Contact', href: '/contact', plain: 'Get in touch', blurb: 'For speaking, advising, collaboration or a conversation about the work.' },
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
