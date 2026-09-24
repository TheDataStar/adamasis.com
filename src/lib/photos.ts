import { existsSync } from 'node:fs';

export const photo = (file?: string) =>
  file && existsSync(`public/images/profile/${file}`) ? `/images/profile/${file}` : null;
