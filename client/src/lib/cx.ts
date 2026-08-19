export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

export function withTrailingSlash(path: string): string {
  if (path === '/') return path;
  return path.endsWith('/') ? path : `${path}/`;
}
