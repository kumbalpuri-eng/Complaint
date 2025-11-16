export const generateComplaintId = (): string => {
    return `COMP-${Date.now()}`;
};

/**
 * A simple markdown renderer to format the AI's summary.
 * Handles:
 * - **bold** text
 * - ^^custom highlight^^ text
 * - * list items
 * - Paragraphs
 * @param text The raw text from the AI summary.
 * @returns An HTML string.
 */
export const renderMarkdown = (text: string): string => {
  let processedText = text;

  // 1. Handle inline elements first
  // Custom syntax (^^text^^) -> <span class="font-bold text-brand-accent">text</span>
  processedText = processedText.replace(/\^\^(.*?)\^\^/g, '<span class="font-bold text-brand-accent">$1</span>');
  // Bold (**text**) -> <strong>text</strong>
  processedText = processedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // 2. Handle block elements (lists and paragraphs)
  const lines = processedText.split('\n');
  let html = '';
  let inList = false;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('* ')) {
      const content = trimmedLine.substring(2);
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      // The content itself might have inline markdown, which we already processed.
      html += `<li>${content}</li>`;
    } else {
      // If we were in a list, close it.
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      // Wrap non-empty, non-list lines in paragraphs.
      if (trimmedLine) {
        html += `<p>${trimmedLine}</p>`;
      }
    }
  }

  // Close any list that might be at the end of the text
  if (inList) {
    html += '</ul>';
  }

  return html;
};
