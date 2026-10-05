// Read-only integration checks for the new.md import. Run from the repository root.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = file => fs.readFileSync(file, 'utf8');
const runtime = read('scripts/site_runtime.js');
const groups = JSON.parse(runtime.match(/const groups = (.*);/)[1]);
const order = vm.runInNewContext('(' + runtime.match(/const questionOrder = (\{[\s\S]*?\n  \});/)[1] + ')');
const removed = new Set(JSON.parse(runtime.match(/removedAllQuestionNumbers = new Set\((\[[^\]]*\])/)[1]));
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
    allQuestions, removedAllQuestionNumbers: removed,
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
assert.equal(all.length, 210);
assert.equal(followups, 234);
assert(main.html.includes('210 основных вопросов и 234 уточнений'));
assert.equal(new Set(all.map(c => c.id)).size, all.length, 'Duplicate question IDs');
assert.equal(catalog.questions.length, 210);
assert.equal(new Set(catalog.questions.map(c => c.id)).size, 210, 'Duplicate catalog IDs');
for (const card of all) {
  assert(catalog.questions.some(c => c.id === card.id && c.topic === card.topic), 'Missing catalog entry ' + card.id);
  assert(card.html.includes('class="answer-box"'), 'Missing answer ' + card.id);
}

// Compare every legacy number to the original algorithm, excluding imported IDs.
const numbers = numbersFor(all, true);
assert.equal(new Set(numbers.values()).size, 210, 'Duplicate display numbers');
const old = all.filter(c => c.id < 424);
assert.equal(old.length, 194);
let originalNumber = 1;
for (const card of old) {
  while (removed.has(originalNumber)) originalNumber++;
  assert.equal(numbers.get(card.id), originalNumber++, 'Legacy number shifted: ' + card.id);
}
assert.equal(originalNumber - 1, 386);
for (let id = 424; id <= 439; id++) assert.equal(numbers.get(id), id);
assert.equal(numbers.get(148), 2);
assert.equal(numbers.get(59), 248);
assert.equal(numbers.get(89), 305);
assert.equal(numbers.get(2), 375);

// Exercise the actual number form with all 16 new cards, using DOM test doubles.
const elements = Object.fromEntries(['study-number-form', 'study-number-input', 'study-number-status', 'copy-studied-numbers']
  .map(id => [id, { value: '', textContent: '', addEventListener(event, fn) { this[event] = fn; } }]));
const newNodes = all.filter(c => c.id >= 424).map(card => {
  const node = { id: 'question-' + card.id, classList: { contains: () => false }, querySelectorAll: () => [] };
  const checkbox = { disabled: false, checked: false, closest: selector => selector === '.clarification-item' ? null : node };
  node.querySelector = selector => selector.includes('strong') ? { textContent: card.id + '.' } : checkbox;
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
elements['study-number-input'].value = all.filter(c => c.id >= 424).map(c => c.id).join(', ');
elements['study-number-form'].submit({ preventDefault() {} });
assert.equal(Object.keys(studied).length, 16);
assert(elements['study-number-status'].textContent.includes('16'));
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
    assert.equal(parsed.length, 16, file + ': imported cards missing');
    assert(parsed.every(card => card.text.length > 10 && (card.answerHtml || card.steps?.[0].answerHtml)));
  }
}
console.log('PASS: 47 topic pages; 210 questions; 234 followups; catalog/counts/scripts consistent.');
console.log('PASS: all 194 legacy numbers retained; new numbers 424–439 unique; all 16 accepted by number form.');
console.log('PASS: both quiz modes and interview parser accept all 16 new cards (DOM test doubles).');
