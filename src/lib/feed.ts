import rss from '@astrojs/rss';
import { site } from '../site.config';
import { lectures, journal, urlOf, dateOf } from './content';

export async function feed(context: { site?: URL }, which: 'all' | 'lectures' | 'journal') {
  const items = [
    ...(which !== 'journal' ? await lectures() : []),
    ...(which !== 'lectures' ? await journal() : []),
  ]
    .filter((e) => !e.data.draft)
    .sort((a, b) => dateOf(b).getTime() - dateOf(a).getTime());

  const label = { all: 'Notebook', lectures: 'Lectures', journal: 'Lab Journal' }[which];
  return rss({
    title: `${site.name}: ${label}`,
    description: site.description,
    site: context.site ?? site.url,
    items: items.map((e) => ({
      title: e.data.title,
      description: e.data.summary,
      pubDate: dateOf(e),
      link: urlOf(e),
      categories: e.data.tags,
    })),
  });
}
