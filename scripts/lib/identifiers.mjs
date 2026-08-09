export function normalizeTargetLanguage(value = 'zh') {
  const lang = String(value || '').trim();
  if (!/^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/.test(lang)) {
    throw new Error(`Invalid target language: ${value}. Use a BCP-47-style tag such as zh, en-US, or zh-Hans.`);
  }
  return lang;
}

export function normalizeArticleSlug(value) {
  const slug = String(value || '').trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`Invalid article slug: ${value}`);
  }
  return slug;
}

export function normalizeHttpUrl(value) {
  let url;
  try {
    url = new URL(String(value || '').trim());
  } catch {
    throw new Error(`Invalid URL: ${value}`);
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(`Unsupported URL protocol: ${url.protocol}. Use http or https.`);
  }
  if (url.username || url.password) {
    throw new Error('URL credentials are not allowed.');
  }

  return url.toString();
}

export function toPublicHttpUrl(value) {
  const url = new URL(normalizeHttpUrl(value));
  const sensitiveName = /^(?:access[_-]?token|api[_-]?key|auth|authorization|code|credential|jwt|key|key-pair-id|password|passwd|policy|secret|session|sessionid|sig|signature|token|x-amz-.+|x-goog-.+)$/i;

  for (const name of [...url.searchParams.keys()]) {
    if (sensitiveName.test(name)) url.searchParams.delete(name);
  }
  url.hash = '';
  return url.toString();
}
