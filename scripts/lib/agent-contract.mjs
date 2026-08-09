export const AGENT_TASK_SCHEMA = 'transcrab.agent-task';
export const AGENT_TASK_SCHEMA_VERSION = 1;
export const CLI_RESULT_SCHEMA = 'transcrab.cli-result';
export const CLI_RESULT_SCHEMA_VERSION = 1;

export function resultEnvelope(status, payload = {}) {
  return {
    ...payload,
    schema: CLI_RESULT_SCHEMA,
    schemaVersion: CLI_RESULT_SCHEMA_VERSION,
    status,
  };
}

export function installCliErrorHandler() {
  let handled = false;
  const handle = (reason) => {
    if (handled) return;
    handled = true;
    const error = reason instanceof Error ? reason : new Error(String(reason));
    console.error(JSON.stringify(resultEnvelope('error', {
      ok: false,
      error: {
        name: error.name || 'Error',
        code: error.code || null,
        message: error.message || String(error),
      },
    })));
    process.exit(1);
  };

  process.once('uncaughtException', handle);
  process.once('unhandledRejection', handle);
}

export function buildAgentTask({
  slug,
  lang,
  promptFileName = 'translate.prompt.txt',
  promptCompatFileName = null,
  executionMode = 'normal',
} = {}) {
  if (!slug || !lang || !promptFileName) {
    throw new Error('buildAgentTask requires slug, lang, and promptFileName');
  }

  const makeApplyStep = (stage) => {
    const argvTemplate = [
      'node',
      'scripts/apply-translation.mjs',
      slug,
      '--lang',
      lang,
      '--in',
      '{translationFile}',
      '--stage',
      stage,
    ];
    const placeholders = {
      translationFile: {
        type: 'path',
        description: stage === 'draft'
          ? 'Path to the first complete translation'
          : 'Path to the reviewed final translation',
      },
    };

    if (executionMode === 'refined' && stage === 'final') {
      argvTemplate.push('--review-notes', '{reviewNotesFile}');
      placeholders.reviewNotesFile = {
        type: 'path',
        description: 'Path to completed review and revision notes without TODO markers',
      };
    }

    return { stage, argvTemplate, placeholders };
  };

  const applySteps = executionMode === 'refined'
    ? [makeApplyStep('draft'), makeApplyStep('final')]
    : [makeApplyStep('final')];

  return {
    schema: AGENT_TASK_SCHEMA,
    schemaVersion: AGENT_TASK_SCHEMA_VERSION,
    status: 'awaiting_translation',
    kind: 'translate-markdown',
    executionMode,
    workingDirectory: 'repository-root',
    article: {
      slug,
      targetLanguage: lang,
    },
    input: {
      base: 'agent-task-directory',
      promptPath: promptFileName,
      promptCompatPath: promptCompatFileName,
    },
    output: {
      format: 'markdown',
      title: 'First non-empty line must be an H1 heading',
      body: 'One blank line followed by the translated body',
      codeFence: false,
    },
    review: executionMode === 'refined'
      ? {
          required: true,
          afterStage: 'draft',
          inputs: ['source prompt', '03-draft.md', '04-critique.md'],
          criteria: ['factual accuracy', 'terminology', 'markdown integrity', 'readability'],
          evidence: 'Provide a Markdown file through the final apply step reviewNotesFile placeholder',
        }
      : {
          required: false,
        },
    applySteps,
    hostPolicy: {
      translateWithCurrentAgent: true,
      allowNestedAgentCli: false,
    },
  };
}
