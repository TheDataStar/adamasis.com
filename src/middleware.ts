import { defineMiddleware } from 'astro:middleware';

const owners = ['thedatastar'];

// The GitHub App's Client ID. It is public (it appears in every sign-in URL), so it is
// safe to keep here. It is used when the KEYSTATIC_GITHUB_CLIENT_ID variable holds
// something else, such as the client secret.
const knownClientId = 'Iv23limHswDvhJwfpGBn';

// Repair swapped or misfiled GitHub App credentials before Keystatic reads them.
// A Client ID starts with "Iv"; a client secret is 40 hex characters.
function repairGitHubCredentials() {
  const env = process.env;
  const values = [env.KEYSTATIC_GITHUB_CLIENT_ID, env.KEYSTATIC_GITHUB_CLIENT_SECRET].map((v) => v?.trim() ?? '');
  const id = values.find((v) => v.startsWith('Iv')) || knownClientId;
  const secret = values.find((v) => /^[0-9a-f]{40}$/i.test(v));
  if (id && id !== env.KEYSTATIC_GITHUB_CLIENT_ID) env.KEYSTATIC_GITHUB_CLIENT_ID = id;
  if (secret && secret !== env.KEYSTATIC_GITHUB_CLIENT_SECRET) env.KEYSTATIC_GITHUB_CLIENT_SECRET = secret;
}
repairGitHubCredentials();
const open = ['login', 'oauth/callback', 'refresh-token', 'logout', 'created-app', 'repo-not-found'].map(
  (p) => `/api/keystatic/github/${p}`,
);
const known = new Map<string, string>();

async function loginFor(token: string) {
  if (known.has(token)) return known.get(token);
  const res = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'adamasis.com' },
  });
  const login = res.ok ? String((await res.json()).login).toLowerCase() : '';
  if (login) known.set(token, login);
  return login;
}

export const onRequest = defineMiddleware(async ({ url, cookies }, next) => {
  const path = url.pathname;
  const admin = path === '/keystatic' || path.startsWith('/keystatic/') || path.startsWith('/api/keystatic/');
  if (!admin || open.some((p) => path.startsWith(p))) return next();

  const token = cookies.get('keystatic-gh-access-token')?.value;
  if (!token) return next();

  const login = await loginFor(token);
  if (login && owners.includes(login)) return next();

  cookies.delete('keystatic-gh-access-token', { path: '/' });
  cookies.delete('keystatic-gh-refresh-token', { path: '/' });
  return new Response('Not authorized.', { status: 403 });
});
