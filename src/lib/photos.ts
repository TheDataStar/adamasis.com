import { existsSync } from 'node:fs';

export const photo = (path?: string) => (path && existsSync(`public${path}`) ? path : null);
