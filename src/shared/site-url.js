export function withBase(pathname = '/', base = '/') {
  const cleanBase = String(base || '/').replace(/^\/+|\/+$/g, '');
  const root = cleanBase ? `/${cleanBase}/` : '/';
  const suffix = String(pathname || '/').replace(/^\/+/, '');
  return suffix ? `${root}${suffix}` : root;
}
