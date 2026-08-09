import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AGENT_TASK_SCHEMA,
  AGENT_TASK_SCHEMA_VERSION,
  CLI_RESULT_SCHEMA,
  CLI_RESULT_SCHEMA_VERSION,
  buildAgentTask,
  resultEnvelope,
} from '../scripts/lib/agent-contract.mjs';

test('resultEnvelope adds a stable version and status', () => {
  assert.deepEqual(resultEnvelope('prepared', { slug: 'example', schemaVersion: 99, status: 'wrong' }), {
    slug: 'example',
    schema: CLI_RESULT_SCHEMA,
    schemaVersion: CLI_RESULT_SCHEMA_VERSION,
    status: 'prepared',
  });
});

test('buildAgentTask describes a host-neutral refined workflow', () => {
  const task = buildAgentTask({
    slug: 'example',
    lang: 'zh-Hans',
    promptFileName: 'translate.prompt.txt',
    executionMode: 'refined',
  });

  assert.equal(task.schema, AGENT_TASK_SCHEMA);
  assert.equal(task.schemaVersion, AGENT_TASK_SCHEMA_VERSION);
  assert.equal(task.status, 'awaiting_translation');
  assert.equal(task.executionMode, 'refined');
  assert.equal(task.workingDirectory, 'repository-root');
  assert.deepEqual(task.article, { slug: 'example', targetLanguage: 'zh-Hans' });
  assert.deepEqual(task.input, {
    base: 'agent-task-directory',
    promptPath: 'translate.prompt.txt',
    promptCompatPath: null,
  });
  assert.equal(task.review.required, true);
  assert.equal(task.review.afterStage, 'draft');
  assert.deepEqual(task.applySteps.map((step) => step.stage), ['draft', 'final']);
  assert.equal(task.applySteps[0].argvTemplate.includes('{translationFile}'), true);
  assert.equal(task.applySteps[0].placeholders.translationFile.type, 'path');
  assert.equal(task.applySteps[1].argvTemplate.includes('{reviewNotesFile}'), true);
  assert.equal(task.applySteps[1].placeholders.reviewNotesFile.type, 'path');
  assert.equal(task.hostPolicy.translateWithCurrentAgent, true);
  assert.equal(task.hostPolicy.allowNestedAgentCli, false);
  assert.doesNotMatch(JSON.stringify(task), new RegExp(process.cwd().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('buildAgentTask uses only the final apply step outside refined mode', () => {
  const task = buildAgentTask({
    slug: 'example',
    lang: 'en',
    promptFileName: 'prompt.txt',
    executionMode: 'normal',
  });

  assert.deepEqual(task.applySteps.map((step) => step.stage), ['final']);
  assert.equal(task.review.required, false);
});
