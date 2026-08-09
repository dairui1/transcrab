import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { resolveJinaRunner } from '../scripts/lib/source-resolver.mjs';

function makeExecutable(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, '#!/usr/bin/env sh\n', 'utf8');
  fs.chmodSync(filePath, 0o755);
}

test('resolveJinaRunner resolves configured absolute and relative paths', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'transcrab-jina-path-'));
  const runner = path.join(tmp, 'bin', 'run-jina.sh');
  makeExecutable(runner);

  assert.equal(
    resolveJinaRunner({
      env: { TRANSCRAB_JINA_RUNNER: runner, PATH: '' },
      cwd: tmp,
    }),
    runner
  );
  assert.equal(
    resolveJinaRunner({
      env: { TRANSCRAB_JINA_RUNNER: path.join('bin', 'run-jina.sh'), PATH: '' },
      cwd: tmp,
    }),
    runner
  );
});

test('resolveJinaRunner accepts a configured PATH command before jina', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'transcrab-jina-command-'));
  makeExecutable(path.join(tmp, 'custom-jina'));
  makeExecutable(path.join(tmp, 'jina'));

  assert.equal(
    resolveJinaRunner({
      env: { TRANSCRAB_JINA_RUNNER: 'custom-jina', PATH: tmp },
      cwd: os.tmpdir(),
    }),
    'custom-jina'
  );
});

test('resolveJinaRunner falls back to jina on PATH', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'transcrab-jina-fallback-'));
  makeExecutable(path.join(tmp, 'jina'));

  assert.equal(
    resolveJinaRunner({ env: { PATH: tmp }, cwd: os.tmpdir() }),
    'jina'
  );
  assert.equal(
    resolveJinaRunner({
      env: { TRANSCRAB_JINA_RUNNER: 'missing-runner', PATH: tmp },
      cwd: os.tmpdir(),
    }),
    'jina'
  );
});

test('resolveJinaRunner returns null when no runner is available', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'transcrab-jina-missing-'));

  assert.equal(
    resolveJinaRunner({
      env: { TRANSCRAB_JINA_RUNNER: 'missing-runner', PATH: '' },
      cwd: tmp,
    }),
    null
  );
});

test('resolveJinaRunner honors PATHEXT on Windows hosts', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'transcrab-jina-windows-'));
  const runner = path.join(tmp, 'jina.EXE');
  fs.writeFileSync(runner, '', 'utf8');

  assert.equal(
    resolveJinaRunner({
      env: { PATH: tmp, PATHEXT: '.EXE;.CMD' },
      cwd: tmp,
      platform: 'win32',
    }),
    runner
  );

  const commandShim = path.join(tmp, 'custom-jina.CMD');
  fs.writeFileSync(commandShim, '@echo off\r\n', 'utf8');
  assert.equal(
    resolveJinaRunner({
      env: { TRANSCRAB_JINA_RUNNER: 'custom-jina', PATH: tmp, PATHEXT: '.EXE;.CMD' },
      cwd: tmp,
      platform: 'win32',
    }),
    commandShim
  );
});
