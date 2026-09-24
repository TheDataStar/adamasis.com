import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import { unified } from '@astrojs/markdown-remark';
import { notebookMarkdown } from './src/lib/markdown.mjs';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const isDev = process.argv.includes('dev');
const onlineAdmin = Boolean(env.PUBLIC_KEYSTATIC_GITHUB_APP_SLUG);
const admin = isDev || onlineAdmin;

export default defineConfig({
  site: 'https://adamasis.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  redirects: { '/reference/about': '/profile' },
  integrations: [sitemap({ filter: (page) => !page.includes('/keystatic') }), ...(admin ? [react(), keystatic()] : [])],
  ...(onlineAdmin && { adapter: vercel() }),
  markdown: {
    processor: unified({ rehypePlugins: [notebookMarkdown] }),
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
