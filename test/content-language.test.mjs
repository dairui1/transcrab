import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { resolveArticleMarkdownPath } from '../src/shared/content.js';

test('resolveArticleMarkdownPath selects the language recorded in meta.json', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'transcrab-content-lang-'));
  const dir = path.join(root, 'article');
  await fs.mkdir(dir);
  await fs.writeFile(path.join(dir, 'meta.json'), JSON.stringify({ targetLang: 'en-US' }));
  await fs.writeFile(path.join(dir, 'en-US.md'), '# English\n');

  assert.deepEqual(await resolveArticleMarkdownPath(root, 'article'), {
    filePath: path.join(dir, 'en-US.md'),
    lang: 'en-US',
  });
});

test('resolveArticleMarkdownPath falls back to zh for invalid or incomplete metadata', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'transcrab-content-fallback-'));
  const invalidDir = path.join(root, 'invalid');
  const missingDir = path.join(root, 'missing');
  await fs.mkdir(invalidDir);
  await fs.mkdir(missingDir);
  await fs.writeFile(path.join(invalidDir, 'meta.json'), JSON.stringify({ targetLang: '../secret' }));
  await fs.writeFile(path.join(invalidDir, 'zh.md'), '# Chinese\n');
  await fs.writeFile(path.join(missingDir, 'meta.json'), JSON.stringify({ targetLang: 'en' }));
  await fs.writeFile(path.join(missingDir, 'zh.md'), '# Chinese\n');

  assert.equal((await resolveArticleMarkdownPath(root, 'invalid')).lang, 'zh');
  assert.equal((await resolveArticleMarkdownPath(root, 'missing')).lang, 'zh');
});

test('resolveArticleMarkdownPath accepts legacy directory names but rejects traversal', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'transcrab-content-legacy-'));
  const dir = path.join(root, 'Legacy_文章');
  await fs.mkdir(dir);
  await fs.writeFile(path.join(dir, 'zh.md'), '# Legacy\n');

  assert.equal((await resolveArticleMarkdownPath(root, 'Legacy_文章')).filePath, path.join(dir, 'zh.md'));
  await assert.rejects(() => resolveArticleMarkdownPath(root, '../secret'), /Invalid article directory/);
});
