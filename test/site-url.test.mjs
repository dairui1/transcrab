import test from 'node:test';
import assert from 'node:assert/strict';
import { withBase } from '../src/shared/site-url.js';

test('withBase keeps root deployments unchanged', () => {
  assert.equal(withBase('/about/', '/'), '/about/');
  assert.equal(withBase('/', '/'), '/');
});

test('withBase prefixes repository-site deployments exactly once', () => {
  assert.equal(withBase('/a/2026/08/story/', '/transcrab/'), '/transcrab/a/2026/08/story/');
  assert.equal(withBase('favicon-32.png', 'transcrab'), '/transcrab/favicon-32.png');
});
