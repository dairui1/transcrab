import fs from 'node:fs/promises';
import path from 'node:path';
import createDOMPurify from 'dompurify';
import matter from 'gray-matter';
import { JSDOM } from 'jsdom';
import { marked } from 'marked';
import { normalizeTargetLanguage } from '../../scripts/lib/identifiers.mjs';

const CONTENT_ROOT = path.resolve(process.cwd(), 'content', 'articles');
const DOMPurify = createDOMPurify(new JSDOM('').window);
const SANITIZE_OPTIONS = Object.freeze({
  USE_PROFILES: { html: true, svg: true, svgFilters: true },
  FORBID_TAGS: ['script', 'foreignObject', 'foreignobject'],
});

function ts(x) {
  if (!x) return null;
  const t = Date.parse(x);
  return Number.isFinite(t) ? t : null;
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function toYyyyMm(dateStr) {
  const t = ts(dateStr);
  if (t === null) return { yyyy: '0000', mm: '00' };
  const d = new Date(t);
  return { yyyy: String(d.getUTCFullYear()), mm: pad2(d.getUTCMonth() + 1) };
}

function dateDisplay(dateStr) {
  // Display only YYYY-MM-DD even if stored as ISO datetime.
  if (!dateStr) return '';
  const s = String(dateStr);
  return s.length >= 10 ? s.slice(0, 10) : s;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function resolveArticleMarkdownPath(contentRoot, slug) {
  const articleSlug = String(slug || '');
  if (!articleSlug || articleSlug === '.' || articleSlug === '..' || /[\\/\0]/.test(articleSlug)) {
    throw new Error(`Invalid article directory: ${slug}`);
  }
  const articleDir = path.join(contentRoot, articleSlug);
  let targetLang = 'zh';

  try {
    const meta = JSON.parse(await fs.readFile(path.join(articleDir, 'meta.json'), 'utf8'));
    targetLang = normalizeTargetLanguage(meta.targetLang || 'zh');
  } catch {
    targetLang = 'zh';
  }

  const targetPath = path.join(articleDir, `${targetLang}.md`);
  if (await fileExists(targetPath)) return { filePath: targetPath, lang: targetLang };

  const fallbackPath = path.join(articleDir, 'zh.md');
  if (targetLang !== 'zh' && await fileExists(fallbackPath)) {
    return { filePath: fallbackPath, lang: 'zh' };
  }

  return { filePath: targetPath, lang: targetLang };
}

export async function listArticles() {
  let dirs = [];
  try {
    dirs = await fs.readdir(CONTENT_ROOT, { withFileTypes: true });
  } catch {
    return [];
  }

  const items = [];
  for (const d of dirs) {
    if (!d.isDirectory()) continue;
    const slug = d.name;

    try {
      const { filePath: translationPath, lang } = await resolveArticleMarkdownPath(CONTENT_ROOT, slug);
      const raw = await fs.readFile(translationPath, 'utf-8');
      const fm = matter(raw);

      // NOTE: We use frontmatter `date` as the single source of truth.
      // It should be an ISO datetime string (preferred) or YYYY-MM-DD.
      const date = fm.data.date ?? null;
      const { yyyy, mm } = toYyyyMm(date);

      items.push({
        slug,
        yyyy,
        mm,
        title: fm.data.title ?? slug,
        date,
        dateDisplay: dateDisplay(date),
        sourceUrl: fm.data.sourceUrl ?? null,
        lang,
      });
    } catch {
      // ignore
    }
  }

  items.sort((a, b) => {
    const at = ts(a.date);
    const bt = ts(b.date);
    if (at !== null || bt !== null) return (bt ?? -1) - (at ?? -1);

    // Last resort: slug stable.
    return String(a.slug).localeCompare(String(b.slug));
  });

  return items;
}

export async function getArticle(slug) {
  try {
    const { filePath: translationPath, lang } = await resolveArticleMarkdownPath(CONTENT_ROOT, slug);
    const raw = await fs.readFile(translationPath, 'utf-8');
    const fm = matter(raw);
    const html = renderArticleMarkdown(fm.content);
    const date = fm.data.date ?? null;
    return {
      slug,
      title: fm.data.title ?? slug,
      date,
      dateDisplay: dateDisplay(date),
      sourceUrl: fm.data.sourceUrl ?? null,
      lang,
      html,
    };
  } catch {
    return null;
  }
}

export function renderArticleMarkdown(markdown) {
  const rendered = marked.parse(fixStrongAdjacency(String(markdown || '')));
  return DOMPurify.sanitize(rendered, SANITIZE_OPTIONS);
}

// CommonMark-style emphasis rules are strict about delimiter adjacency.
// In Chinese translations we often have patterns like `**Item：**Item` without a space.
// Some parsers (incl. marked) may render this literally. We insert a space AFTER a
// *closing* strong marker when it is immediately followed by a CJK/Latin/digit character.
//
// Important: only treat `**` / `__` as *closing* when it is preceded by a non-whitespace
// character. This avoids false matches across tables like:
//   | **Task** | **99.56%** |
// where a naive `**...**` matcher could “close” on the next cell's opener and corrupt it.
function fixStrongAdjacency(md) {
  // NOTE: Disabled. This render-time tweak was inserting spaces inside emphasis
  // in some CJK cases (e.g. `**我们` -> `** 我们`) which breaks bold rendering.
  // We now normalize emphasis in the content pipeline instead (see apply-translation.mjs).
  return md;
}
