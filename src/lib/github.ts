const cache = new Map<string, Promise<{ pushed?: Date; stars?: number } | null>>();

export function repoActivity(repoUrl: string) {
  const match = repoUrl.match(/github\.com\/([^/]+\/[^/#?]+)/);
  if (!match) return Promise.resolve(null);
  if (!cache.has(match[1])) {
    cache.set(
      match[1],
      fetch(`https://api.github.com/repos/${match[1]}`, { signal: AbortSignal.timeout(4000) })
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => (j ? { pushed: new Date(j.pushed_at), stars: j.stargazers_count } : null))
        .catch(() => null),
    );
  }
  return cache.get(match[1])!;
}
