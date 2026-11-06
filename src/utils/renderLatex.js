import { convertLatexToMarkup } from 'mathlive';
import katex from 'katex';

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function parseContentSegments(content) {
  const segments = [];

  if (!content) {
    return [{ type: 'text', content: '' }];
  }

  let index = 0;

  while (index < content.length) {
    const start = content.indexOf('$$', index);

    if (start === -1) {
      segments.push({ type: 'text', content: content.slice(index) });
      break;
    }

    if (start > index) {
      segments.push({ type: 'text', content: content.slice(index, start) });
    }

    const end = content.indexOf('$$', start + 2);

    if (end === -1) {
      segments.push({ type: 'text', content: content.slice(start) });
      break;
    }

    segments.push({
      type: 'formula',
      content: content.slice(start + 2, end).trim()
    });

    index = end + 2;
  }

  if (segments.length === 0) {
    segments.push({ type: 'text', content });
  }

  return segments;
}

export function renderLatexFormula(latex) {
  if (!latex) return '';

  try {
    return convertLatexToMarkup(latex, { defaultMode: 'math' });
  } catch (e) {
    try {
      return katex.renderToString(latex, {
        throwOnError: false,
        displayMode: false
      });
    } catch (fallbackError) {
      return `<span style="color: red;">Error en fórmula: ${escapeHtml(latex)}</span>`;
    }
  }
}

export function renderLatex(text) {
  if (!text) return '';

  return parseContentSegments(text)
    .map((segment) => {
      if (segment.type === 'formula') {
        return renderLatexFormula(segment.content);
      }

      return escapeHtml(segment.content).replace(/\n/g, '<br>');
    })
    .join('');
}
