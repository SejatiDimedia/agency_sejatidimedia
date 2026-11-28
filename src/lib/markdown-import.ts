export interface ParsedMarkdownArticle {
  isBilingual: boolean;
  titleId?: string;
  excerptId?: string;
  contentId?: string;
  titleEn?: string;
  excerptEn?: string;
  contentEn?: string;
  tags?: string;
  slug?: string;
  category?: string;
  readTimeMinutes?: number;
}

const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const BILINGUAL_EN_MARKER = /^<!--\s*lang\s*:\s*en\s*-->$/im;
const BILINGUAL_ID_MARKER = /^<!--\s*lang\s*:\s*id\s*-->$/im;

function unquote(val: string): string {
  const trimmed = val.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function parseFrontmatter(raw: string): {
  meta: Record<string, string>;
  body: string;
} {
  const match = raw.match(FRONTMATTER_REGEX);
  if (!match) {
    return { meta: {}, body: raw };
  }

  const meta: Record<string, string> = {};
  const lines = match[1].split(/\r?\n/);

  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx <= 0) continue;
    const key = line.slice(0, colonIdx).trim();
    const rawVal = line.slice(colonIdx + 1).trim();
    if (!key) continue;
    // Handle inline array syntax like [TypeScript, Architecture]
    const cleaned = rawVal.startsWith('[') && rawVal.endsWith(']')
      ? rawVal.slice(1, -1).split(',').map((s) => unquote(s)).filter(Boolean).join(', ')
      : unquote(rawVal);
    meta[key] = cleaned;
  }

  return {
    meta,
    body: raw.slice(match[0].length),
  };
}

function extractTitleAndCleanBody(
  sectionText: string,
  explicitTitle?: string,
  fallbackFilename?: string
): { title: string; body: string } {
  const lines = sectionText.trim().split(/\r?\n/);
  let title = explicitTitle?.trim() || '';
  let bodyLines = [...lines];

  // Find first H1 heading (# Title)
  const firstNonEmptyIdx = bodyLines.findIndex((l) => l.trim().length > 0);
  if (firstNonEmptyIdx !== -1) {
    const firstLine = bodyLines[firstNonEmptyIdx].trim();
    const h1Match = firstLine.match(/^#\s+(.+)$/);
    if (h1Match) {
      if (!title) {
        title = h1Match[1].trim();
      }
      // Remove the top H1 so it doesn't duplicate the article's hero H1
      bodyLines.splice(firstNonEmptyIdx, 1);
    }
  }

  if (!title && fallbackFilename) {
    title = fallbackFilename
      .replace(/\.(md|markdown|txt)$/i, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();
  }

  return {
    title,
    body: bodyLines.join('\n').trim(),
  };
}

function extractFallbackExcerpt(body: string, maxLength = 210): string {
  const lines = body.split(/\r?\n/);
  let inCodeBlock = false;
  const paragraphParts: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    if (!trimmed) {
      if (paragraphParts.length > 0) break;
      continue;
    }

    // Skip headings, lists, blockquotes, tables, HTML comments
    if (
      trimmed.startsWith('#') ||
      trimmed.startsWith('>') ||
      trimmed.startsWith('|') ||
      trimmed.startsWith('<!--') ||
      /^[-*+]\s+/.test(trimmed) ||
      /^\d+\.\s+/.test(trimmed)
    ) {
      if (paragraphParts.length > 0) break;
      continue;
    }

    paragraphParts.push(trimmed);
  }

  const raw = paragraphParts
    .join(' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~]/g, '')
    .trim();

  if (raw.length <= maxLength) return raw;
  const sliced = raw.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(' ');
  return `${(lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced).trim()}...`;
}

function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function parseMarkdownArticle(
  rawText: string,
  activeLang: 'id' | 'en',
  fallbackFilename?: string
): ParsedMarkdownArticle {
  const normalized = rawText.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const { meta, body } = parseFrontmatter(normalized);

  const enMarkerMatch = body.match(BILINGUAL_EN_MARKER);
  const hasBilingualMarker = Boolean(enMarkerMatch);

  const parsedTags = meta.tags || undefined;
  const parsedSlug = meta.slug || undefined;
  const parsedCategory = meta.category || undefined;
  const explicitReadTime = meta.readTimeMinutes ? Number(meta.readTimeMinutes) : undefined;

  if (hasBilingualMarker && enMarkerMatch?.index !== undefined) {
    const rawIdPart = body
      .slice(0, enMarkerMatch.index)
      .replace(BILINGUAL_ID_MARKER, '')
      .trim();
    const rawEnPart = body
      .slice(enMarkerMatch.index + enMarkerMatch[0].length)
      .trim();

    const idExtracted = extractTitleAndCleanBody(
      rawIdPart,
      meta.titleId || meta.title,
      fallbackFilename
    );
    const enExtracted = extractTitleAndCleanBody(
      rawEnPart,
      meta.titleEn,
      undefined
    );

    const excerptId =
      meta.excerptId ||
      meta.excerpt ||
      extractFallbackExcerpt(idExtracted.body);
    const excerptEn =
      meta.excerptEn ||
      extractFallbackExcerpt(enExtracted.body);

    return {
      isBilingual: true,
      titleId: idExtracted.title,
      excerptId,
      contentId: idExtracted.body,
      titleEn: enExtracted.title,
      excerptEn,
      contentEn: enExtracted.body,
      tags: parsedTags,
      slug: parsedSlug,
      category: parsedCategory,
      readTimeMinutes:
        explicitReadTime && Number.isFinite(explicitReadTime)
          ? explicitReadTime
          : estimateReadTime(idExtracted.body || enExtracted.body),
    };
  }

  // Single-language markdown file: map into the currently active editor tab
  const extracted = extractTitleAndCleanBody(
    body,
    activeLang === 'id' ? (meta.titleId || meta.title) : (meta.titleEn || meta.title),
    fallbackFilename
  );
  const excerpt =
    (activeLang === 'id' ? (meta.excerptId || meta.excerpt) : (meta.excerptEn || meta.excerpt)) ||
    extractFallbackExcerpt(extracted.body);

  const readTimeMinutes =
    explicitReadTime && Number.isFinite(explicitReadTime)
      ? explicitReadTime
      : estimateReadTime(extracted.body);

  if (activeLang === 'en') {
    return {
      isBilingual: false,
      titleEn: extracted.title,
      excerptEn: excerpt,
      contentEn: extracted.body,
      tags: parsedTags,
      slug: parsedSlug,
      category: parsedCategory,
      readTimeMinutes,
    };
  }

  return {
    isBilingual: false,
    titleId: extracted.title,
    excerptId: excerpt,
    contentId: extracted.body,
    tags: parsedTags,
    slug: parsedSlug,
    category: parsedCategory,
    readTimeMinutes,
  };
}

export const MARKDOWN_BILINGUAL_TEMPLATE = `---
titleId: Judul Artikel Bahasa Indonesia
excerptId: Ringkasan singkat artikel Bahasa Indonesia (1-2 kalimat).
titleEn: English Article Title
excerptEn: Short English article summary (1-2 sentences).
tags: TypeScript, Backend, Architecture
---

## 1. Pembahasan Utama (Bahasa Indonesia)

Tulis isi artikel Bahasa Indonesia di sini. Anda bisa menggunakan \`inline code\`, daftar poin, tabel, maupun blok kode:

\`\`\`ts
interface Contoh {
  id: string;
  nama: string;
}
\`\`\`

<!-- lang:en -->

## 1. Main Discussion (English Version)

Write the English article content here. You can use \`inline code\`, lists, tables, and code blocks:

\`\`\`ts
interface Example {
  id: string;
  name: string;
}
\`\`\`
`;

export const ARTICLE_WRITING_PROMPT = `Buatkan artikel teknik/engineering profesional (bilingual ID & EN) untuk blog agency software engineering SejatiDimedia dengan topik: [ISI TOPIK DI SINI].

WAJIB ikuti format output Markdown berikut agar bisa langsung di-paste ke editor:

1. Mulai TEPAT di baris pertama dengan frontmatter:
---
titleId: [Judul menarik & teknis dalam Bahasa Indonesia]
excerptId: [Ringkasan 1-2 kalimat yang padat nilai bisnis & teknis]
titleEn: [Compelling technical English title]
excerptEn: [Concise 1-2 sentence English summary]
tags: [3-5 tag relevan dipisah koma, misal: TypeScript, Architecture, Security]
---

2. Struktur Artikel Profesional:
- Buka dengan konteks masalah nyata di production (hindari basa-basi generik).
- Gunakan heading ## (H2) dan ### (H3) agar otomatis masuk ke Daftar Isi.
- Sertakan contoh kode nyata (\`\`\`ts, \`\`\`sql, dll.) dan \`inline code\` untuk istilah/simbol teknis.
- Sertakan minimal 1 bagian perbandingan menggunakan #### ❌ Anti-Pattern dan #### ✅ Best Practice, serta 1 tabel ringkasan/trade-off.
- WAJIB sertakan minimal 2-3 tautan eksternal/referensi terpercaya (external backlink/outbound link) secara natural di dalam paragraf menuju artikel, dokumentasi resmi, standar/RFC, atau publikasi teknis kredibel di luar website (misal dokumentasi resmi framework, OWASP, MDN, blog engineering terkemuka) dalam format \`[teks jangkar relevan](https://...)\` — pastikan URL nyata dan bukan link karangan.
- Tutup dengan kesimpulan praktis & langkah implementasi.

3. Setelah konten Bahasa Indonesia selesai, tambahkan baris pemisah persis:
<!-- lang:en -->
lalu tulis versi Bahasa Inggris lengkap dengan struktur, kode, dan backlink yang setara.`;
