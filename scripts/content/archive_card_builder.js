window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProAdditionalQuestions = window.InterviewProAdditionalQuestions || [];

window.InterviewProBuildCards = (topic, cards) => {
  const escape = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const paragraphs = value => String(value).split(/\n\s*\n/).filter(Boolean)
    .map(part => '<p>' + escape(part.trim()).replace(/\n/g, '<br>') + '</p>').join('');
  const markdown = value => {
    const inline = source => escape(source).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
    const lines = String(value).trim().split('\n');
    const blocks = [];
    for (let i = 0; i < lines.length;) {
      const line = lines[i].trim();
      if (!line || line === '---') { i++; continue; }
      if (line.startsWith('```')) {
        const language = line.slice(3).replace(/[^a-z0-9-]/gi, '');
        const code = [];
        for (i++; i < lines.length && !lines[i].trim().startsWith('```'); i++) code.push(lines[i]);
        i++;
        blocks.push('<pre><code class="language-' + language + '">' + escape(code.join('\n')) + '</code></pre>');
      } else if (/^\|.+\|$/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|$/.test(lines[i + 1].trim())) {
        const rows = [];
        for (; i < lines.length && /^\|.+\|$/.test(lines[i].trim()); i++) {
          if (/^\|[\s:|-]+\|$/.test(lines[i].trim())) continue;
          rows.push(lines[i].trim().slice(1, -1).split('|').map(cell => '<td>' + inline(cell.trim()) + '</td>').join(''));
        }
        blocks.push('<div class="answer-table-wrap"><table>' + rows.map(row => '<tr>' + row + '</tr>').join('') + '</table></div>');
      } else if (/^[-*] /.test(line) || /^\d+\. /.test(line)) {
        const ordered = /^\d+\. /.test(line);
        const items = [];
        for (; i < lines.length && (ordered ? /^\d+\. /.test(lines[i].trim()) : /^[-*] /.test(lines[i].trim())); i++) {
          items.push('<li>' + inline(lines[i].trim().replace(ordered ? /^\d+\. / : /^[-*] /, '')) + '</li>');
        }
        blocks.push('<' + (ordered ? 'ol' : 'ul') + '>' + items.join('') + '</' + (ordered ? 'ol' : 'ul') + '>');
      } else {
        const text = [];
        for (; i < lines.length && lines[i].trim() && !lines[i].trim().startsWith('```') && !/^[-*] /.test(lines[i].trim()) && !/^\d+\. /.test(lines[i].trim()); i++) {
          text.push(lines[i].trim().replace(/^>\s?/, '').replace(/^#{1,5}\s+/, ''));
        }
        blocks.push('<p>' + inline(text.join(' ')) + '</p>');
      }
    }
    return blocks.join('');
  };
  const render = card => {
    const title = card.title.includes('?') ? card.title :
      /^(Как|Что|Чем|Почему|Когда|Можно ли|Зачем|Какие|Кто)(?:\s|$)/.test(card.title)
        ? card.title + '?'
        : 'Что важно знать о теме «' + card.title + '»?';
    window.InterviewProAdditionalQuestions.push({ id: card.id, topic, title });
    const followups = (card.followups || []).map(([title, answer], index) =>
      '<div class="clarification-item" id="question-' + card.id + '-followup-' + (index + 1) +
      '" data-parent-question="question-' + card.id + '">' +
      '<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ ' + escape(title) + '</span></label>' +
      '<details class="answer-details"><summary>Показать ответ</summary><div class="answer-box">' + paragraphs(answer) + '</div></details></div>'
    ).join('');
    return '<article class="question-card" id="question-' + card.id + '">' +
      '<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>' + card.id + '.</strong> ' + escape(title) + '</span></label>' +
      '<details class="answer-details"><summary>Показать ответ</summary><div class="answer-box">' +
      (card.markdown ? markdown(card.answer) : paragraphs(card.answer)) + '</div></details>' +
      (followups ? '<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(' + card.followups.length + ')</small></h3>' + followups + '</div>' : '') +
      '</article>';
  };
  return cards.map(render).join('\n');
};
