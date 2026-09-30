import rss from '@astrojs/rss';
import { site } from '../site.config';
import { lectures, journal, labs, papers, urlOf, dateOf } from './content';

type Which = 'all' | 'lectures' | 'journal' | 'devto';

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const absolute = (html: string) => html.replace(/(href|src)="\/(?!\/)/g, `$1="${site.url}/`);

function fullHtml(e: Awaited<ReturnType<typeof everythingShareable>>[number]) {
  const url = new URL(urlOf(e), site.url).href;
  let html = (e.rendered?.html ?? '').replace(/<span class="sidenote"[^>]*>[\s\S]*?<\/span>/g, '');
  if (e.collection === 'lectures') {
    const label = e.data.format === 'for-the-room' ? 'For the Board Room' : 'In Brief';
    const paras = e.data.forTheRoom.split(/\n\s*\n/).map((p: string) => `<p>${escape(p.trim())}</p>`).join('');
    html = `<blockquote><p><strong>${label}</strong></p>${paras}</blockquote>${html}`;
  }
  html += `<hr /><p><em>Originally published at <a href="${url}">${url.replace('https://', '')}</a>.</em></p>`;
  return absolute(html);
}

const devTags = (e: { data: { tags: string[]; topics: string[] } }) =>
  [...new Set([...e.data.tags, ...e.data.topics].map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean))].slice(0, 4);

async function everythingShareable() {
  return [...(await lectures()), ...(await journal()), ...(await labs()), ...(await papers())];
}

export async function feed(context: { site?: URL }, which: Which) {
  const pool =
    which === 'devto'
      ? (await everythingShareable()).filter((e) => (e.data.shareTo ?? []).includes('devto') && dateOf(e).getTime() > 0)
      : [...(which !== 'journal' ? await lectures() : []), ...(which !== 'lectures' ? await journal() : [])];

  const items = pool.filter((e) => !e.data.draft).sort((a, b) => dateOf(b).getTime() - dateOf(a).getTime());
  const label = { all: 'Everything', lectures: 'Lectures', journal: 'Journal', devto: 'DEV' }[which];

  return rss({
    title: `${site.name}: ${label}`,
    description: site.description,
    site: context.site ?? site.url,
    trailingSlash: false,
    items: items.map((e) => ({
      title: e.data.title,
      description: e.data.summary,
      pubDate: dateOf(e),
      link: urlOf(e),
      categories: which === 'devto' ? devTags(e) : e.data.tags,
      content: fullHtml(e),
    })),
  });
}
