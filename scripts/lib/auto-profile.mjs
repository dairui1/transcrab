const STYLE_TECH = 'technical';
const STYLE_BUSINESS = 'business';
const STYLE_LIFE = 'conversational';
const STYLE_DEFAULT = 'formal';

const BUSINESS_TERMS = [
  'revenue', 'profit', 'margin', 'roi', 'forecast', 'market', 'cfo', 'ceo', 'strategy', 'pricing',
  'growth', 'valuation', 'enterprise', 'sales', 'quarter', 'guidance', '投资', '营收', '利润', '增长',
  '战略', '市场', '商业', '公司', '成本', '现金流',
];

const LIFE_TERMS = [
  'family', 'friend', 'home', 'travel', 'daily', 'weekend', 'story', 'feeling', 'life', 'hobby',
  'parent', 'child', 'relationship', '心情', '生活', '日常', '旅行', '家人', '朋友', '感受',
  '成长', '经历', '回忆',
];

function countMatches(text, regex) {
  const m = String(text || '').match(regex);
  return m ? m.length : 0;
}

function countKeywordHits(text, terms) {
  const lower = String(text || '').toLowerCase();
  let hits = 0;
  for (const term of terms) {
    if (lower.includes(String(term).toLowerCase())) hits += 1;
  }
  return hits;
}

export function analyzeMarkdownComplexity(markdown) {
  const text = String(markdown || '');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const codeBlocks = countMatches(text, /```/g) / 2;
  const tableRows = countMatches(text, /^\|.+\|\s*$/gm);
  const headings = countMatches(text, /^#{1,6}\s+/gm);
  const links = countMatches(text, /\[[^\]]+\]\([^\)]+\)/g);

  const businessHits = countKeywordHits(text, BUSINESS_TERMS);
  const lifeHits = countKeywordHits(text, LIFE_TERMS);

  return {
    words,
    codeBlocks,
    tableRows,
    headings,
    links,
    businessHits,
    lifeHits,
    isLong: words >= 2800,
    isVeryLong: words >= 4500,
    isTechnical: codeBlocks >= 1 || tableRows >= 2,
  };
}

function inferTopic(metrics) {
  if (metrics.isTechnical) {
    return { topic: 'technology', confidence: 0.88, reasons: ['检测到代码块或表格，判定为技术主题'] };
  }

  if (metrics.businessHits >= 2 && metrics.businessHits >= metrics.lifeHits) {
    return { topic: 'business', confidence: 0.78, reasons: ['商业关键词命中较高，判定为 business'] };
  }

  if (metrics.lifeHits >= 2) {
    return { topic: 'life', confidence: 0.76, reasons: ['生活叙事关键词命中较高，判定为 life'] };
  }

  return { topic: 'technology', confidence: 0.52, reasons: ['主题信号不明显，回退到 technology'] };
}

function stylePresetByTopic(topic) {
  if (topic === 'technology') {
    return { style: STYLE_TECH, audience: 'technical' };
  }
  if (topic === 'business') {
    return { style: STYLE_BUSINESS, audience: 'business' };
  }
  if (topic === 'life') {
    return { style: STYLE_LIFE, audience: 'general' };
  }
  return { style: STYLE_DEFAULT, audience: 'general' };
}

export function inferAutoProfile(markdown, baseProfile = {}) {
  const metrics = analyzeMarkdownComplexity(markdown);
  const topicDecision = inferTopic(metrics);
  const preset = stylePresetByTopic(topicDecision.topic);

  const reasons = [
    '公开发布默认使用 refined 流程，优先质量与稳定性',
    ...topicDecision.reasons,
  ];

  if (metrics.isLong || metrics.isVeryLong) {
    reasons.push('篇幅较长，refined 可降低术语漂移与结构风险');
  }

  return {
    requestedMode: 'auto',
    topic: topicDecision.topic,
    confidence: topicDecision.confidence,
    resolved: {
      mode: 'refined',
      style: preset.style,
      audience: preset.audience,
      glossary: baseProfile.glossary || [],
    },
    metrics,
    reasons,
  };
}
