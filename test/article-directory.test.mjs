import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createUniqueArticleDirectory } from '../scripts/lib/article-directory.mjs';

test('createUniqueArticleDirectory allocates unique slugs atomically', async () => {
  const contentRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'transcrab-slugs-'));
  const allocated = await Promise.all(
    Array.from({ length: 5 }, () => createUniqueArticleDirectory(contentRoot, 'same-title'))
  );

  assert.deepEqual(
    allocated.map(({ slug }) => slug).sort(),
    ['same-title', 'same-title-2', 'same-title-3', 'same-title-4', 'same-title-5']
  );
});
