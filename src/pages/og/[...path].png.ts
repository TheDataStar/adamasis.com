import { readFileSync } from 'node:fs';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { site } from '../../site.config';
import { everything, sectionName } from '../../lib/content';

const font = (pkg: string, file: string) => readFileSync(`node_modules/@fontsource/${pkg}/files/${file}`);
const fonts = [
  { name: 'Serif', data: font('source-serif-4', 'source-serif-4-latin-600-normal.woff'), weight: 600 as const },
  { name: 'Mono', data: font('ibm-plex-mono', 'ibm-plex-mono-latin-400-normal.woff'), weight: 400 as const },
];

export async function getStaticPaths() {
  const entries = await everything();
  return [
    { params: { path: 'default' }, props: { eyebrow: 'Notebook', title: site.thesis } },
    ...entries.map((e) => ({
      params: { path: `${e.collection}/${e.id}` },
      props: { eyebrow: sectionName[e.collection], title: e.data.title },
    })),
  ];
}

const el = (type: string, style: object, children: unknown) => ({ type, props: { style, children } });

export async function GET({ props }: { props: { eyebrow: string; title: string } }) {
  const grid = 'rgba(40, 90, 160, 0.09)';
  const svg = await satori(
    el(
      'div',
      {
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '72px 80px 64px 120px', background: '#f7f4ec', color: '#1f1d1a',
        backgroundImage: `linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px)`,
        backgroundSize: '32px 32px', borderLeft: '3px solid rgba(176, 57, 46, 0.55)',
      },
      [
        el('div', { fontFamily: 'Mono', fontSize: 26, color: '#b0392e', letterSpacing: 2, textTransform: 'uppercase' }, props.eyebrow),
        el('div', { fontFamily: 'Serif', fontSize: props.title.length > 70 ? 56 : 68, lineHeight: 1.15, maxWidth: 960 }, props.title),
        el('div', { display: 'flex', justifyContent: 'space-between', fontFamily: 'Mono', fontSize: 24, color: '#55514a' }, [
          el('span', {}, site.name),
          el('span', {}, new URL(site.url).host),
        ]),
      ],
    ) as never,
    { width: 1200, height: 630, fonts },
  );
  const png = new Resvg(svg).render().asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
}
