import fs from 'node:fs/promises';
import path from 'node:path';

export async function createUniqueArticleDirectory(contentRoot, baseSlug, { maxSuffix = 999 } = {}) {
  await fs.mkdir(contentRoot, { recursive: true });

  for (let index = 1; index <= maxSuffix; index++) {
    const slug = index === 1 ? baseSlug : `${baseSlug}-${index}`;
    const dir = path.join(contentRoot, slug);

    try {
      await fs.mkdir(dir);
      return { slug, dir };
    } catch (error) {
      if (error?.code === 'EEXIST') continue;
      throw error;
    }
  }

  throw new Error(`Unable to allocate a unique article directory for slug: ${baseSlug}`);
}
