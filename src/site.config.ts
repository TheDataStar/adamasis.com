export const site = {
  name: 'Your Name',
  role: '[Your professional title, e.g. Engineer and Researcher]',
  headline: '[One line on who you are and what you work on. Keep it under 15 words.]',
  description: '[One or two sentences describing the site. This is what search engines show under your name.]',
  url: 'https://adamasis.com',
  email: 'you@yourdomain.com',
  phone: '999.999.9999',
  bookingUrl: 'https://cal.example.com/your-link',
  links: {
    linkedin: 'https://www.linkedin.com/in/your-handle',
    github: 'https://github.com/your-handle',
  },
  thesis: '[Your thesis: the one belief that ties all of your work together, in a single sentence.]',
  currently: {
    studying: '[The course, degree or subject you are studying now]',
    reading: '[The book or paper you are reading now]',
    building: '[The project you are building now]',
  },
  upcoming: [
    { date: 'Month DD', title: '[A talk, office hours, workshop or publication date]', url: '/contact' },
  ] as { date: string; title: string; url?: string }[],
};

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
