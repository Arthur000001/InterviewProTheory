(() => {
  const groups = [{"id":"golang","label":"GoLang","topics":[{"id":"basics","label":"Основы языка","count":13,"path":"golang/basics.html"},{"id":"concurrency","label":"Конкурентность","count":17,"path":"golang/concurrency.html"},{"id":"runtime","label":"Рантайм и профилирование","count":12,"path":"golang/runtime.html"},{"id":"ecosystem","label":"Экосистема и тестирование","count":2,"path":"golang/ecosystem.html"},{"id":"language","label":"Язык и значения","count":19,"path":"golang/language.html"},{"id":"collections_deep","label":"Коллекции и строки","count":6,"path":"golang/collections_deep.html"},{"id":"types","label":"Типы, интерфейсы и структуры","count":12,"path":"golang/types.html"},{"id":"errors","label":"Ошибки и паники","count":11,"path":"golang/errors.html"},{"id":"concurrency_patterns","label":"Паттерны конкурентности","count":11,"path":"golang/concurrency_patterns.html"},{"id":"synchronization","label":"Синхронизация и память","count":8,"path":"golang/synchronization.html"},{"id":"runtime_deep","label":"Планировщик и память","count":10,"path":"golang/runtime_deep.html"},{"id":"generics","label":"Дженерики и итераторы","count":9,"path":"golang/generics.html"},{"id":"context_deep","label":"Контекст и отмена","count":7,"path":"golang/context_deep.html"},{"id":"testing","label":"Тестирование и профилирование","count":11,"path":"golang/testing.html"},{"id":"backend","label":"HTTP, gRPC и данные","count":14,"path":"golang/backend.html"},{"id":"design","label":"Проектирование Go-сервисов","count":6,"path":"golang/design.html"},{"id":"runtime_internals","label":"Внутренности рантайма","count":5,"path":"golang/runtime_internals.html"},{"id":"optimization","label":"Оптимизация и unsafe","count":16,"path":"golang/optimization.html"},{"id":"build_security","label":"Сборка и безопасность","count":5,"path":"golang/build_security.html"}]},{"id":"linux","label":"Linux и ОС","topics":[{"id":"processes","label":"Процессы и файлы","count":12,"path":"linux/processes.html"},{"id":"memory","label":"Память","count":5,"path":"linux/memory.html"},{"id":"kernel","label":"Ядро и диагностика","count":8,"path":"linux/kernel.html"}]},{"id":"network","label":"Сети","topics":[{"id":"transport","label":"Транспорт и маршрутизация","count":11,"path":"network/transport.html"},{"id":"http","label":"HTTP и прокси","count":6,"path":"network/http.html"},{"id":"kubernetes","label":"Сеть Kubernetes","count":4,"path":"network/kubernetes.html"}]},{"id":"containers","label":"Контейнеры и доставка","topics":[{"id":"docker","label":"Docker и контейнеры","count":7,"path":"containers/docker.html"},{"id":"delivery","label":"CI/CD и развёртывание","count":5,"path":"containers/delivery.html"}]},{"id":"kubernetes","label":"Kubernetes","topics":[{"id":"architecture","label":"Устройство кластера","count":10,"path":"kubernetes/architecture.html"},{"id":"operations","label":"Эксплуатация","count":10,"path":"kubernetes/operations.html"}]},{"id":"databases","label":"Базы данных","topics":[{"id":"sql","label":"SQL и транзакции","count":10,"path":"databases/sql.html"},{"id":"postgresql","label":"PostgreSQL","count":14,"path":"databases/postgresql.html"},{"id":"indexes","label":"Индексы и оптимизация","count":8,"path":"databases/indexes.html"},{"id":"distributed","label":"Репликация и распределение","count":4,"path":"databases/distributed.html"},{"id":"redis","label":"Redis и кеширование","count":11,"path":"databases/redis.html"},{"id":"querying","label":"Запросы и представления","count":6,"path":"databases/querying.html"},{"id":"scaling","label":"Модели и масштабирование","count":6,"path":"databases/scaling.html"}]},{"id":"algorithms","label":"Алгоритмы","topics":[{"id":"graphs","label":"Графы и обходы","count":3,"path":"algorithms/graphs.html"}]},{"id":"architecture","label":"Архитектура сервисов","topics":[{"id":"services","label":"API и интеграции","count":3,"path":"architecture/services.html"},{"id":"security","label":"Безопасность","count":2,"path":"architecture/security.html"},{"id":"messaging","label":"Брокеры и доставка событий","count":8,"path":"architecture/messaging.html"},{"id":"distributed","label":"Распределённые системы","count":10,"path":"architecture/distributed.html"},{"id":"service_patterns","label":"Паттерны сервисов","count":6,"path":"architecture/service_patterns.html"},{"id":"scenarios","label":"Архитектурные сценарии","count":11,"path":"architecture/scenarios.html"}]},{"id":"reliability","label":"SRE и наблюдаемость","topics":[{"id":"sre","label":"SRE и показатели","count":3,"path":"reliability/sre.html"},{"id":"observability","label":"Метрики, логи и трассировка","count":6,"path":"reliability/observability.html"},{"id":"resilience","label":"Устойчивость сервисов","count":5,"path":"reliability/resilience.html"}]}];
  const body = document.body;
  const root = body.dataset.root || '.';
  const selected = body.dataset.topic || '';
  const allQuestions = body.dataset.page === 'all';
  const url = path => root + '/' + path;
  const sidebar = document.getElementById('site-sidebar');
  const content = window.InterviewProContent || Object.create(null);
  const catalog = window.InterviewProQuestionCatalog || { questions: [], relatedGroups: [] };
  const questionsById = new Map(catalog.questions.map(question => [question.id, question]));
  const topicByQuestionId = new Map(catalog.questions.map(question => [question.id, question.topic]));
  Object.entries(catalog.additionalQuestionRanges || {}).forEach(([topic, ranges]) => {
    ranges.forEach(([start, end]) => {
      for (let id = start; id <= end; id++) topicByQuestionId.set(id, topic);
    });
  });

  const navigation = groups.map(group => {
    const activeGroup = selected.startsWith(group.id + '/');
    const links = group.topics.map(topic => {
      const key = group.id + '/' + topic.id;
      return '<li><a href="' + url(topic.path) + '" data-topic-key="' + key + '"' +
        (selected === key ? ' class="active" aria-current="page"' : '') +
        '><span class="sidebar-remaining-counts topic-counts">' +
        '<span title="Осталось основных вопросов">В: <span data-remaining-questions></span></span>' +
        '<span title="Осталось уточнений">У: <span data-remaining-clarifications></span></span>' +
        '</span><span class="topic-label">' + topic.label + '</span></a></li>';
    }).join('');
    return '<details class="sidebar-dropdown level-1"' + (activeGroup ? ' open' : '') + '>' +
      '<summary data-group-key="' + group.id + '">' +
      '<span class="sidebar-remaining-counts group-counts">' +
      '<span title="Осталось основных вопросов">В: <span data-remaining-questions></span></span>' +
      '<span title="Осталось уточнений">У: <span data-remaining-clarifications></span></span>' +
      '</span><span class="group-label">' + group.label + '</span></summary>' +
      '<div class="level-1-content"><ul class="sidebar-topic-list">' + links + '</ul></div>' +
      '</details>';
  }).join('');
  sidebar.innerHTML =
    '<a href="' + url('index.html') + '" class="sidebar-brand"><span>🚀</span><span>InterviewPro</span></a>' +
    '<nav class="sidebar-nav" aria-label="Разделы теории">' +
    navigation +
    '<a href="' + url('index.html#questions') + '" class="sidebar-all-link sidebar-summary-link' +
    (allQuestions ? ' active' : '') + '"' + (allQuestions ? ' aria-current="page"' : '') +
    '><span>ИТОГИ</span><span class="sidebar-remaining-counts">' +
    '<span title="Осталось основных вопросов" aria-label="Осталось основных вопросов">В: <span id="remaining-questions"></span></span>' +
    '<span title="Осталось уточнений" aria-label="Осталось уточнений">У: <span id="remaining-clarifications"></span></span>' +
    '</span></a></nav>';

  const list = document.querySelector('.questions-list');
  if (!list) return;
  const studyStorageKey = 'interviewpro-theory-studied-v1';
  let studied = Object.create(null);
  try {
    studied = JSON.parse(localStorage.getItem(studyStorageKey) || '{}') || Object.create(null);
  } catch (_) {
    studied = Object.create(null);
  }
  const updateRemainingCounts = () => {
    const remainingByTopic = new Map(groups.flatMap(group => group.topics.map(topic => {
      const key = group.id + '/' + topic.id;
      return [key, { questions: topic.count, clarifications: catalog.clarificationCounts[key] || 0 }];
    })));
    topicByQuestionId.forEach((topic, id) => {
      if (studied['question-' + id] === true) {
        remainingByTopic.get(topic).questions--;
      }
    });
    Object.keys(studied).forEach(id => {
      const match = /^question-(\d+)-followup-[1-9]\d*$/.exec(id);
      if (!match || studied[id] !== true) return;
      const parentTopic = topicByQuestionId.get(Number(match[1]));
      if (parentTopic) {
        const topic = remainingByTopic.get(parentTopic);
        topic.clarifications = Math.max(0, topic.clarifications - 1);
      }
    });
    sidebar.querySelectorAll('[data-topic-key]').forEach(link => {
      const remaining = remainingByTopic.get(link.dataset.topicKey);
      link.querySelector('[data-remaining-questions]').textContent = String(remaining.questions);
      link.querySelector('[data-remaining-clarifications]').textContent = String(remaining.clarifications);
      const label = link.querySelector('.topic-label').textContent;
      link.setAttribute('aria-label', label + '. Осталось вопросов: ' + remaining.questions +
        ', уточнений: ' + remaining.clarifications);
    });
    sidebar.querySelectorAll('[data-group-key]').forEach(summary => {
      const group = groups.find(item => item.id === summary.dataset.groupKey);
      const remaining = group.topics.reduce((sum, topic) => {
        const counts = remainingByTopic.get(group.id + '/' + topic.id);
        sum.questions += counts.questions;
        sum.clarifications += counts.clarifications;
        return sum;
      }, { questions: 0, clarifications: 0 });
      summary.querySelector('[data-remaining-questions]').textContent = String(remaining.questions);
      summary.querySelector('[data-remaining-clarifications]').textContent = String(remaining.clarifications);
      summary.setAttribute('aria-label', group.label + '. Осталось вопросов: ' + remaining.questions +
        ', уточнений: ' + remaining.clarifications);
    });
    const totals = [...remainingByTopic.values()].reduce((sum, topic) => ({
      questions: sum.questions + topic.questions,
      clarifications: sum.clarifications + topic.clarifications
    }), { questions: 0, clarifications: 0 });
    document.getElementById('remaining-questions').textContent =
      String(totals.questions);
    document.getElementById('remaining-clarifications').textContent =
      String(totals.clarifications);
  };
  updateRemainingCounts();
  const restoreStudyState = () => {
    list.querySelectorAll('.question-card, .clarification-item').forEach(item => {
      const checkbox = item.querySelector(':scope > .question-checkbox input[type="checkbox"]');
      if (checkbox) checkbox.checked = studied[item.id] === true;
    });
  };
  const clarificationCheckboxes = card =>
    [...card.querySelectorAll(':scope > .answer-details > .clarifications > .clarification-item > .question-checkbox input[type="checkbox"]')];
  const syncQuestionCheckbox = card => {
    const checkbox = card?.querySelector(':scope > .question-checkbox input[type="checkbox"]');
    if (!checkbox) return false;
    const remaining = clarificationCheckboxes(card).filter(item => !item.checked).length;
    const message = remaining
      ? 'Сначала отметьте все уточнения. Осталось: ' + remaining
      : '';
    const label = checkbox.closest('.question-checkbox');
    const baseLabel = checkbox.dataset.studyLabel || checkbox.getAttribute('aria-label') || 'Отметить вопрос';
    checkbox.dataset.studyLabel = baseLabel;
    checkbox.setAttribute('aria-label', message ? baseLabel + '. ' + message : baseLabel);
    checkbox.title = message;
    if (label) label.title = message;
    checkbox.disabled = remaining > 0;
    if (!remaining || !checkbox.checked) return false;
    checkbox.checked = false;
    delete studied[card.id];
    return true;
  };
  const syncAllQuestionCheckboxes = () => {
    let changed = false;
    list.querySelectorAll('.question-card').forEach(card => {
      if (syncQuestionCheckbox(card)) changed = true;
    });
    if (changed) {
      saveStudyState();
      updateRemainingCounts();
    }
  };
  const saveStudyState = () => {
    try {
      localStorage.setItem(studyStorageKey, JSON.stringify(studied));
    } catch (_) {
      // A local file can still be used without persistent storage.
    }
  };
  list.addEventListener('change', event => {
    if (!event.target.matches('.question-checkbox input[type="checkbox"]')) return;
    const item = event.target.closest('.clarification-item, .question-card');
    if (!item?.id) return;
    const card = item.classList.contains('clarification-item') ? item.closest('.question-card') : item;
    if (item === card && event.target.checked &&
        clarificationCheckboxes(card).some(checkbox => !checkbox.checked)) {
      event.target.checked = false;
      syncQuestionCheckbox(card);
      return;
    }
    if (event.target.checked) studied[item.id] = true;
    else delete studied[item.id];
    if (item !== card) syncQuestionCheckbox(card);
    saveStudyState();
    updateRemainingCounts();
  });
  const section = (group, topic, summary) => {
    const key = group.id + '/' + topic.id;
    if (typeof content[key] !== 'string') {
      return '<p class="content-error">Не удалось загрузить раздел «' + topic.label + '».</p>';
    }
    const heading = summary ? 'h3' : 'h2';
    return '<section class="question-section" id="topic-' + group.id + '-' + topic.id + '">' +
      '<' + heading + '>' + topic.label + ' <small>(' + topic.count + ')</small></' + heading + '>' +
      content[key] + '</section>';
  };
  // Learning order within each topic: fundamentals, common use, then edge cases and design.
  // Stable question IDs remain unchanged so study state and related links keep working.
  const questionOrder = {
    'golang/basics': [123, 148, 165, 147, 132, 163, 150, 128, 144, 153, 142, 127, 124],
    'golang/concurrency': [143, 146, 131, 161, 164, 151, 145, 133, 156, 155, 157, 158, 152, 130, 129, 160, 135],
    'golang/runtime': [126, 140, 159, 125, 149, 162, 166, 139, 154, 137, 141, 136],
    'golang/ecosystem': [138, 134],
    'golang/language': [184, 185, 186, 191, 188, 189, 190, 193, 194, 195, 192, 187, 196, 197, 199, 198, 201, 202, 200],
    'golang/collections_deep': [246, 245, 243, 244, 248, 247],
    'golang/types': [254, 253, 256, 251, 257, 252, 258, 250, 249, 259, 255, 260],
    'golang/errors': [261, 264, 262, 263, 271, 265, 270, 266, 267, 268, 269],
    'golang/concurrency_patterns': [272, 275, 273, 278, 280, 274, 276, 279, 277, 434, 435],
    'golang/synchronization': [281, 282, 283, 287, 284, 285, 286, 288],
    'golang/runtime_deep': [292, 289, 290, 291, 293, 294, 296, 297, 295, 298],
    'golang/generics': [299, 307, 301, 302, 305, 306, 300, 304, 303],
    'golang/context_deep': [308, 309, 310, 311, 312, 315, 313],
    'golang/testing': [433, 316, 317, 321, 325, 318, 319, 320, 322, 323, 324],
    'golang/backend': [326, 327, 328, 332, 331, 329, 330, 333, 334, 335, 336, 337, 338, 339],
    'golang/design': [340, 342, 341, 343, 345, 344],
    'golang/runtime_internals': [350, 346, 347, 348, 349],
    'golang/optimization': [355, 354, 351, 352, 361, 358, 360, 362, 353, 363, 359, 356, 357, 364, 366, 365],
    'golang/build_security': [367, 431, 368, 369, 370],
    'linux/processes': [25, 20, 23, 6, 5, 27, 7, 8, 13, 12, 14, 17],
    'linux/memory': [19, 18, 28, 24, 11],
    'linux/kernel': [22, 26, 9, 21, 10, 16, 4, 15],
    'network/transport': [30, 43, 31, 33, 34, 32, 36, 41, 37, 45, 42],
    'network/http': [49, 48, 44, 47, 40, 46],
    'network/kubernetes': [35, 29, 39, 38],
    'containers/docker': [52, 54, 51, 57, 53, 55, 56],
    'containers/delivery': [59, 3, 50, 60, 58],
    'kubernetes/architecture': [65, 63, 66, 64, 61, 68, 67, 71, 80, 74],
    'kubernetes/operations': [69, 70, 75, 73, 79, 62, 72, 76, 78, 77],
    'databases/sql': [101, 102, 99, 100, 112, 110, 111, 90, 91, 103],
    'databases/postgresql': [114, 98, 115, 104, 93, 92, 116, 117, 83, 113, 94, 87, 86, 82],
    'databases/indexes': [95, 97, 96, 106, 108, 109, 105, 107],
    'databases/distributed': [89, 81, 85, 84],
    'databases/redis': [173, 178, 179, 180, 181, 176, 88, 174, 175, 177, 172],
    'databases/querying': [389, 391, 390, 393, 436, 392],
    'databases/scaling': [394, 432, 398, 395, 396, 397],
    'algorithms/graphs': [399, 401, 400],
    'architecture/services': [168, 167, 170],
    'architecture/security': [182, 183],
    'architecture/messaging': [387, 388, 381, 383, 384, 386, 385, 382],
    'architecture/distributed': [371, 373, 379, 372, 378, 377, 376, 375, 380, 374],
    'architecture/service_patterns': [402, 403, 406, 407, 405, 404],
    'architecture/scenarios': [415, 416, 417, 408, 413, 412, 410, 414, 409, 411, 418],
    'reliability/sre': [2, 121, 1],
    'reliability/observability': [169, 120, 171, 118, 119, 122],
    'reliability/resilience': [423, 420, 419, 421, 422]
  };
  const sortQuestions = () => {
    list.querySelectorAll('.question-section').forEach(section => {
      const topic = section.id.replace(/^topic-/, '').replace(/-/, '/');
      const order = questionOrder[topic];
      if (!order) return;
      const rank = new Map(order.map((id, index) => ['question-' + id, index]));
      [...section.querySelectorAll(':scope > .question-card')]
        .sort((a, b) => (rank.get(a.id) ?? Infinity) - (rank.get(b.id) ?? Infinity))
        .forEach(card => section.append(card));
    });
  };
  // Indices are the stable suffixes of clarification IDs, not their display positions.
  const clarificationOrder = {
    19: [3, 1, 2, 4, 5],
    20: [6, 2, 1, 3, 4, 5],
    21: [3, 1, 2],
    22: [1, 3, 2],
    23: [4, 2, 3, 1],
    24: [1, 3, 2, 4],
    25: [1, 2, 3, 4],
    26: [1, 2, 3],
    27: [5, 1, 2, 4, 3],
    28: [3, 1, 2],
    43: [6, 1, 2, 3, 4, 5],
    44: [1, 2, 4, 3],
    90: [7, 5, 6, 2, 1, 3, 4, 8],
    91: [1, 2, 4, 3],
    92: [3, 2, 1, 4],
    93: [1, 2, 4, 3],
    94: [1, 2, 3, 4],
    95: [1, 2, 3, 4],
    96: [3, 1, 2, 4],
    97: [4, 1, 2, 3, 5, 6],
    98: [1, 2, 3, 4],
    99: [1, 2, 3],
    100: [1, 2],
    101: [2, 1],
    103: [1, 2],
    104: [2, 1],
    105: [1, 2],
    106: [1, 2],
    107: [1, 2],
    108: [1, 2],
    109: [1, 2],
    110: [1, 2],
    111: [1, 2],
    112: [1, 2],
    113: [1, 2],
    114: [1, 2],
    115: [1, 2],
    116: [1, 2],
    117: [1, 3, 2, 4],
    140: [3, 1, 2, 4],
    141: [1, 6, 7, 5, 2, 3, 9, 4, 8],
    142: [1, 5, 6, 7, 2, 3, 4],
    143: [4, 1, 5, 6, 7, 2, 3],
    146: [5, 3, 2, 1, 6, 7, 9, 4, 8, 10, 11, 12],
    147: [1, 5, 2, 6, 3, 4],
    149: [1, 2, 4, 3],
    150: [1, 2, 3, 4],
    151: [2, 1, 4, 3],
    152: [1, 2, 3, 4],
    153: [1, 4, 2, 3],
    154: [1, 3, 4, 2],
    155: [3, 2, 4, 1],
    156: [1, 2, 3, 4],
    157: [1, 2, 3, 4],
    158: [4, 2, 3, 1],
    159: [1, 2, 3, 4],
    167: [4, 1, 5, 6, 7, 8, 2, 3],
    168: [1, 2, 3],
    169: [1, 4, 2, 7, 5, 6, 3],
    172: [2, 1, 3],
    173: [1, 3, 2],
    174: [2, 1],
    175: [1, 2],
    176: [1, 2, 3],
    177: [1, 2],
    178: [1, 2],
    179: [2, 1],
    180: [1, 2],
    181: [1, 2],
    182: [1, 2],
    183: [1, 2]
  };
  const sortClarifications = () => {
    list.querySelectorAll('.question-card').forEach(card => {
      const questionId = Number(card.id.replace('question-', ''));
      const order = clarificationOrder[questionId];
      if (!order) return;
      const container = card.querySelector(':scope > .answer-details > .clarifications');
      if (!container) return;
      const rank = new Map(order.map((index, position) =>
        ['question-' + questionId + '-followup-' + index, position]));
      [...container.querySelectorAll(':scope > .clarification-item')]
        .sort((left, right) => (rank.get(left.id) ?? Infinity) - (rank.get(right.id) ?? Infinity))
        .forEach(item => container.append(item));
    });
  };
  const numberCards = () => {
    list.querySelectorAll('.question-card').forEach((card, index) => {
      const number = card.querySelector('.main-question .question-text > strong');
      if (number) number.textContent = String(index + 1) + '.';
    });
  };
  const makeDisclosure = (container, questionClass, nestedContent) => {
    const label = container.querySelector(':scope > .' + questionClass);
    const details = container.querySelector(':scope > .answer-details');
    if (!label || !details) return;
    const checkbox = label.querySelector('input[type="checkbox"]');
    const text = label.querySelector('.question-text');
    const summary = details.querySelector(':scope > summary');
    if (!checkbox || !text || !summary) return;

    checkbox.setAttribute('aria-label', 'Отметить как изученный: ' + text.textContent.trim());
    label.className = 'question-checkbox';
    label.replaceChildren(checkbox);
    summary.className = questionClass;
    summary.replaceChildren(text);
    if (nestedContent) {
      const extra = container.querySelector(':scope > .' + nestedContent);
      if (extra) details.append(extra);
    }
  };
  const makeQuestionDisclosures = () => {
    list.querySelectorAll('.question-card').forEach(card => {
      makeDisclosure(card, 'main-question', 'clarifications');
      const details = card.querySelector(':scope > .answer-details');
      const clarificationCount = details?.querySelectorAll(':scope > .clarifications > .clarification-item').length || 0;
      const summary = details?.querySelector(':scope > .main-question');
      if (clarificationCount && summary) {
        const badge = document.createElement('span');
        badge.className = 'clarification-count';
        badge.textContent = clarificationCount + ' уточн.';
        badge.setAttribute('aria-label', 'Уточнений: ' + clarificationCount);
        summary.classList.add('has-clarifications');
        summary.append(badge);
      }
      const answer = details?.querySelector(':scope > .answer-box');
      if (answer && !details.querySelector(':scope > .clarifications')) {
        const divider = document.createElement('div');
        divider.className = 'answer-section-divider';
        divider.textContent = 'Связанность';
        answer.after(divider);
      }
      card.querySelectorAll(':scope > .answer-details > .clarifications > .clarification-item')
        .forEach(followup => makeDisclosure(followup, 'clarification-question'));
    });
  };
  const highlightAnswerKeys = () => {
    list.querySelectorAll('.answer-box').forEach(answer => {
      const answerLength = answer.textContent.trim().length;
      const emphasis = [...answer.querySelectorAll('strong')].filter(node => {
        const phrase = node.textContent.trim();
        return phrase && !/^(ответ|суть|итог|важно|вывод)\s*:?$/i.test(phrase) &&
          !phrase.endsWith(':') && phrase.length <= 85 &&
          phrase.length < answerLength * 0.55 && !node.closest('pre, .answer-meta');
      });
      if (emphasis.length) {
        let used = 0;
        emphasis.forEach(node => {
          const length = node.textContent.trim().length;
          if (used + length > 90 || used >= 2) return;
          node.classList.add('answer-key');
          used += length;
        });
        if (used) return;
      }
      // Plain-text answers get one short phrase from their explanation.
      const walker = document.createTreeWalker(answer, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (node.parentElement.closest('pre, code, strong, button, .answer-meta')) return NodeFilter.FILTER_REJECT;
          return /[\p{L}\p{N}]/u.test(node.textContent)
            ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });
      let node;
      while ((node = walker.nextNode())) {
        const source = node.textContent;
        const prefix = /^\s*(?:(?:Ответ|Суть|Итог)\s*:\s*)?/i.exec(source)[0].length;
        const words = [...source.slice(prefix).matchAll(/[\p{L}\p{N}][\p{L}\p{N}._+-]*/gu)];
        if (!words.length) continue;
        const maxLength = Math.min(68, Math.max(12, Math.floor(answerLength * 0.4)));
        let last = 0;
        for (let index = 0; index < Math.min(7, words.length); index++) {
          const end = words[index].index + words[index][0].length;
          if (end > maxLength && last) break;
          last = end;
        }
        if (!last) continue;
        const range = document.createRange();
        range.setStart(node, prefix + words[0].index);
        range.setEnd(node, prefix + last);
        const highlight = document.createElement('span');
        highlight.className = 'answer-key';
        highlight.append(range.extractContents());
        range.insertNode(highlight);
        break;
      }
    });
  };
  // These are study recommendations, not observed interview statistics.
  const juniorTopics = new Set(['golang/basics', 'golang/language', 'linux/processes', 'databases/sql']);
  const seniorTopics = new Set([
    'golang/concurrency_patterns', 'golang/synchronization', 'golang/runtime_deep',
    'golang/runtime_internals', 'golang/optimization', 'golang/design',
    'network/kubernetes', 'kubernetes/operations', 'databases/distributed',
    'databases/scaling', 'architecture/messaging', 'architecture/distributed',
    'architecture/service_patterns', 'reliability/sre', 'reliability/resilience'
  ]);
  const leadTopics = new Set(['architecture/scenarios']);
  const recommendedGrade = topic => leadTopics.has(topic) ? 'Lead' :
    seniorTopics.has(topic) ? 'Senior' : juniorTopics.has(topic) ? 'Junior' : 'Middle';
  const recommendedFollowupGrade = item => {
    const question = item.querySelector(':scope > .answer-details > .clarification-question .question-text')
      ?.textContent.toLowerCase() || '';
    if (/архитектур|спроектир|стратеги|компромисс|trade.off|мульти.?регион|disaster recovery|границ[ыау] сервис|масштабир/.test(question)) return 'Lead';
    if (/рантайм|планировщик|сборщик мусора|\bgc\b|гонк[аиу]|data race|deadlock|утечк[аиу]|fencing|консенсус|репликац|шардир|изоляци|транзакц|профилир|идемпотент|блокиров|memory model|памят[ьи]|allocation|небезопасн|unsafe/.test(question)) return 'Senior';
    if (/^(↳\s*)?(что такое|для чего|зачем|какой|какая|какие|чем отличается|в ч[её]м разница)/.test(question)) return 'Junior';
    return 'Middle';
  };
  const addAnswerStatistics = () => {
    list.querySelectorAll('.question-section').forEach(section => {
      const topic = section.id.replace(/^topic-/, '').replace(/-/, '/');
      const grade = recommendedGrade(topic);
      section.querySelectorAll('.question-card').forEach(card => {
        // A frequency class is assigned only when a count with a known source exists.
        card.classList.add('frequency-unrated');
        const addMeta = (item, minutes) => {
          const levelName = item.dataset.grade ||
            (item.classList.contains('clarification-item') ? recommendedFollowupGrade(item) : grade);
          item.classList.add('grade-' + levelName.toLowerCase());
          const answer = item.querySelector(':scope > .answer-details > .answer-box');
          if (!answer || answer.querySelector(':scope > .answer-meta')) return;
          const meta = document.createElement('div');
          meta.className = 'answer-meta';
          meta.setAttribute('aria-label', 'Статистика вопроса');
          const time = document.createElement('span');
          time.className = 'badge';
          time.textContent = '⏱️ ' + minutes + ' мин · ориентир';
          const frequency = document.createElement('span');
          frequency.className = 'badge';
          frequency.textContent = 'Частота: нет данных';
          const level = document.createElement('span');
          level.className = 'badge';
          level.textContent = 'Уровень: ' + levelName + ' · ориентир';
          level.title = item.classList.contains('clarification-item')
            ? 'Ориентировочный уровень этого уточнения'
            : 'Ориентировочный уровень основного вопроса';
          meta.append(time, frequency, level);
          answer.prepend(meta);
        };
        addMeta(card, 5);
        card.querySelectorAll(':scope > .answer-details > .clarifications > .clarification-item')
          .forEach(item => addMeta(item, 2));
      });
    });
  };
  const centerQuestionCheckboxes = () => {
    if (!window.ResizeObserver) return;
    const observer = new ResizeObserver(entries => {
      entries.forEach(entry => {
        const summary = entry.target;
        const container = summary.closest('.clarification-item, .question-card');
        const summaryRect = summary.getBoundingClientRect();
        if (container && summaryRect.height) {
          const checkbox = container.querySelector(':scope > .question-checkbox');
          if (checkbox) {
            const containerTop = container.getBoundingClientRect().top;
            const checkboxHeight = checkbox.getBoundingClientRect().height;
            checkbox.style.top = Math.max(0,
              summaryRect.top - containerTop + (summaryRect.height - checkboxHeight) / 2
            ) + 'px';
          }
        }
      });
    });
    list.querySelectorAll('.question-card > .answer-details > .main-question, .clarification-item > .answer-details > .clarification-question')
      .forEach(summary => observer.observe(summary));
  };
  const relatedQuestions = question => {
    const scores = new Map();
    catalog.relatedGroups.forEach(group => {
      if (!group.includes(question.id)) return;
      group.forEach(id => {
        if (id !== question.id && questionsById.has(id)) {
          scores.set(id, (scores.get(id) || 0) + 1 / (group.length - 1));
        }
      });
    });
    const related = [...scores.keys()].sort((left, right) =>
      scores.get(right) - scores.get(left) || Math.abs(left - question.id) - Math.abs(right - question.id)
    );
    const sameTopic = catalog.questions.filter(item => item.topic === question.topic && item.id !== question.id);
    sameTopic.sort((left, right) =>
      Math.abs(left.id - question.id) - Math.abs(right.id - question.id)
    );
    sameTopic.forEach(item => {
      if (related.length < 3 && !related.includes(item.id)) related.push(item.id);
    });
    return related.slice(0, 3).map(id => questionsById.get(id));
  };
  const addRelatedQuestions = () => {
    list.querySelectorAll('.question-card').forEach(card => {
      const question = questionsById.get(Number(card.id.replace('question-', '')));
      const details = card.querySelector(':scope > .answer-details');
      if (!question || !details) return;
      const related = relatedQuestions(question);
      if (!related.length) return;
      const section = document.createElement('section');
      section.className = 'related-questions';
      section.setAttribute('aria-label', 'Связанные вопросы');
      const links = document.createElement('ul');
      related.forEach(item => {
        const row = document.createElement('li');
        const link = document.createElement('a');
        link.href = url('index.html#question-' + item.id);
        link.textContent = item.title;
        row.append(link);
        links.append(row);
      });
      if (details.querySelector(':scope > .clarifications')) {
        const divider = document.createElement('div');
        divider.className = 'answer-section-divider';
        divider.textContent = 'Связанность';
        details.append(divider);
      }
      section.append(links);
      details.append(section);
    });
  };
  const additionalSources = {
    'question-143-followup-5': [
      ['Исходный код Go 1.22: предел стека горутины', 'https://github.com/golang/go/blob/go1.22.0/src/runtime/proc.go#L146-L153']
    ],
    'question-340': [
      ['Официальное руководство Go: организация модуля', 'https://go.dev/doc/modules/layout']
    ],
    'question-355': [
      ['Compiler Explorer: сравнение кода и ассемблера', 'https://godbolt.org/']
    ]
  };
  const addAdditionalSources = () => {
    Object.entries(additionalSources).forEach(([id, sources]) => {
      const item = list.querySelector('#' + id);
      const details = item?.querySelector(':scope > .answer-details');
      if (!details) return;
      const divider = document.createElement('div');
      divider.className = 'answer-section-divider';
      divider.textContent = 'Дополнительные источники';
      const section = document.createElement('section');
      section.className = 'additional-sources';
      section.setAttribute('aria-label', 'Дополнительные источники');
      const links = document.createElement('ul');
      sources.forEach(([label, href]) => {
        const row = document.createElement('li');
        const link = document.createElement('a');
        link.href = href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = label;
        row.append(link);
        links.append(row);
      });
      section.append(links);
      const relatedDivider = [...details.querySelectorAll(':scope > .answer-section-divider')]
        .find(node => node.textContent === 'Связанность');
      details.insertBefore(divider, relatedDivider || null);
      details.insertBefore(section, relatedDivider || null);
    });
  };
  const scrollToHash = () => {
    if (!location.hash) return;
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (!target) return;
    const card = target.closest('.question-card');
    if (card) {
      const details = card.querySelector(':scope > .answer-details');
      if (details) details.open = true;
    }
    if (target.classList.contains('clarification-item')) {
      const details = target.querySelector(':scope > .answer-details');
      if (details) details.open = true;
    }
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  };
  window.addEventListener('hashchange', scrollToHash);
  list.addEventListener('click', event => {
    const link = event.target.closest('.related-questions a');
    if (link && new URL(link.href).pathname === location.pathname) {
      requestAnimationFrame(scrollToHash);
    }
  });

  const collectStudyRows = scope => {
    const questions = [];
    const clarifications = [];
    scope.querySelectorAll('.question-card').forEach(card => {
      const title = card.querySelector(':scope > .answer-details > .main-question .question-text');
      const checkbox = card.querySelector(':scope > .question-checkbox input[type="checkbox"]');
      if (!title || !checkbox) return;
      const number = title.querySelector('strong')?.textContent.replace(/\D/g, '') || '';
      const questionText = title.textContent.trim().replace(/^\d+\.\s*/, '');
      questions.push([number, questionText, checkbox.checked ? '✓' : '']);
      card.querySelectorAll(':scope > .answer-details > .clarifications .clarification-item').forEach(item => {
        const text = item.querySelector(':scope > .answer-details > .clarification-question .question-text');
        const checked = item.querySelector(':scope > .question-checkbox input[type="checkbox"]');
        if (text && checked) {
          clarifications.push([number, text.textContent.trim().replace(/^↳\s*/, ''), checked.checked ? '✓' : '']);
        }
      });
    });
    return { questions, clarifications };
  };
  const addStudyExportButtons = () => {
    const makeButtons = scope => {
      const actions = document.createElement('div');
      actions.className = 'study-export-actions';
      actions.innerHTML = '<button type="button" class="hero-btn hero-btn-primary" data-study-export="csv">Скачать CSV: вопросы и уточнения</button>' +
        '<button type="button" class="hero-btn hero-btn-primary" data-study-export="txt">Скачать текст зачёркнутых вопросов</button>';
      scope.append(actions);
      return actions;
    };
    if (allQuestions) {
      const actions = makeButtons(list);
      const copy = document.createElement('button');
      copy.type = 'button';
      copy.id = 'copy-studied-numbers';
      copy.className = 'hero-btn hero-btn-primary';
      copy.textContent = 'Скопировать номера отмеченных';
      actions.append(copy);
    } else {
      list.querySelectorAll('.question-section').forEach(makeButtons);
    }
  };
  const setupNumberControls = () => {
    const form = document.getElementById('study-number-form');
    const input = document.getElementById('study-number-input');
    const status = document.getElementById('study-number-status');
    const copyButton = document.getElementById('copy-studied-numbers');
    if (!form || !input || !status || !copyButton) return;
    const checkboxes = new Map();
    list.querySelectorAll('.question-card').forEach((card, index) => {
      const number = String(index + 1);
      const main = card.querySelector(':scope > .question-checkbox input[type="checkbox"]');
      if (main) checkboxes.set(number, main);
      card.querySelectorAll(':scope > .answer-details > .clarifications .clarification-item')
        .forEach((item, followupIndex) => {
          const checkbox = item.querySelector(':scope > .question-checkbox input[type="checkbox"]');
          if (checkbox) checkboxes.set(number + '.' + (followupIndex + 1), checkbox);
        });
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      const tokens = [...new Set(input.value.trim().split(/[\s,;]+/).filter(Boolean))];
      if (!tokens.length) {
        status.textContent = 'Введите хотя бы один номер вопроса или уточнения.';
        return;
      }
      const missing = [];
      const blocked = [];
      const targets = [];
      let marked = 0;
      for (const raw of tokens) {
        const number = raw.replace(/\.$/, '');
        const checkbox = /^\d+(?:\.\d+)?$/.test(number) ? checkboxes.get(number) : null;
        if (!checkbox) {
          missing.push(raw);
          continue;
        }
        targets.push({ raw, checkbox });
      }
      targets.sort((left, right) =>
        Number(right.checkbox.closest('.clarification-item') !== null) -
        Number(left.checkbox.closest('.clarification-item') !== null));
      for (const { raw, checkbox } of targets) {
        if (checkbox.disabled) {
          blocked.push(raw);
          continue;
        }
        checkbox.checked = true;
        const item = checkbox.closest('.clarification-item, .question-card');
        if (item?.id) studied[item.id] = true;
        if (item?.classList.contains('clarification-item')) {
          syncQuestionCheckbox(item.closest('.question-card'));
        }
        marked++;
      }
      if (marked) {
        saveStudyState();
        updateRemainingCounts();
      }
      status.textContent = 'Отмечено: ' + marked +
        (missing.length ? '. Не найдены: ' + missing.join(', ') : '') +
        (blocked.length ? '. Сначала отметьте все уточнения: ' + blocked.join(', ') : '') + '.';
    });
    copyButton.addEventListener('click', async () => {
      const numbers = [...checkboxes].filter(([, checkbox]) => checkbox.checked)
        .map(([number]) => number);
      if (!numbers.length) {
        copyButton.textContent = 'Нет отмеченных номеров';
      } else {
        const value = numbers.join(', ');
        try {
          if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
          await navigator.clipboard.writeText(value);
          copyButton.textContent = 'Номера скопированы';
        } catch (_) {
          const helper = document.createElement('textarea');
          helper.value = value;
          helper.style.position = 'fixed';
          helper.style.opacity = '0';
          document.body.append(helper);
          helper.select();
          copyButton.textContent = document.execCommand('copy')
            ? 'Номера скопированы' : 'Не удалось скопировать';
          helper.remove();
        }
      }
      window.setTimeout(() => {
        copyButton.textContent = 'Скопировать номера отмеченных';
      }, 2000);
    });
  };
  const downloadStudyFile = (name, content, type) => {
    const address = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement('a');
    link.href = address;
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(address), 1000);
  };
  const csvContent = (headers, rows) => '\uFEFF' + [headers, ...rows]
    .map(row => row.map(value => '"' + String(value).replace(/"/g, '""') + '"').join(';'))
    .join('\r\n');
  list.addEventListener('click', event => {
    const button = event.target.closest('[data-study-export]');
    if (!button) return;
    const section = button.closest('.question-section');
    const scope = section || list;
    const fileBase = section ? section.id.replace(/^topic-/, '') : 'all-questions';
    const { questions, clarifications } = collectStudyRows(scope);
    if (button.dataset.studyExport === 'csv') {
      downloadStudyFile(fileBase + '-questions.csv',
        csvContent(['Номер вопроса', 'Вопрос', 'Изучено'], questions), 'text/csv;charset=utf-8');
      downloadStudyFile(fileBase + '-clarifications.csv',
        csvContent(['Номер вопроса', 'Уточнение', 'Изучено'], clarifications), 'text/csv;charset=utf-8');
    } else if (button.dataset.studyExport === 'txt') {
      const completed = questions.filter(row => row[2]);
      const text = completed.length
        ? completed.map(row => row[0] + '. ' + row[1]).join('\n\n')
        : 'Изученных вопросов пока нет.';
      downloadStudyFile(fileBase + '-studied.txt', text, 'text/plain;charset=utf-8');
    }
  });

  if (allQuestions) {
    list.innerHTML = groups.map(group =>
      '<h2 class="group-heading" id="group-' + group.id + '">' + group.label + '</h2>' +
      group.topics.map(topic => section(group, topic, true)).join('')
    ).join('');
    sortQuestions();
    numberCards();
    makeQuestionDisclosures();
    sortClarifications();
    highlightAnswerKeys();
    addAnswerStatistics();
    restoreStudyState();
    syncAllQuestionCheckboxes();
    centerQuestionCheckboxes();
    addRelatedQuestions();
    addAdditionalSources();
    addStudyExportButtons();
    setupNumberControls();
    scrollToHash();
    return;
  }

  const group = groups.find(item => selected.startsWith(item.id + '/'));
  const topic = group && group.topics.find(item => selected === group.id + '/' + item.id);
  if (!topic) {
    list.innerHTML = '<p class="content-error">Раздел не найден.</p>';
    return;
  }
  document.title = topic.label + ' — InterviewPro';
  document.getElementById('page-title').textContent = topic.label;
  document.getElementById('page-description').textContent =
    group.label + ' · ' + topic.count + ' основных вопросов. Уточнения находятся внутри ответов.';
  list.innerHTML = section(group, topic, false);
  sortQuestions();
  numberCards();
  makeQuestionDisclosures();
  sortClarifications();
  highlightAnswerKeys();
  addAnswerStatistics();
  restoreStudyState();
  syncAllQuestionCheckboxes();
  centerQuestionCheckboxes();
  addRelatedQuestions();
  addAdditionalSources();
  addStudyExportButtons();
  scrollToHash();
})();
