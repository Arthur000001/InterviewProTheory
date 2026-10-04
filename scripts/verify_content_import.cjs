// Read-only integration checks: legacy questions plus the 67-card new.md import.
// Run from the repository root: node scripts/verify_content_import.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = file => fs.readFileSync(file, 'utf8');
const importedRaw = new Map();
const runtime = read('scripts/site_runtime.js');
const groups = JSON.parse(runtime.match(/const groups = (.*);/)[1]);
const order = vm.runInNewContext('(' + runtime.match(/const questionOrder = (\{[\s\S]*?\n  \});/)[1] + ')');
const numbering = runtime.match(/const numberCards = \(\) => \{([\s\S]*?)\n  \};/)[1];

function loadPage(file) {
  const html = read(file);
  const context = vm.createContext({ window: {} });
  const scripts = [...html.matchAll(/<script src="([^"]+)"/g)];
  const loaded = new Set();
  for (const [, src] of scripts) {
    const target = path.resolve(path.dirname(file), src.split(/[?#]/, 1)[0]);
    assert(fs.existsSync(target), file + ': missing script ' + src);
    assert(!loaded.has(target), file + ': duplicate script ' + src);
    loaded.add(target);
    const code = read(target);
    new vm.Script(code, { filename: target });
    if (target.includes(path.join('scripts', 'content'))) {
      vm.runInContext(code, context, { filename: target });
      if (target.endsWith('archive_card_builder.js')) {
        const build = context.window.InterviewProBuildCards;
        context.window.InterviewProBuildCards = (topic, cards) => {
          for (const card of cards.filter(c => c.id >= 440)) {
            const entry = JSON.stringify({ topic, ...card });
            if (importedRaw.has(card.id)) assert.equal(importedRaw.get(card.id), entry);
            importedRaw.set(card.id, entry);
          }
          return build(topic, cards);
        };
      }
    }
  }
  return { html, ...context.window };
}

function cardsFor(page, topic) {
  assert.equal(typeof page.InterviewProContent[topic], 'string', topic);
  return [...page.InterviewProContent[topic].matchAll(/<article class="question-card" id="question-(\d+)">([\s\S]*?)<\/article>/g)]
    .map(([, id, html]) => ({ id: Number(id), html, topic }))
    .sort((a, b) => order[topic].indexOf(a.id) - order[topic].indexOf(b.id));
}

function numbersFor(cards, allQuestions) {
  const nodes = cards.map(card => ({
    id: 'question-' + card.id,
    number: { textContent: '' },
    querySelector() { return this.number; }
  }));
  vm.runInNewContext('(() => {' + numbering + '})()', {
    allQuestions,
    list: { querySelectorAll: () => nodes }
  });
  return new Map(nodes.map(node => [Number(node.id.slice(9)), parseInt(node.number.textContent, 10)]));
}

const main = loadPage('view/index.html');
const catalog = main.InterviewProQuestionCatalog;
const all = [];
let followups = 0;
for (const group of groups) {
  for (const topic of group.topics) {
    const key = group.id + '/' + topic.id;
    const cards = cardsFor(main, key);
    assert.equal(cards.length, topic.count, key + ': sidebar count');
    assert.deepEqual(cards.map(c => c.id).sort((a,b) => a-b), Array.from(order[key]).sort((a,b) => a-b), key + ': order coverage');
    const count = (main.InterviewProContent[key].match(/class="clarification-item"/g) || []).length;
    assert.equal(count, catalog.clarificationCounts[key] || 0, key + ': followup count');
    followups += count;
    all.push(...cards);
    const local = loadPage('view/' + topic.path);
    assert.equal(local.InterviewProContent[key], main.InterviewProContent[key], key + ': page content differs');
    const localNumbers = [...numbersFor(cardsFor(local, key), false).values()];
    assert.deepEqual(localNumbers, cards.map((_, i) => i + 1), key + ': local numbers');
  }
}
assert.equal(all.length, 277);
assert.equal(followups, 234);
assert(main.html.includes('277 основных вопросов и 234 уточнений'));
assert.equal(new Set(all.map(c => c.id)).size, all.length, 'Duplicate question IDs');
assert.equal(catalog.questions.length, 277);
assert.equal(new Set(catalog.questions.map(c => c.id)).size, 277, 'Duplicate catalog IDs');
for (const card of all) {
  assert(catalog.questions.some(c => c.id === card.id && c.topic === card.topic), 'Missing catalog entry ' + card.id);
  assert(card.html.includes('class="answer-box"'), 'Missing answer ' + card.id);
}

// Display numbers must follow page order, independently of stable card IDs.
const numbers = numbersFor(all, true);
assert.equal(new Set(numbers.values()).size, 277, 'Duplicate display numbers');
assert.deepEqual([...numbers.values()], all.map((_, index) => index + 1));

// Exercise the actual number form with all 83 new cards, using DOM test doubles.
const elements = Object.fromEntries(['study-number-form', 'study-number-input', 'study-number-status', 'copy-studied-numbers']
  .map(id => [id, { value: '', textContent: '', addEventListener(event, fn) { this[event] = fn; } }]));
const newNodes = all.filter(c => c.id >= 424).map(card => {
  const node = { id: 'question-' + card.id, classList: { contains: () => false }, querySelectorAll: () => [] };
  const checkbox = { disabled: false, checked: false, closest: selector => selector === '.clarification-item' ? null : node };
  node.querySelector = selector => selector.includes('strong') ? { textContent: numbers.get(card.id) + '.' } : checkbox;
  return node;
});
const studied = {};
let saved = 0;
let recounted = 0;
const controls = runtime.match(/const setupNumberControls = \(\) => \{([\s\S]*?)\n  \};/)[1];
vm.runInNewContext('(() => {' + controls + '})()', {
  document: { getElementById: id => elements[id] },
  list: { querySelectorAll: () => newNodes }, studied,
  clarificationCheckboxes: () => [], syncQuestionCheckbox: () => {},
  saveStudyState: () => saved++, updateRemainingCounts: () => recounted++
});
elements['study-number-input'].value = all.filter(c => c.id >= 424).map(c => numbers.get(c.id)).join(', ');
elements['study-number-form'].submit({ preventDefault() {} });
assert.equal(Object.keys(studied).length, 83);
for (const card of all.filter(c => c.id >= 424)) {
  assert.equal(studied['question-' + card.id], true, 'Study state must use stable ID');
}
assert(elements['study-number-status'].textContent.includes('83'));
assert.equal(saved, 1);
assert.equal(recounted, 1);
// Both training modes read these same card titles and answers after disclosure setup.
const trainingNodes = all.filter(c => c.id >= 424).map(card => {
  const title = card.html.match(/class="question-text"[^>]*>([\s\S]*?)<\/span>/)[1]
    .replace(/<[^>]*>/g, '').trim();
  const answer = { outerHTML: card.html, querySelector: () => null };
  return {
    style: {}, querySelectorAll: () => [],
    querySelector: selector => selector.includes('question-text') ? { textContent: title } : answer
  };
});
for (const file of ['scripts/quizlet_mode.js', 'scripts/interview_mode.js']) {
  const source = read(file).match(/function parseQuestions\([^)]*\) \{[\s\S]*?\n  \}/)[0];
  const context = vm.createContext({ groupedMode: true, document: { querySelectorAll: () => trainingNodes } });
  vm.runInContext(source, context);
  for (const onlyKey of [true, false]) {
    const parsed = context.parseQuestions(onlyKey);
    assert.equal(parsed.length, 83, file + ': imported cards missing');
    assert(parsed.every(card => card.text.length > 10 && (card.answerHtml || card.steps?.[0].answerHtml)));
  }
}
console.log('PASS: 47 topic pages; 277 questions; 234 followups; catalog/counts/scripts consistent.');
console.log('PASS: sequential display numbers 1–277; number form maps all 83 imported cards to stable study IDs.');
console.log('PASS: both quiz modes and interview parser accept all 83 new cards (DOM test doubles).');


const source = read('new.md').replace(/\r/g, '').split('\n');
const expected = [];
for (let i = 0; i < source.length; i++) {
  const match = /^\d+\. (.+)$/.exec(source[i]);
  if (!match) continue;
  const answer = [];
  for (i++; i < source.length; i++) {
    if (source[i].startsWith('   ')) answer.push(source[i].slice(3));
    else if (!source[i].trim()) answer.push('');
    else { i--; break; }
  }
  expected.push({ title: match[1].replace(/`/g, ''), answer: answer.join('\n').trim() });
}
assert.equal(expected.length, 67);
assert.equal(importedRaw.size, 67);
expected.forEach((item, index) => {
  const id = 440 + index;
  const card = JSON.parse(importedRaw.get(id));
  assert.equal(card.title, item.title, 'Source title differs: ' + id);
  assert.equal(card.answer, item.answer, 'Source answer differs: ' + id);
  assert.equal(card.markdown, true);
  const rendered = all.find(c => c.id === id).html;
  const codeBlocks = (item.answer.match(/^```\w+/gm) || []).length;
  assert.equal((rendered.match(/<pre><code /g) || []).length, codeBlocks, 'Lost code block: ' + id);
});
console.log('PASS: all 67 source questions/answers imported exactly; code blocks preserved.');
