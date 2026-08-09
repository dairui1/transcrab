import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CANONICAL_SKILL = path.join(ROOT, 'skills', 'transcrab', 'SKILL.md');
const PROJECT_SKILL = path.join(ROOT, '.agents', 'skills', 'transcrab', 'SKILL.md');

test('canonical and project-discovery Agent Skills stay in sync', async () => {
  const [canonical, project] = await Promise.all([
    fs.readFile(CANONICAL_SKILL, 'utf8'),
    fs.readFile(PROJECT_SKILL, 'utf8'),
  ]);

  assert.equal(project, canonical);
});

test('TransCrab skill has portable Agent Skills frontmatter', async () => {
  const skill = await fs.readFile(CANONICAL_SKILL, 'utf8');
  const match = skill.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(match, 'SKILL.md must start with YAML frontmatter');

  const frontmatter = match[1];
  assert.match(frontmatter, /^name: transcrab$/m);
  assert.match(frontmatter, /^description: .+$/m);
  assert.match(frontmatter, /^license: MIT$/m);
  assert.doesNotMatch(frontmatter, /^\s+openclaw:/m);
  assert.match(skill, /OpenClaw, Hermes, Codex/);
  assert.match(skill, /Never start `openclaw`, `hermes`, `codex`/);
});

test('run-crab wrapper works outside the repository directory', {
  skip: process.platform === 'win32' ? 'POSIX convenience wrapper' : false,
}, () => {
  const result = spawnSync(
    'bash',
    [path.join(ROOT, 'scripts', 'run-crab.sh'), '--help'],
    { cwd: os.tmpdir(), encoding: 'utf8' }
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Usage:/);
  assert.match(result.stdout, /host-neutral translation task/);
});
