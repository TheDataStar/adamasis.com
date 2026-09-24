export const site = {
  name: 'Adam J. Asis',
  headline: 'I study, build and write about AI, edge computing and robotics.',
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
