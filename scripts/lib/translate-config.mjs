#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

export const DEFAULT_TRANSLATE_CONFIG = Object.freeze({
  mode: 'auto',
  audience: 'general',
  style: 'storytelling',
  glossary: [],
});

const ALLOWED_MODES = new Set(['auto', 'quick', 'normal', 'refined']);

export function normalizeMode(mode, fallback = DEFAULT_TRANSLATE_CONFIG.mode) {
  const m = String(mode || '').trim().toLowerCase();
  if (!m) return fallback;
  if (!ALLOWED_MODES.has(m)) {
    throw new Error(`Invalid mode: ${mode}. Allowed: auto|quick|normal|refined`);
  }
  return m;
}

export function mergeTranslateConfig(base, patch) {
  const combined = {
    ...DEFAULT_TRANSLATE_CONFIG,
    ...(base || {}),
    ...(patch || {}),
  };

  return {
    mode: normalizeMode(combined.mode),
    audience: String(combined.audience || DEFAULT_TRANSLATE_CONFIG.audience).trim() || DEFAULT_TRANSLATE_CONFIG.audience,
    style: String(combined.style || DEFAULT_TRANSLATE_CONFIG.style).trim() || DEFAULT_TRANSLATE_CONFIG.style,
    glossary: Array.isArray(combined.glossary)
      ? combined.glossary.filter(Boolean).map((x) => String(x).trim()).filter(Boolean)
      : [],
  };
}

async function maybeReadJson(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err && err.code === 'ENOENT') return null;
    throw err;
  }
}

export async function loadTranslateConfig({ cwd = process.cwd(), configPath, cli = {} } = {}) {
  const resolvedPath = configPath
    ? path.resolve(cwd, configPath)
    : process.env.TRANSCRAB_TRANSLATE_CONFIG
      ? path.resolve(cwd, process.env.TRANSCRAB_TRANSLATE_CONFIG)
      : path.resolve(cwd, 'transcrab.translate.config.json');

  const fileConfig = await maybeReadJson(resolvedPath);
  const config = mergeTranslateConfig(fileConfig, cli);

  return {
    config,
    configPath: resolvedPath,
    loadedFromFile: Boolean(fileConfig),
  };
}
