import Prism from 'prismjs';

// Load grammars in proper dependency order
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-docker';

export interface CodeLine {
  text: string;
  html: string;
  isAntiPattern: boolean;
  isBestPractice: boolean;
  isDiffAdd: boolean;
  isDiffRemove: boolean;
}

export interface HighlightResult {
  lines: CodeLine[];
  detectedLanguage: string;
  detectedFileName: string | null;
  totalLines: number;
  totalChars: number;
}

export function highlightCode(rawCode: string, langName?: string): HighlightResult {
  const code = String(rawCode || '').replace(/\r\n/g, '\n').replace(/\n$/, '');
  let normalizedLang = (langName || 'plaintext').toLowerCase().trim();

  // Aliases mapping
  const languageAliases: Record<string, string> = {
    ts: 'typescript',
    tsx: 'tsx',
    js: 'javascript',
    jsx: 'jsx',
    py: 'python',
    sh: 'bash',
    shell: 'bash',
    zsh: 'bash',
    terminal: 'bash',
    yml: 'yaml',
    docker: 'dockerfile',
    dockerfile: 'docker',
    golang: 'go',
    rb: 'ruby',
    md: 'markdown',
  };

  if (languageAliases[normalizedLang]) {
    normalizedLang = languageAliases[normalizedLang];
  }

  // Detect file name if first line is a comment with file path/name
  const rawLines = code.split('\n');
  let detectedFileName: string | null = null;

  if (rawLines.length > 0) {
    const firstLine = rawLines[0].trim();
    const fileCommentMatch = firstLine.match(/^(?:\/\/|#|--|\/\*)\s*(?:file(?:name)?:\s*)?([a-zA-Z0-9_\-./\\]+\.[a-zA-Z0-9]+)\s*(?:\*\/)?$/i);
    if (fileCommentMatch) {
      detectedFileName = fileCommentMatch[1];
    } else if (firstLine.startsWith('// app/') || firstLine.startsWith('// config/') || firstLine.startsWith('// routes/')) {
      detectedFileName = firstLine.replace('//', '').trim();
    }
  }

  // Fallback filename based on language
  if (!detectedFileName) {
    switch (normalizedLang) {
      case 'php':
        // Check for class name
        const classMatch = code.match(/class\s+([A-Za-z0-9_]+)/);
        detectedFileName = classMatch ? `${classMatch[1]}.php` : 'script.php';
        break;
      case 'typescript':
      case 'ts':
        detectedFileName = 'index.ts';
        break;
      case 'tsx':
        detectedFileName = 'Component.tsx';
        break;
      case 'javascript':
      case 'js':
        detectedFileName = 'index.js';
        break;
      case 'sql':
        detectedFileName = 'query.sql';
        break;
      case 'bash':
      case 'shell':
        detectedFileName = 'Terminal';
        break;
      case 'json':
        detectedFileName = 'config.json';
        break;
      case 'yaml':
        detectedFileName = 'docker-compose.yml';
        break;
      case 'python':
        detectedFileName = 'main.py';
        break;
      default:
        detectedFileName = null;
    }
  }

  // Select grammar
  let grammar = Prism.languages[normalizedLang];
  if (!grammar) {
    if (normalizedLang === 'php') {
      grammar = Prism.languages.clike;
    } else if (normalizedLang === 'typescript' || normalizedLang === 'tsx') {
      grammar = Prism.languages.javascript;
    } else {
      grammar = Prism.languages.plaintext || Prism.languages.clike;
    }
  }

  let highlightedHtml = '';
  try {
    highlightedHtml = Prism.highlight(code, grammar || Prism.languages.clike, normalizedLang);
  } catch {
    // Fallback simple escape
    highlightedHtml = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Line-by-line processing with open tag balancing
  const splitHtmlLines = highlightedHtml.split('\n');
  const openTags: string[] = [];
  const lines: CodeLine[] = [];

  for (let i = 0; i < splitHtmlLines.length; i++) {
    let lineHtml = splitHtmlLines[i];

    // Prepend any open tags from previous line
    if (openTags.length > 0) {
      lineHtml = openTags.join('') + lineHtml;
    }

    // Scan tags in this line
    const tagRegex = /<\/?([a-zA-Z0-9_-]+)(?:\s+[^>]*)?>/g;
    let match: RegExpExecArray | null;
    while ((match = tagRegex.exec(splitHtmlLines[i])) !== null) {
      const fullTag = match[0];
      if (fullTag.startsWith('</')) {
        openTags.pop();
      } else {
        openTags.push(fullTag);
      }
    }

    // Close any tags left open at end of line
    if (openTags.length > 0) {
      const closing = openTags
        .slice()
        .reverse()
        .map((t) => {
          const m = t.match(/<([a-zA-Z0-9_-]+)/);
          return m ? `</${m[1]}>` : '';
        })
        .join('');
      lineHtml = lineHtml + closing;
    }

    const rawLine = rawLines[i] || '';
    const trimmed = rawLine.trim();

    const isDiffRemove = trimmed.startsWith('- ') || trimmed.startsWith('---');
    const isDiffAdd = trimmed.startsWith('+ ') || trimmed.startsWith('+++');
    const isAntiPattern =
      trimmed.includes('[Anti-Pattern]') ||
      trimmed.includes('[Salah]') ||
      trimmed.includes('❌') ||
      isDiffRemove;
    const isBestPractice =
      trimmed.includes('[Best Practice]') ||
      trimmed.includes('[Solusi]') ||
      trimmed.includes('✅') ||
      isDiffAdd;

    lines.push({
      text: rawLine,
      html: lineHtml || '&nbsp;',
      isAntiPattern,
      isBestPractice,
      isDiffAdd,
      isDiffRemove,
    });
  }

  return {
    lines,
    detectedLanguage: normalizedLang,
    detectedFileName,
    totalLines: rawLines.length,
    totalChars: code.length,
  };
}
