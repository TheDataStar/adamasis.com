import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { notebookMarkdown } from './src/lib/markdown.mjs';

export default defineConfig({
  site: 'https://adamasis.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  redirects: { '/reference/about': '/profile' },
  integrations: [sitemap()],
  markdown: {
    processor: unified({ rehypePlugins: [notebookMarkdown] }),
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
