
function renderMarkdown(text) {
  const escapeHtml = (unsafe) => {
    return unsafe.replace(/[&<>"']/g, (m) => {
      switch (m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#039;';
        default: return m;
      }
    });
  };

  let html = escapeHtml(text);

  // Markdown formatting replacements
  html = html
    .replace(/\[([^\]]+)]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^\s*-\s+(.*)$/gm, '<li>$1</li>')
    .replace(/\n/g, '<br />');

  if (/<li>/.test(html)) {
    html = '<ul>' + html.replace(/(<br \/>|<\/li>)/g, '</li>') + '</ul>';
  }

  return html;
}

document.addEventListener('DOMContentLoaded', () => {
  // Step 1: Render markdown first
  document.querySelectorAll('[data-markdown]').forEach(el => {
    el.innerHTML = renderMarkdown(el.textContent.trim());
  });

  // Step 2: THEN attach click handlers
  document.querySelectorAll('.more-info-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const project = btn.closest('.project');
      const extraInfo = project.querySelector('.extra-info');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        extraInfo.classList.remove('show');
        btn.setAttribute('aria-expanded', 'false');
        extraInfo.setAttribute('aria-hidden', 'true');
        project.classList.remove('expanded');
      } else {
        extraInfo.classList.add('show');
        btn.setAttribute('aria-expanded', 'true');
        extraInfo.setAttribute('aria-hidden', 'false');
        project.classList.add('expanded');
      }
    });
  });
});
