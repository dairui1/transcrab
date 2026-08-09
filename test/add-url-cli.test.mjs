import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

test('add-url.mjs returns a versioned error for invalid input', () => {
  const script = path.resolve('scripts/add-url.mjs');
  const result = spawnSync(process.execPath, [script, 'file:///tmp/source.md'], {
    encoding: 'utf8',
  });

  assert.notEqual(result.status, 0);
  const payload = JSON.parse(result.stderr.trim());
  assert.equal(payload.schema, 'transcrab.cli-result');
  assert.equal(payload.schemaVersion, 1);
  assert.equal(payload.status, 'error');
  assert.equal(payload.ok, false);
  assert.match(payload.error.message, /Unsupported URL protocol/);
});
