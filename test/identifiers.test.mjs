import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeArticleSlug,
  normalizeHttpUrl,
  normalizeTargetLanguage,
  toPublicHttpUrl,
} from '../scripts/lib/identifiers.mjs';

test('normalizeTargetLanguage accepts common BCP-47-style tags', () => {
  assert.equal(normalizeTargetLanguage('zh'), 'zh');
  assert.equal(normalizeTargetLanguage(' zh-Hans '), 'zh-Hans');
  assert.equal(normalizeTargetLanguage('pt-BR'), 'pt-BR');
});

test('toPublicHttpUrl strips credentials-like query data before persistence', () => {
  assert.equal(
    toPublicHttpUrl('https://example.com/article?utm_source=test&token=secret&X-Amz-Signature=signed#access_token=fragment'),
    'https://example.com/article?utm_source=test'
  );
});

test('normalizeTargetLanguage rejects path-like values', () => {
  assert.throws(() => normalizeTargetLanguage('../secret'), /Invalid target language/);
  assert.throws(() => normalizeTargetLanguage('zh/../../x'), /Invalid target language/);
});

test('normalizeArticleSlug accepts generated slugs and rejects traversal', () => {
  assert.equal(normalizeArticleSlug('example-2026-08-10'), 'example-2026-08-10');
  assert.throws(() => normalizeArticleSlug('../example'), /Invalid article slug/);
});

test('normalizeHttpUrl accepts http URLs and rejects local protocols', () => {
  assert.equal(normalizeHttpUrl('https://example.com/a'), 'https://example.com/a');
  assert.throws(() => normalizeHttpUrl('file:///tmp/source.md'), /Unsupported URL protocol/);
  assert.throws(() => normalizeHttpUrl('not a url'), /Invalid URL/);
  assert.throws(() => normalizeHttpUrl('https://user:secret@example.com/a'), /credentials are not allowed/);
});
