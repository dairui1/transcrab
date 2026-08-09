import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { materializePipelineArtifacts, resolveExecutionMode } from '../scripts/translate-orchestrator.mjs';

test('resolveExecutionMode uses auto resolved mode', () => {
  const mode = resolveExecutionMode({ mode: 'auto' }, { resolved: { mode: 'refined' } });
  assert.equal(mode, 'refined');
});

test('materializePipelineArtifacts writes refined artifacts', async () => {
  const out = await fs.mkdtemp(path.join(os.tmpdir(), 'transcrab-artifacts-'));
  const res = await materializePipelineArtifacts({
    outputDir: out,
    markdown: '# Title\n\nBody',
    lang: 'zh',
    profile: { mode: 'auto', audience: 'general', style: 'storytelling' },
    autoProfile: { resolved: { mode: 'refined', audience: 'technical', style: 'technical' } },
    sourceTitle: 'Title',
    sourceUrl: 'https://example.com',
  });

  assert.equal(res.executionMode, 'refined');
  assert.ok(res.artifacts.final.endsWith('/zh.md'));
  assert.ok(res.createdFiles.some((p) => p.endsWith('01-analysis.md')));
  assert.ok(res.createdFiles.some((p) => p.endsWith('03-draft.md')));
  assert.ok(res.createdFiles.some((p) => p.endsWith('04-critique.md')));
  assert.ok(!res.createdFiles.some((p) => p.endsWith('05-revision.md')));

  const prompt = await fs.readFile(path.join(out, '02-prompt.md'), 'utf8');
  assert.match(prompt, /auto-resolved-mode: refined/);

  const draft = await fs.readFile(path.join(out, '03-draft.md'), 'utf8');
  assert.match(draft, /Initial Translation Draft/);

  const critique = await fs.readFile(path.join(out, '04-critique.md'), 'utf8');
  assert.match(critique, /awaiting applied draft/);
  assert.match(critique, /semantic review/);
  assert.doesNotMatch(critique, /TODO/);

  const analysis = await fs.readFile(path.join(out, '01-analysis.md'), 'utf8');
  assert.doesNotMatch(analysis, /TODO/);
});
