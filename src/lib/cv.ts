import { existsSync } from 'node:fs';
import { site } from '../site.config';

// The CV uploaded in Site settings, or a public/cv.pdf added by hand.
export const cvPath = () => {
  if (site.cv && existsSync(`public${site.cv}`)) return site.cv;
  return existsSync('public/cv.pdf') ? '/cv.pdf' : null;
};
