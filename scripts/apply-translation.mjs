#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { lintTranslation, autoFixTranslation } from './lint-translation.mjs';
import { restoreInlineSvgFigurePlaceholders } from './lib/inline-svg-placeholders.mjs';
import {
  AGENT_TASK_SCHEMA,
  AGENT_TASK_SCHEMA_VERSION,
  installCliErrorHandler,
  resultEnvelope,
} from './lib/agent-contract.mjs';
import { normalizeArticleSlug, normalizeTargetLanguage } from './lib/identifiers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const CONTENT_ROOT = process.env.TRANSCRAB_CONTENT_ROOT
  ? path.resolve(process.env.TRANSCRAB_CONTENT_ROOT)
  : path.join(ROOT, 'content', 'articles');

installCliErrorHandler();

function usage() {
  console.log(`Usage:
  node scripts/apply-translation.mjs <slug> [--lang zh] [--in <file>] [--stage draft|final] [--review-notes <file>]

Input format (recommended):
  - First line: a translated title as an H1 heading (starts with '# ')
  - Blank line
  - Then the translated body (do not repeat the title)

Stage behavior:
  - draft: write/refresh 03-draft.md (+ 04-critique.md for refined flow), do NOT publish zh.md
  - final: write <lang>.md; refined flow also requires --review-notes and writes 05-revision.md

Notes:
  - This script does not translate. Translation is performed by the active agent.
`);
}

function argValue(args, key, def = null) {
  const idx = args.indexOf(key);
  if (idx >= 0 && idx + 1 < args.length) return args[idx + 1];
  return def;
}

function normalizeEmphasisSpacing(md) {
  const text = String(md || '');
  const lines = text.split(/\r?\n/);
  let inFence = false;
  let fenceToken = null;

  const normalizeOutsideInlineCode = (s) => {
    const parts = s.split(/(`+)/);
    let out = '';
    let inInline = false;

    for (const p of parts) {
      if (/^`+$/.test(p)) {
        inInline = !inInline;
        out += p;
        continue;
      }

      if (inInline) {
        out += p;
        continue;
      }

      const edgeWs = /^[\t \u00A0\u3000]+|[\t \u00A0\u3000]+$/g;
      out += p.replace(/\*\*([\s\S]*?)\*\*/g, (_m, inner) => {
        const t = String(inner).replace(edgeWs, '');
        return `**${t}**`;
      });
    }

    return out;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/^(```+|~~~+)(.*)$/);
    if (m) {
      const token = m[1];
      if (!inFence) {
        inFence = true;
        fenceToken = token;
      } else if (token === fenceToken) {
        inFence = false;
        fenceToken = null;
      }
      continue;
    }

    if (!inFence) lines[i] = normalizeOutsideInlineCode(line);
  }

  return lines.join('\n');
}

function quickCritiqueMarkdown(md) {
  const lines = String(md || '').split(/\r?\n/);
  const codeFenceCount = lines.filter((l) => /^```/.test(l.trim())).length;
  const badEmphasis = /\*\*\s+[^*]|[^*]\s+\*\*/.test(md);
  const tableRows = lines.filter((l) => /^\|.+\|\s*$/.test(l)).length;
  const hasH1 = /^#\s+.+/m.test(md);

  const items = [
    `- has-h1: ${hasH1 ? 'PASS' : 'WARN (建议包含 H1 译文标题)'}`,
    `- code-fence-balanced: ${codeFenceCount % 2 === 0 ? 'PASS' : 'WARN (代码块围栏数量为奇数)'}`,
    `- emphasis-spacing: ${badEmphasis ? 'WARN (检测到可能的 ** 空白问题)' : 'PASS'}`,
    `- table-rows: ${tableRows > 0 ? `INFO (${tableRows})` : 'INFO (none)'}`,
  ];

  return [
    '# Critique Notes',
    '',
    ...items,
    '',
    '- factual accuracy: NOT CHECKED automatically; active-agent review required',
    '- terminology drift: NOT CHECKED automatically; active-agent review required',
    '- readability: NOT CHECKED automatically; active-agent review required',
    '',
  ].join('\n');
}

async function readStdin() {
  return await new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => (data += c));
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

async function loadExecutionMode(dir) {
  const profilePath = path.join(dir, 'translation.profile.json');
  const json = await readOptionalJson(profilePath, 'translation profile');
  if (json === null) return 'normal';
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    throw new Error(`Invalid translation profile at: ${profilePath}`);
  }
  const mode = json.executionMode || json.profile?.executionMode || 'normal';
  if (!['quick', 'normal', 'refined'].includes(mode)) {
    throw new Error(`Invalid execution mode in translation profile: ${mode}`);
  }
  return mode;
}

async function loadInlineSvgPlaceholders(dir) {
  const p = path.join(dir, 'inline-svg.placeholders.json');
  const arr = await readOptionalJson(p, 'inline SVG placeholders');
  if (arr === null) return [];
  if (!Array.isArray(arr)) {
    throw new Error(`Inline SVG placeholders must be an array at: ${p}`);
  }
  if (!arr.every((item) =>
    item && typeof item === 'object' &&
    /^@@FIGURE_SVG_\d{3,}@@$/.test(String(item.id || '')) &&
    typeof item.html === 'string' && item.html.trim()
  )) {
    throw new Error(`Inline SVG placeholders contain invalid entries at: ${p}`);
  }
  return arr;
}

async function readOptionalJson(filePath, label) {
  let raw;
  try {
    raw = await fs.readFile(filePath, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw new Error(`Cannot read ${label} at ${filePath}: ${error?.message || error}`);
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Invalid ${label} JSON at ${filePath}: ${error?.message || error}`);
  }
}

async function hasAppliedDraft(dir) {
  try {
    const draft = (await fs.readFile(path.join(dir, '03-draft.md'), 'utf8')).trim();
    if (!/^#\s+\S+/m.test(draft)) return false;
    if (/Put the first complete translation here/.test(draft)) return false;
    const body = draft.replace(/^#\s+.*$/m, '').trim();
    return body.length > 0;
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
}

async function loadAgentTask(dir) {
  const taskPath = path.join(dir, 'agent-task.json');
  const task = await readOptionalJson(taskPath, 'agent task');
  if (task === null) return { taskPath, task: null };
  if (!task || typeof task !== 'object' || Array.isArray(task)) {
    throw new Error(`Invalid agent task at: ${taskPath}`);
  }
  if (task.schema !== AGENT_TASK_SCHEMA || task.schemaVersion !== AGENT_TASK_SCHEMA_VERSION) {
    throw new Error(`Unsupported agent task schema at: ${taskPath}`);
  }
  return { taskPath, task };
}

async function loadExpectedTargetLanguage(dir, task) {
  const metaPath = path.join(dir, 'meta.json');
  const meta = await readOptionalJson(metaPath, 'article metadata');
  if (meta !== null && (!meta || typeof meta !== 'object' || Array.isArray(meta))) {
    throw new Error(`Invalid article metadata at: ${metaPath}`);
  }

  const candidates = [
    meta?.targetLang ? normalizeTargetLanguage(meta.targetLang) : null,
    task?.article?.targetLanguage ? normalizeTargetLanguage(task.article.targetLanguage) : null,
  ].filter(Boolean);

  if (new Set(candidates).size > 1) {
    throw new Error(`Target language mismatch between meta.json and agent-task.json: ${candidates.join(' != ')}`);
  }
  return candidates[0] || null;
}

function validateAgentTaskTransition(task, stage) {
  if (!task) return;
  if (!['awaiting_translation', 'draft_applied', 'complete'].includes(task.status)) {
    throw new Error(`Invalid agent task status: ${task.status}`);
  }

  const completedStages = Array.isArray(task.completedStages) ? task.completedStages : [];
  if (completedStages.includes('final') && task.status !== 'complete') {
    throw new Error('Agent task state is inconsistent: final is completed but status is not complete.');
  }
  if (task.status === 'awaiting_translation' && completedStages.length > 0) {
    throw new Error('Agent task state is inconsistent: awaiting translation already has completed stages.');
  }
  if (task.status === 'draft_applied' && !completedStages.includes('draft')) {
    throw new Error('Agent task state is inconsistent: draft_applied is missing the draft stage.');
  }
  if (task.status === 'complete' && !completedStages.includes('final')) {
    throw new Error('Agent task state is inconsistent: complete is missing the final stage.');
  }
  if (stage === 'draft' && task.status === 'complete') {
    throw new Error('Cannot apply a draft after the agent task is complete.');
  }
}

async function updateAgentTaskStatus({ taskPath, task }, status, completedStage) {
  if (task === null) return null;

  const completedStages = new Set(Array.isArray(task.completedStages) ? task.completedStages : []);
  completedStages.add(completedStage);
  task.status = status;
  task.completedStages = [...completedStages];
  task.updatedAt = new Date().toISOString();

  const tempPath = `${taskPath}.${process.pid}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(task, null, 2) + '\n', 'utf8');
  await fs.rename(tempPath, taskPath);
  return taskPath;
}

const args = process.argv.slice(2);
if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
  usage();
  process.exit(args.length === 0 ? 2 : 0);
}

const slug = normalizeArticleSlug(args[0]);
const lang = normalizeTargetLanguage(argValue(args, '--lang', 'zh'));
const inFile = argValue(args, '--in', null);
const reviewNotesFile = argValue(args, '--review-notes', null);
const stage = String(argValue(args, '--stage', 'final')).toLowerCase();
if (!['draft', 'final'].includes(stage)) {
  throw new Error(`Invalid --stage: ${stage}. Allowed: draft|final`);
}

const dir = path.join(CONTENT_ROOT, slug);
const agentTaskState = await loadAgentTask(dir);
const expectedLang = await loadExpectedTargetLanguage(dir, agentTaskState.task);
if (expectedLang && lang !== expectedLang) {
  throw new Error(`Target language mismatch: task expects ${expectedLang}, received ${lang}.`);
}
validateAgentTaskTransition(agentTaskState.task, stage);
const sourcePath = path.join(dir, 'source.md');
const source = await fs.readFile(sourcePath, 'utf-8').catch(() => {
  throw new Error(`Missing source.md at: ${sourcePath}`);
});

const srcParsed = matter(source);
const fm = srcParsed.data || {};

let translated = inFile ? await fs.readFile(path.resolve(inFile), 'utf-8') : await readStdin();
translated = (translated || '').trim();
if (!translated) throw new Error('No translated markdown provided. Use --in <file> or pipe via stdin.');

translated = translated
  .replace(/^```[a-zA-Z]*\n/, '')
  .replace(/\n```\s*$/, '')
  .trim() + '\n';

translated = normalizeEmphasisSpacing(translated);

const inlineSvgPlaceholders = await loadInlineSvgPlaceholders(dir);
// Quality gate phase A: deterministic lint + auto-fix for common Chinese punctuation issues.
const useChinesePunctuationRules = /^zh(?:-|$)/i.test(lang);
const skippedLint = { ok: true, score: 100, issues: [], skipped: 'non-Chinese target language' };
const lintBefore = useChinesePunctuationRules ? lintTranslation(translated) : skippedLint;
const fixed = useChinesePunctuationRules
  ? autoFixTranslation(translated)
  : { text: translated, changed: false, before: translated, after: translated };
translated = fixed.text;
const lintAfter = useChinesePunctuationRules ? lintTranslation(translated) : skippedLint;

// Restore source HTML only after prose linting so SVG/code payloads remain byte-for-byte intact.
if (inlineSvgPlaceholders.length > 0) {
  const restored = restoreInlineSvgFigurePlaceholders(translated, inlineSvgPlaceholders);
  if (restored.missing.length > 0) {
    const preview = restored.missing.slice(0, 5).join(', ');
    throw new Error(
      `Missing inline SVG placeholders in translation (${restored.missing.length} missing). ` +
      `Keep tokens unchanged, e.g. ${preview}`
    );
  }
  translated = restored.markdown;
}

const normalizedWithTitle = translated;

let titleOverride = null;
{
  const lines = translated.split(/\r?\n/);
  let i = 0;
  while (i < lines.length && !lines[i].trim()) i++;
  const m = (lines[i] || '').match(/^#\s+(.+)\s*$/);
  if (m) {
    titleOverride = m[1].trim();
    i++;
    while (i < lines.length && !lines[i].trim()) i++;
    translated = lines.slice(i).join('\n').trim() + '\n';
  }
}

if (!titleOverride) {
  throw new Error('Translation must start with an H1 title (for example: # Translated title).');
}
if (!translated.trim()) {
  throw new Error('Translation body is empty after the H1 title.');
}

const executionMode = await loadExecutionMode(dir);
const isRefined = executionMode === 'refined';
if (stage === 'final' && isRefined && !(await hasAppliedDraft(dir))) {
  throw new Error('Refined final stage requires an applied draft. Run --stage draft first.');
}
if (
  stage === 'final' &&
  isRefined &&
  agentTaskState.task &&
  !agentTaskState.task.completedStages?.includes('draft')
) {
  throw new Error('Refined final stage requires the agent task draft stage to be completed.');
}

let revisionNotes = null;
if (stage === 'final' && isRefined) {
  if (!reviewNotesFile) {
    throw new Error('Refined final stage requires --review-notes <file>.');
  }
  revisionNotes = (await fs.readFile(path.resolve(reviewNotesFile), 'utf8')).trim();
  if (!revisionNotes || /\bTODO\b/i.test(revisionNotes)) {
    throw new Error('Review notes must be non-empty and must not contain TODO markers.');
  }
  if (!/^#\s+/m.test(revisionNotes)) {
    revisionNotes = `# Revision Notes\n\n${revisionNotes}`;
  }
  revisionNotes += '\n';
}

const lintReportPath = path.join(dir, 'lint.report.json');
await fs.writeFile(
  lintReportPath,
  JSON.stringify(
    {
      before: lintBefore,
      after: lintAfter,
      autoFixed: fixed.changed,
    },
    null,
    2
  ) + '\n',
  'utf8'
);

if (stage === 'draft') {
  const draftPath = path.join(dir, '03-draft.md');
  await fs.writeFile(draftPath, normalizedWithTitle, 'utf8');

  let critiquePath = null;
  if (isRefined) {
    critiquePath = path.join(dir, '04-critique.md');
    await fs.writeFile(critiquePath, quickCritiqueMarkdown(normalizedWithTitle), 'utf8');
  }

  const agentTaskPath = await updateAgentTaskStatus(agentTaskState, 'draft_applied', 'draft');

  console.log(JSON.stringify(resultEnvelope('draft_applied', {
    ok: true,
    stage,
    slug,
    executionMode,
    draftPath,
    critiquePath,
    lintReportPath,
    lintScore: lintAfter.score,
    lintOk: lintAfter.ok,
    lintIssues: lintAfter.issues.length,
    autoFixed: fixed.changed,
    inlineSvgPlaceholders: inlineSvgPlaceholders.length,
    agentTaskPath,
  }), null, 2));
  process.exit(0);
}

const revisionPath = isRefined ? path.join(dir, '05-revision.md') : null;
if (revisionPath) await fs.writeFile(revisionPath, revisionNotes, 'utf8');

const outFrontmatter = {
  title: titleOverride || fm.title || slug,
  date: fm.date,
  sourceUrl: fm.sourceUrl,
  lang,
};

const outMd = matter.stringify(translated, outFrontmatter);
const outPath = path.join(dir, `${lang}.md`);
await fs.writeFile(outPath, outMd, 'utf-8');
const agentTaskPath = await updateAgentTaskStatus(agentTaskState, 'complete', 'final');

console.log(JSON.stringify(resultEnvelope('complete', {
  ok: true,
  stage,
  slug,
  lang,
  executionMode,
  outPath,
  lintReportPath,
  revisionPath,
  lintScore: lintAfter.score,
  lintOk: lintAfter.ok,
  lintIssues: lintAfter.issues.length,
  autoFixed: fixed.changed,
  inlineSvgPlaceholders: inlineSvgPlaceholders.length,
  agentTaskPath,
}), null, 2));
