import test from 'node:test';
import assert from 'node:assert/strict';
import { lintTranslation, autoFixTranslation } from '../scripts/lint-translation.mjs';

test('lintTranslation detects problematic Chinese punctuation patterns', () => {
  const md = '# T\n\n问题是？ 这是一段 text: with 中文?\n';
  const report = lintTranslation(md);
  assert.ok(report.issues.some((x) => x.code === 'cn-question-colon-pattern'));
  assert.ok(report.issues.some((x) => x.code === 'ascii-punctuation-near-cjk'));
});

test('autoFixTranslation normalizes common punctuation and phrase', () => {
  const md = '# T\n\n问题是？ 这是一段 text: with 中文?\n';
  const fixed = autoFixTranslation(md);
  assert.match(fixed.text, /问题在于：/);
  assert.match(fixed.text, /中文？/);
  assert.equal(fixed.changed, true);
});

test('lint and auto-fix leave code spans, fences, and link destinations unchanged', () => {
  const md = [
    '# T',
    '',
    '正文问题是? `const value = "中文?"` [链接](https://example.com/中文?x=1)',
    '',
    '```js',
    'const value = "中文?";',
    '```',
    '',
    '    const indented = "中文?";',
    '',
  ].join('\n');

  const fixed = autoFixTranslation(md);
  assert.match(fixed.text, /正文问题在于：/);
  assert.match(fixed.text, /`const value = "中文\?"`/);
  assert.match(fixed.text, /https:\/\/example\.com\/中文\?x=1/);
  assert.match(fixed.text, /```js\nconst value = "中文\?";\n```/);
  assert.match(fixed.text, /    const indented = "中文\?";/);

  const report = lintTranslation(md);
  assert.equal(report.issues.filter((issue) => issue.excerpt === '中文?').length, 0);
});
