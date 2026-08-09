#!/usr/bin/env node

function isCjk(ch) {
  return /[\u3400-\u9FFF]/.test(ch || '');
}

function pushIssue(issues, code, level, index, message, excerpt) {
  issues.push({ code, level, index, message, excerpt });
}

function visitProseSegments(source, visit) {
  const src = String(source || '');
  let offset = 0;
  let fence = null;

  for (const match of src.matchAll(/[^\n]*(?:\n|$)/g)) {
    const line = match[0];
    if (!line) continue;
    const fenceMatch = line.match(/^[ \t]{0,3}(`{3,}|~{3,})/);

    if (fence) {
      const close = new RegExp(`^[ \\t]{0,3}${fence.char}{${fence.length},}[ \\t]*(?:\\n)?$`);
      if (close.test(line)) fence = null;
      offset += line.length;
      continue;
    }

    if (fenceMatch) {
      fence = { char: fenceMatch[1][0], length: fenceMatch[1].length };
      offset += line.length;
      continue;
    }

    // CommonMark treats four-space/tab-indented lines as code blocks.
    if (/^(?: {4}|\t)/.test(line)) {
      offset += line.length;
      continue;
    }

    let cursor = 0;
    while (cursor < line.length) {
      const tickMatch = /`+/.exec(line.slice(cursor));
      const tickStart = tickMatch ? cursor + tickMatch.index : line.length;
      visitUnprotected(line.slice(cursor, tickStart), offset + cursor, visit);
      if (!tickMatch) break;

      const token = tickMatch[0];
      const closeAt = line.indexOf(token, tickStart + token.length);
      if (closeAt < 0) break;
      cursor = closeAt + token.length;
    }

    offset += line.length;
  }
}

function visitUnprotected(text, baseIndex, visit) {
  const protectedPattern = /(\]\([^\)\r\n]*\)|<[^>\r\n]+>|(?:https?:\/\/|mailto:)[^\s<]+)/g;
  let cursor = 0;
  for (const match of text.matchAll(protectedPattern)) {
    const start = match.index ?? 0;
    if (start > cursor) visit(text.slice(cursor, start), baseIndex + cursor);
    cursor = start + match[0].length;
  }
  if (cursor < text.length) visit(text.slice(cursor), baseIndex + cursor);
}

function transformProse(source, transform) {
  const src = String(source || '');
  const replacements = [];
  visitProseSegments(src, (text, index) => {
    replacements.push({ index, length: text.length, value: transform(text) });
  });

  let out = '';
  let cursor = 0;
  for (const replacement of replacements) {
    out += src.slice(cursor, replacement.index) + replacement.value;
    cursor = replacement.index + replacement.length;
  }
  return out + src.slice(cursor);
}

export function lintTranslation(text) {
  const src = String(text || '');
  const issues = [];

  visitProseSegments(src, (segment, baseIndex) => {
    // Specific unnatural phrase seen in smoke tests.
    for (const m of segment.matchAll(/问题是[\?？]/g)) {
      pushIssue(issues, 'cn-question-colon-pattern', 'high', baseIndex + (m.index ?? 0), '发现“问题是?”不自然写法，建议改为“问题在于：”', m[0]);
    }

    // ASCII punctuation near CJK chars: likely mixed punctuations.
    for (const m of segment.matchAll(/([\u3400-\u9FFF])([\?:;,\.])|([\?:;,\.])([\u3400-\u9FFF])/g)) {
      pushIssue(issues, 'ascii-punctuation-near-cjk', 'medium', baseIndex + (m.index ?? 0), '检测到中文邻近英文标点，建议替换为中文标点', m[0]);
    }

    // Duplicate punctuations, e.g. ？？ or ！！
    for (const m of segment.matchAll(/[？！]{2,}/g)) {
      pushIssue(issues, 'duplicate-cn-punctuation', 'low', baseIndex + (m.index ?? 0), '重复中文标点，建议保留一个', m[0]);
    }
  });

  const score = Math.max(0, 100 - issues.reduce((s, i) => s + (i.level === 'high' ? 20 : i.level === 'medium' ? 8 : 3), 0));
  return { ok: issues.length === 0, score, issues };
}

function normalizePunctuationNearCjk(text) {
  const chars = [...String(text || '')];
  const map = { '?': '？', ':': '：', ';': '；', ',': '，', '.': '。' };

  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (!(c in map)) continue;
    const prev = chars[i - 1] || '';
    const next = chars[i + 1] || '';
    if (isCjk(prev) || isCjk(next)) {
      chars[i] = map[c];
    }
  }

  return chars.join('');
}

export function autoFixTranslation(text) {
  const before = String(text || '');
  const out = transformProse(before, (segment) => {
    let normalized = segment.replace(/问题是[\?？]/g, '问题在于：');
    normalized = normalizePunctuationNearCjk(normalized);
    return normalized.replace(/([？！])\1+/g, '$1');
  });

  return {
    text: out,
    changed: out !== before,
    before,
    after: out,
  };
}
