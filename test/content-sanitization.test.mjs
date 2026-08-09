import test from 'node:test';
import assert from 'node:assert/strict';

import { renderArticleMarkdown } from '../src/shared/content.js';

test('renderArticleMarkdown removes executable HTML and SVG payloads', () => {
  const html = renderArticleMarkdown(`
# Safe heading

<script>alert('script')</script>

<img src="https://example.com/image.png" onerror="alert('image')">

<a href="javascript:alert('link')" onclick="alert('click')">unsafe link</a>

<svg viewBox="0 0 10 10" onload="alert('svg')">
  <foreignObject><div onmouseover="alert('foreign')">unsafe</div></foreignObject>
  <path d="M0 0 L10 10" onclick="alert('path')"></path>
</svg>
`);

  assert.match(html, /<h1>Safe heading<\/h1>/);
  assert.doesNotMatch(html, /<script\b/i);
  assert.doesNotMatch(html, /\son[a-z]+\s*=/i);
  assert.doesNotMatch(html, /javascript:/i);
  assert.doesNotMatch(html, /foreignobject/i);
});

test('renderArticleMarkdown preserves safe figures and inline SVG paths', () => {
  const html = renderArticleMarkdown(`
<figure class="diagram">
  <figcaption>Request flow</figcaption>
  <svg viewBox="0 0 100 40" role="img" aria-label="Request flow">
    <path d="M0 20 L100 20" fill="none" stroke="currentColor"></path>
  </svg>
</figure>
`);

  assert.match(html, /<figure class="diagram">/);
  assert.match(html, /<figcaption>Request flow<\/figcaption>/);
  assert.match(html, /<svg\b[^>]*viewBox="0 0 100 40"/);
  assert.match(html, /<path\b[^>]*d="M0 20 L100 20"/);
  assert.match(html, /stroke="currentColor"/);
});
