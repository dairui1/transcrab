#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { loadTranslateConfig } from './lib/translate-config.mjs';
import { getPipelineSteps, materializePipelineArtifacts, resolveExecutionMode } from './translate-orchestrator.mjs';
import { inferAutoProfile } from './lib/auto-profile.mjs';
import { makeSlug } from './transcrab-core.mjs';
import { resolveSourceToMarkdown } from './lib/source-resolver.mjs';
import { extractInlineSvgFigurePlaceholders } from './lib/inline-svg-placeholders.mjs';
import { buildAgentTask, installCliErrorHandler, resultEnvelope } from './lib/agent-contract.mjs';
import { normalizeHttpUrl, normalizeTargetLanguage, toPublicHttpUrl } from './lib/identifiers.mjs';
import { createUniqueArticleDirectory } from './lib/article-directory.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const CONTENT_ROOT = process.env.TRANSCRAB_CONTENT_ROOT
  ? path.resolve(process.env.TRANSCRAB_CONTENT_ROOT)
  : path.join(ROOT, 'content', 'articles');

installCliErrorHandler();

function usage() {
  console.log(`Usage:
  node scripts/add-url.mjs <url> [--lang zh] [--mode auto|quick|normal|refined] [--audience <name>] [--style <name>] [--config <path>]

Notes:
  - Fetches HTML and resolves source markdown with fallback extractors
  - Writes source.md + meta.json
  - Generates a host-neutral translation task for the active agent (does not call an agent CLI)
`);
}

function argValue(args, key, def = null) {
  const idx = args.indexOf(key);
  if (idx >= 0 && idx + 1 < args.length) return args[idx + 1];
  return def;
}

function relativePathMap(paths, baseDir) {
  return Object.fromEntries(
    Object.entries(paths).map(([key, value]) => [key, path.relative(baseDir, value)])
  );
}

function repositoryRelativePath(filePath) {
  const relative = path.relative(ROOT, filePath);
  if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    return null;
  }
  return relative;
}

function sanitizeExtractionUrls(extraction) {
  if (!extraction) return extraction;
  const sanitizeCandidate = (candidate) => {
    if (!candidate?.url) return candidate;
    return { ...candidate, url: toPublicHttpUrl(candidate.url) };
  };
  return {
    ...extraction,
    selected: sanitizeCandidate(extraction.selected),
    candidates: Array.isArray(extraction.candidates)
      ? extraction.candidates.map(sanitizeCandidate)
      : extraction.candidates,
  };
}

const args = process.argv.slice(2);
if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
  usage();
  process.exit(args.length === 0 ? 2 : 0);
}

const url = normalizeHttpUrl(args[0]);
const publicSourceUrl = toPublicHttpUrl(url);
const lang = normalizeTargetLanguage(argValue(args, '--lang', 'zh'));
const mode = argValue(args, '--mode', null);
const audience = argValue(args, '--audience', null);
const style = argValue(args, '--style', null);
const configPath = argValue(args, '--config', null);

const { title, markdown, extraction: rawExtraction } = await resolveSourceToMarkdown(url);
const extraction = sanitizeExtractionUrls(rawExtraction);
const baseSlug = makeSlug(title || publicSourceUrl);
const { slug, dir } = await createUniqueArticleDirectory(CONTENT_ROOT, baseSlug);

const now = new Date();
const date = now.toISOString();

const svgPlaceholderPack = extractInlineSvgFigurePlaceholders(markdown);
const sourceFrontmatter = {
  title: title || slug,
  date,
  sourceUrl: publicSourceUrl,
  lang: 'source',
};
const sourceMd = matter.stringify(svgPlaceholderPack.markdown, sourceFrontmatter);
await fs.writeFile(path.join(dir, 'source.md'), sourceMd, 'utf-8');
if (svgPlaceholderPack.placeholders.length > 0) {
  await fs.writeFile(
    path.join(dir, 'inline-svg.placeholders.json'),
    JSON.stringify(svgPlaceholderPack.placeholders, null, 2) + '\n',
    'utf-8'
  );
}

const { config: configuredProfile, loadedFromFile, configPath: resolvedConfigPath } = await loadTranslateConfig({
  cwd: ROOT,
  configPath,
  cli: {
    mode,
    audience,
    style,
  },
});

const autoProfile = configuredProfile.mode === 'auto'
  ? inferAutoProfile(svgPlaceholderPack.markdown, configuredProfile)
  : null;

const translationProfile = autoProfile
  ? {
      ...configuredProfile,
      ...autoProfile.resolved,
      mode: 'auto',
    }
  : configuredProfile;

const steps = getPipelineSteps(configuredProfile.mode);
const executionMode = resolveExecutionMode(configuredProfile, autoProfile);

const meta = {
  slug,
  title: title || slug,
  date,
  sourceUrl: publicSourceUrl,
  targetLang: lang,
  extraction,
  inlineSvgPlaceholders: svgPlaceholderPack.placeholders.length,
  translationProfile: {
    mode: translationProfile.mode,
    audience: translationProfile.audience,
    style: translationProfile.style,
    glossary: translationProfile.glossary,
    steps,
    executionMode,
    autoProfile,
  },
};
await fs.writeFile(path.join(dir, 'meta.json'), JSON.stringify(meta, null, 2) + '\n', 'utf-8');
if (extraction) {
  await fs.writeFile(path.join(dir, 'extraction.report.json'), JSON.stringify(extraction, null, 2) + '\n', 'utf-8');
}

const promptPath = path.join(dir, 'translate.prompt.txt');
const promptCompatPath = path.join(dir, `translate.${lang}.prompt.txt`);
const materialized = await materializePipelineArtifacts({
  outputDir: dir,
  markdown: svgPlaceholderPack.markdown,
  lang,
  profile: {
    ...translationProfile,
    steps,
  },
  autoProfile,
  sourceTitle: title || slug,
  sourceUrl: publicSourceUrl,
});

const prompt = await fs.readFile(materialized.artifacts.assembledPrompt, 'utf8');
const normalizedPrompt = prompt.trimEnd() + '\n';
await fs.writeFile(promptPath, normalizedPrompt, 'utf-8');
await fs.writeFile(promptCompatPath, normalizedPrompt, 'utf-8');

const portableConfigPath = repositoryRelativePath(resolvedConfigPath);

await fs.writeFile(
  path.join(dir, 'translation.profile.json'),
  JSON.stringify(
    {
      profile: translationProfile,
      configuredProfile,
      autoProfile,
      steps,
      executionMode,
      executionSteps: materialized.executionSteps,
      artifacts: relativePathMap(materialized.artifacts, dir),
      promptPath: path.basename(promptPath),
      promptCompatPath: path.basename(promptCompatPath),
      createdFiles: materialized.createdFiles.map((filePath) => path.relative(dir, filePath)),
      configPath: portableConfigPath,
      configSource: loadedFromFile
        ? portableConfigPath ? 'repository' : 'external'
        : 'defaults',
      loadedFromFile,
    },
    null,
    2
  ) + '\n',
  'utf-8'
);

const agentTask = buildAgentTask({
  slug,
  lang,
  promptFileName: path.basename(promptPath),
  promptCompatFileName: path.basename(promptCompatPath),
  executionMode,
});
const agentTaskPath = path.join(dir, 'agent-task.json');
await fs.writeFile(agentTaskPath, JSON.stringify(agentTask, null, 2) + '\n', 'utf-8');

// Print a machine-readable summary for wrappers.
// NOTE: yyyy/mm are derived from `date` (UTC), and match the site's canonical route:
//   /a/<yyyy>/<mm>/<slug>/
const yyyy = String(now.getUTCFullYear());
const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
const articlePath = `/a/${yyyy}/${mm}/${slug}/`;
const articleRelativePath = articlePath.replace(/^\/+/, '');

console.log(
  JSON.stringify(
    resultEnvelope('prepared', {
      ok: true,
      slug,
      dir,
      lang,
      promptPath,
      promptCompatPath,
      date,
      yyyy,
      mm,
      articlePath,
      articleRelativePath,
      extraction,
      inlineSvgPlaceholders: svgPlaceholderPack.placeholders.length,
      translationProfile: {
        ...translationProfile,
        steps,
        executionMode,
        executionSteps: materialized.executionSteps,
        autoProfile,
      },
      profilePath: path.join(dir, 'translation.profile.json'),
      agentTaskPath,
      agentTask,
      pipelineFiles: materialized.createdFiles,
      nextSteps: [
        `Translate: read ${promptPath} and translate to ${lang} (H1 title + blank line + body)`,
        `Compat prompt (deprecated): ${promptCompatPath}`,
        ...agentTask.applySteps.map(
          (step) => `Apply ${step.stage}: ${step.argvTemplate.join(' ')}`
        ),
        'Delivery: follow the recorded local-only or publish policy; discover the production branch or PR flow before committing',
        'Published delivery: derive the configured public URL and require HTTP 200',
      ],
    }),
    null,
    2
  )
);

// Ensure the CLI exits even if HTTP keep-alive leaves sockets open (e.g. in tests/local servers).
process.exit(0);
