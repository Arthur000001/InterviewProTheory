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
    '<section class="sidebar-study-timer" aria-label="Таймер занятий">' +
    '<div class="sidebar-study-time" id="study-timer-display" role="timer">00:00</div>' +
    '<div class="sidebar-study-controls">' +
    '<button type="button" id="study-timer-start">Запуск</button>' +
    '<button type="button" id="study-timer-pause">Пауза</button>' +
    '<button type="button" id="study-timer-stop">Стоп</button>' +
    '</div></section>' +
    '<a href="' + url('index.html') + '" class="sidebar-brand"><span>🚀</span><span>InterviewPro</span></a>' +
    '<nav class="sidebar-nav" aria-label="Разделы теории">' +
    navigation +
    '<a href="' + url('index.html#questions') + '" class="sidebar-all-link sidebar-summary-link' +
    (allQuestions ? ' active' : '') + '"' + (allQuestions ? ' aria-current="page"' : '') +
    '><span>ИТОГИ</span><span class="sidebar-remaining-counts">' +
    '<span title="Осталось основных вопросов" aria-label="Осталось основных вопросов">В: <span id="remaining-questions"></span></span>' +
    '<span title="Осталось уточнений" aria-label="Осталось уточнений">У: <span id="remaining-clarifications"></span></span>' +
    '</span></a></nav>';

  const timerStorageKey = 'interviewpro-theory-study-timer-v1';
  let timer = { elapsedMs: 0, startedAt: null };
  try {
    const saved = JSON.parse(localStorage.getItem(timerStorageKey) || 'null');
    if (saved && Number.isFinite(saved.elapsedMs) && saved.elapsedMs >= 0 &&
        (saved.startedAt === null || Number.isFinite(saved.startedAt))) {
      timer = saved;
    }
  } catch (_) {
    // The timer remains usable in this page when browser storage is unavailable.
  }
  const timerDisplay = sidebar.querySelector('#study-timer-display');
  const timerStart = sidebar.querySelector('#study-timer-start');
  const timerPause = sidebar.querySelector('#study-timer-pause');
  const timerStop = sidebar.querySelector('#study-timer-stop');
  const saveTimer = () => {
    try { localStorage.setItem(timerStorageKey, JSON.stringify(timer)); } catch (_) { /* storage unavailable */ }
  };
  const renderTimer = () => {
    const elapsed = Math.max(0, timer.elapsedMs + (timer.startedAt === null ? 0 : Date.now() - timer.startedAt));
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const pad = value => String(value).padStart(2, '0');
    timerDisplay.textContent = minutes >= 60
      ? pad(Math.floor(minutes / 60)) + ':' + pad(minutes % 60) + ':' + pad(seconds % 60)
      : pad(minutes) + ':' + pad(seconds % 60);
    timerStart.disabled = timer.startedAt !== null;
    timerPause.disabled = timer.startedAt === null;
    timerStop.disabled = timer.startedAt === null && timer.elapsedMs === 0;
  };
  timerStart.addEventListener('click', () => {
    if (timer.startedAt !== null) return;
    timer.startedAt = Date.now();
    saveTimer();
    renderTimer();
  });
  timerPause.addEventListener('click', () => {
    if (timer.startedAt === null) return;
    timer.elapsedMs += Math.max(0, Date.now() - timer.startedAt);
    timer.startedAt = null;
    saveTimer();
    renderTimer();
  });
  timerStop.addEventListener('click', () => {
    timer = { elapsedMs: 0, startedAt: null };
    saveTimer();
    renderTimer();
  });
  window.addEventListener('storage', event => {
    if (event.key !== timerStorageKey) return;
    try {
      const saved = JSON.parse(event.newValue || 'null');
      timer = saved && Number.isFinite(saved.elapsedMs) && saved.elapsedMs >= 0 &&
        (saved.startedAt === null || Number.isFinite(saved.startedAt))
        ? saved : { elapsedMs: 0, startedAt: null };
      renderTimer();
    } catch (_) { /* ignore invalid data from another tab */ }
  });
  renderTimer();
  window.setInterval(renderTimer, 1000);

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
  // Only answers with a concrete, useful example receive a code button.
  // Existing code blocks in the answers are picked up below as well.
  const extraCodeExamples = {
    'question-185': ['go', 'var items []int\nitems = append(items, 42) // nil-слайс готов к append\n\nvar counts map[string]int\n_ = counts["go"] // читать можно\ncounts = make(map[string]int)\ncounts["go"] = 1'],
    'question-185-followup-1': ['go', 'var values []int\nvalues = append(values, 1) // присвоить результат обязательно'],
    'question-186': ['go', 'var n int             // 0\nvalue := 3            // локальная переменная\np := new(int)         // *int, указывает на 0\nitems := make([]int, 0, 4)\ncounts := make(map[string]int)'],
    'question-186-followup-1': ['go', 'p := new(map[string]int) // *p == nil\n*p = make(map[string]int)\n(*p)["go"] = 1'],
    'question-187': ['go', 'func run() (err error) {\n    if true {\n        err := errors.New("failed") // новая err внутри блока\n        _ = err\n    }\n    return err // внешняя err всё ещё nil\n}'],
    'question-188': ['go', 'type State int\nconst (\n    StateNew State = iota\n    StateRunning\n    StateDone\n)'],
    'question-190': ['go', 'func change(items []int) {\n    items[0] = 7             // видимо вызывающему\n    items = append(items, 8) // длина слайса вызывающего не меняется\n}\nvalues := []int{1}\nchange(values) // values == []int{7}'],
    'question-191-followup-1': ['go', 'type User struct {\n    Name string `json:"name"`\n    password string `json:"password"`\n}\ndata, _ := json.Marshal(User{Name: "Ada", password: "secret"})\nfmt.Println(string(data)) // {"name":"Ada"}'],
    'question-193': ['go', 'type UserID int        // новый тип\ntype Alias = int       // тот же тип, что int\nfunc (id UserID) Valid() bool { return id > 0 }'],
    'question-194': ['go', 'package main\nimport "fmt"\n\nfunc main() {\n    n := 1\n    switch n {\n    case 1:\n        fmt.Println("one")\n        fallthrough\n    case 2:\n        fmt.Println("two") // условие case 2 не проверяется\n    }\n    switch {\n    case n > 0:\n        fmt.Println("positive")\n    }\nLoop:\n    for {\n        select {\n        default:\n            break Loop // выход из for, а не только из select\n        }\n    }\n}'],
    'question-194-followup-1': ['go', 'Loop:\nfor {\n    select {\n    default:\n        break Loop // обычный break завершил бы только select\n    }\n}'],
    'question-195': ['go', 'type State uint8\nconst (\n    StateUnknown State = iota\n    StateReady\n    StateDone\n)\nfunc (s State) Valid() bool { return s <= StateDone }'],
    'question-197': ['go', 'array := [2]int{1, 2}\narrayCopy := array\narrayCopy[0] = 9\n\nslice := []int{1, 2}\nsliceCopy := slice\nsliceCopy[0] = 9\nfmt.Println(array[0], slice[0]) // 1 9'],
    'question-198': ['go', 'small := large[100:110] // всё ещё держит large\nindependent := append([]byte(nil), small...)\n// independent хранит собственный массив'],
    'question-199': ['go', 'var nilItems []int\nemptyItems := []int{}\na, _ := json.Marshal(nilItems)\nb, _ := json.Marshal(emptyItems)\nfmt.Println(string(a), string(b)) // null []'],
    'question-200': ['go', 'type Item struct { Count int }\nitems := map[string]Item{"x": {Count: 1}}\nitem := items["x"]\nitem.Count++\nitems["x"] = item // записать изменённую копию обратно'],
    'question-201': ['go', 'text := "Go😀"\nfmt.Println(len(text)) // 6 байтов\nfor byteIndex, r := range text {\n    fmt.Printf("%d %c\\n", byteIndex, r)\n} // индексы 0, 1, 2'],
    'question-202': ['go', 'var builder strings.Builder\nfor _, part := range parts {\n    builder.WriteString(part)\n}\nresult := builder.String()'],
    'question-249': ['go', 'var p *int = nil\nvar value any = p\nfmt.Println(p == nil)     // true\nfmt.Println(value == nil) // false: динамический тип *int сохранён'],
    'question-262': ['go', 'var ErrNotFound = errors.New("not found")\n\nfunc find() error {\n    return fmt.Errorf("user: %w", ErrNotFound)\n}\nfmt.Println(errors.Is(find(), ErrNotFound)) // true'],
    'question-264': ['go', 'return fmt.Errorf("load user %d: %w", id, err)\n// Вызывающий код может проверить errors.Is или errors.As.'],
    'question-266': ['go', 'func safe() {\n    defer func() {\n        if value := recover(); value != nil {\n            fmt.Println("panic:", value)\n        }\n    }()\n    panic("example")\n}'],
    'question-273': ['go', 'jobs := make(chan int)\ngo func() {\n    defer close(jobs) // закрывает отправитель\n    for _, job := range []int{1, 2, 3} {\n        jobs <- job\n    }\n}()\nfor job := range jobs {\n    fmt.Println(job)\n}'],
    'question-274': ['go', 'slots := make(chan struct{}, 3)\nvar wg sync.WaitGroup\nfor _, job := range jobs {\n    slots <- struct{}{} // ждём свободное место\n    wg.Add(1)\n    go func(job Job) {\n        defer wg.Done()\n        defer func() { <-slots }()\n        process(job)\n    }(job)\n}\nwg.Wait()'],
    'question-275': ['go', 'var wg sync.WaitGroup\nfor _, job := range jobs {\n    wg.Add(1)\n    go func(job Job) {\n        defer wg.Done()\n        process(job)\n    }(job)\n}\nwg.Wait()'],
    'question-278': ['go', 'func worker(ctx context.Context, jobs <-chan Job) {\n    for {\n        select {\n        case <-ctx.Done():\n            return\n        case job, ok := <-jobs:\n            if !ok { return }\n            process(job)\n        }\n    }\n}'],
    'question-299': ['go', 'func Contains[T comparable](items []T, want T) bool {\n    for _, item := range items {\n        if item == want { return true }\n    }\n    return false\n}'],
    'question-316': ['go', 'func TestAdd(t *testing.T) {\n    cases := []struct { name string; a, b, want int }{\n        {"positive", 1, 2, 3},\n        {"zero", 0, 0, 0},\n    }\n    for _, tc := range cases {\n        t.Run(tc.name, func(t *testing.T) {\n            if got := add(tc.a, tc.b); got != tc.want {\n                t.Errorf("got %d, want %d", got, tc.want)\n            }\n        })\n    }\n}'],
    'question-318': ['go', 'func BenchmarkEncode(b *testing.B) {\n    for i := 0; i < b.N; i++ {\n        encode(sample)\n    }\n}'],
    'question-326': ['go', 'mux := http.NewServeMux()\nmux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {\n    w.WriteHeader(http.StatusNoContent)\n})\nhttp.ListenAndServe(":8080", mux)'],
    'question-328': ['go', 'func logging(next http.Handler) http.Handler {\n    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n        log.Print(r.Method, " ", r.URL.Path)\n        next.ServeHTTP(w, r)\n    })\n}'],
    'question-330': ['go', 'ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)\ndefer cancel()\nif err := server.Shutdown(ctx); err != nil {\n    log.Print(err)\n}'],
    'question-332': ['go', 'type User struct { Name string `json:"name"` }\nvar user User\nif err := json.NewDecoder(r.Body).Decode(&user); err != nil {\n    http.Error(w, "invalid JSON", http.StatusBadRequest)\n    return\n}'],
    'question-336': ['go', 'row := db.QueryRowContext(ctx, "SELECT name FROM users WHERE id = $1", id)\nvar name string\nerr := row.Scan(&name) // параметр отделён от SQL-текста'],
    'question-355': ['bash', 'go build -gcflags=-S ./cmd/server\ngo tool objdump -s "main.hot" ./server\nGOSSAFUNC=hot go build ./cmd/server'],
    'question-373': ['sql', 'BEGIN;\nINSERT INTO idempotency_keys (key)\nVALUES ($1) ON CONFLICT (key) DO NOTHING\nRETURNING key;\n-- Только при возвращённом ключе выполнить операцию\n-- и сохранить её ответ в той же транзакции.\nCOMMIT;'],
    'question-389': ['sql', 'CREATE MATERIALIZED VIEW monthly_sales AS\nSELECT date_trunc(\'month\', created_at) AS month, sum(total) AS amount\nFROM orders GROUP BY 1;\n\nREFRESH MATERIALIZED VIEW monthly_sales;'],
    'question-389-followup-1': ['sql', 'CREATE UNIQUE INDEX monthly_sales_month_idx\nON monthly_sales (month);\n\nREFRESH MATERIALIZED VIEW CONCURRENTLY monthly_sales;'],
    'question-390': ['sql', 'CREATE INDEX orders_customer_created_idx\nON orders (customer_id, created_at DESC);\n\nSELECT * FROM orders\nWHERE customer_id = 42\nORDER BY created_at DESC LIMIT 20;'],
    'question-392': ['sql', 'EXPLAIN (ANALYZE, BUFFERS)\nSELECT customer_id, count(*)\nFROM orders\nWHERE created_at >= DATE \'2026-01-01\'\nGROUP BY customer_id;'],
    'question-393': ['javascript', 'db.users.createIndex({ email: 1 }, { unique: true });\ndb.users.updateOne(\n  { email: "user@example.com" },\n  { $setOnInsert: { createdAt: new Date() } },\n  { upsert: true }\n);'],
    'question-393-followup-1': ['javascript', 'db.users.createIndex({ email: 1 }, { unique: true });\n// Уникальный индекс защищает бизнес-ключ и при гонке upsert.'],
    'question-423': ['go', 'ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)\ndefer cancel()\nif err := server.Shutdown(ctx); err != nil {\n    log.Print("shutdown:", err)\n}\n// Подтверждать сообщения брокеру только после успешной обработки.']
  };
  const followupCodeExamples = {
    'question-23-followup-3': ['bash', 'ls -l /proc/1420/fd\nlsof -p 1420'],
    'question-27-followup-3': ['bash', 'lsof -i :8080\nss -ltnp'],
    'question-44-followup-3': ['nginx', 'upstream api {\n    server 10.0.0.1:8080;\n    server 10.0.0.2:8080;\n}\nserver {\n    location / { proxy_pass http://api; }\n}'],
    'question-90-followup-4': ['sql', 'SELECT a.pid, a.query, l.mode, l.granted,\n       pg_blocking_pids(a.pid) AS blockers\nFROM pg_stat_activity AS a\nJOIN pg_locks AS l ON l.pid = a.pid\nWHERE a.datname = current_database();'],
    'question-91-followup-3': ['sql', 'BEGIN;\nINSERT INTO events (message) VALUES (\'kept\');\nSAVEPOINT optional_step;\nINSERT INTO events (message) VALUES (\'discarded\');\nROLLBACK TO SAVEPOINT optional_step;\nCOMMIT; -- сохранится только первая строка'],
    'question-92-followup-1': ['sql', 'SELECT customer_id, COUNT(*) AS orders_count\nFROM orders\nWHERE status = \'paid\' -- строки до группировки\nGROUP BY customer_id\nHAVING COUNT(*) > 5; -- группы после группировки'],
    'question-93-followup-3': ['sql', 'CREATE TABLE child (\n    parent_id bigint REFERENCES parent(id)\n        DEFERRABLE INITIALLY DEFERRED\n);\n-- Проверка ссылки выполняется при COMMIT.'],
    'question-94-followup-1': ['sql', 'SELECT u.id, o.id AS order_id\nFROM users AS u\nLEFT JOIN orders AS o ON o.user_id = u.id;\n-- Пользователь без заказов остаётся в результате с NULL order_id.'],
    'question-97-followup-2': ['sql', 'SELECT id, created_at\nFROM posts\nWHERE (created_at, id) < ($1, $2)\nORDER BY created_at DESC, id DESC\nLIMIT 20;'],
    'question-98-followup-2': ['sql', 'CREATE TABLE loans (\n    book_id bigint REFERENCES books(id),\n    reader_id bigint REFERENCES readers(id),\n    issued_at timestamptz NOT NULL,\n    returned_at timestamptz\n);'],
    'question-107-followup-2': ['sql', 'CREATE INDEX CONCURRENTLY orders_created_idx\nON orders (created_at);\n-- Запускать вне явного блока BEGIN/COMMIT.'],
    'question-112-followup-1': ['sql', 'INSERT INTO users (name)\nVALUES (\'Ada\')\nRETURNING id, name;'],
    'question-115-followup-1': ['sql', 'SELECT pid, now() - query_start AS duration, query\nFROM pg_stat_activity\nWHERE state = \'active\'\nORDER BY duration DESC;'],
    'question-140-followup-3': ['go', 'current := runtime.GOMAXPROCS(0)\nfmt.Println(current) // значение не изменилось'],
    'question-141-followup-2': ['bash', 'go tool pprof "http://127.0.0.1:6060/debug/pprof/profile?seconds=30"\n# Диагностический порт должен быть доступен только уполномоченным.'],
    'question-142-followup-3': ['go', 'var value any = "hello"\nnumber, ok := value.(int)\nfmt.Println(number, ok) // 0 false; без ok была бы panic'],
    'question-142-followup-4': ['go', 'var ptr *int = nil\nvar value any = ptr\nfmt.Println(ptr == nil, value == nil) // true false'],
    'question-146-followup-1': ['go', 'ch := make(chan int, 1)\nch <- 7\nclose(ch)\na, firstOK := <-ch\nb, secondOK := <-ch\nfmt.Println(a, firstOK, b, secondOK) // 7 true 0 false'],
    'question-146-followup-4': ['go', 'select {\ncase ch <- value:\n    // отправка готова\ndefault:\n    // канал сейчас не готов: не блокируемся\n}'],
    'question-147-followup-2': ['go', 'src := []int{1, 2, 3}\ndst := make([]int, len(src))\ncopy(dst, src)\ndst[0] = 9 // src[0] остаётся 1'],
    'question-147-followup-5': ['go', 'original := []int{1, 2, 3}\nview := original[1:3]\nview[0] = 9 // original[1] тоже стал 9'],
    'question-148-followup-1': ['go', 'text := "Ж"\nfmt.Println(len(text))         // 2 байта в UTF-8\nfmt.Println(len([]rune(text))) // 1 руна'],
    'question-151-followup-2': ['go', 'select {\ncase item := <-ch:\n    use(item)\ndefault:\n    // ни одна операция канала не готова\n}'],
    'question-152-followup-1': ['go', 'ctx, cancel := context.WithCancel(parent)\ndefer cancel() // явная отмена\n\ntimed, stop := context.WithTimeout(parent, 2*time.Second)\ndefer stop() // отменится и по таймауту'],
    'question-153-followup-1': ['go', 'defer fmt.Println("first")\ndefer fmt.Println("second")\n// При выходе напечатает: second, затем first'],
    'question-154-followup-4': ['go', 'var stats runtime.MemStats\nruntime.ReadMemStats(&stats)\nfmt.Println(stats.HeapAlloc, stats.NumGC)'],
    'question-157-followup-1': ['go', 'ch := make(chan int)\n<-ch // никто не отправляет: runtime сообщит о deadlock'],
    'question-157-followup-3': ['bash', 'go test -race ./...'],
    'question-169-followup-7': ['bash', 'kubectl logs my-pod -c app\nkubectl logs my-pod -c app --previous'],
    'question-177-followup-1': ['redis', 'SET lock:job unique-token NX PX 10000\n# Освобождая lock, удаляйте ключ только если токен совпадает.'],
    'question-178-followup-2': ['redis', 'MULTI\nINCR counter:a\nINCR counter:b\nEXEC'],
    'question-179-followup-1': ['redis', 'GETEX session:42 EX 3600\n# Чтение и продление TTL выполняются одной командой.'],
    'question-181-followup-2': ['redis', 'SCAN 0 MATCH user:* COUNT 100\n# Повторяйте с возвращённым курсором до курсора 0.'],
    'question-183-followup-2': ['go', 'equal := subtle.ConstantTimeCompare(expected, actual) == 1\n// Для одинаковой длины сравнение не выходит на первом различии.'],
    'question-187-followup-1': ['go', 'var err error\nvalue, err := read() // value новый, err переиспользуется в этой области\n_ = value'],
    'question-188-followup-1': ['go', 'const (\n    first = iota // 0\n    _              // 1 пропущено\n    third          // 2\n)'],
    'question-190-followup-1': ['go', 'func add(items []int) []int {\n    return append(items, 42)\n}\nitems = add(items) // новый заголовок сохранён'],
    'question-193-followup-1': ['go', 'type Original int\nfunc (Original) Name() string { return "original" }\ntype New Original\n// У New нет метода Name: его нужно объявить отдельно.'],
    'question-195-followup-1': ['go', 'type State int\nconst (\n    Ready State = iota\n    Done\n)\nvalue := State(99) // допустимо как значение типа\nvalid := value == Ready || value == Done'],
    'question-197-followup-1': ['go', 'source := []int{1, 2, 3}\na := source[:2]\nb := source[1:]\na[1] = 9\nfmt.Println(b[0]) // 9: общий базовый массив'],
    'question-198-followup-1': ['go', 'limited := data[10:20:20] // cap ограничена, но массив общий\nindependent := append([]byte(nil), data[10:20]...)\n// Только independent не удерживает исходный массив.'],
    'question-200-followup-1': ['go', 'scores := map[string]int{"Ada": 0}\na, foundA := scores["Ada"]\nb, foundB := scores["Bob"]\nfmt.Println(a, foundA, b, foundB) // 0 true 0 false'],
    'question-202-followup-1': ['go', 'var builder strings.Builder\nfor _, part := range parts {\n    builder.WriteString(part)\n}\nresult := builder.String()'],
    'question-384-followup-1': ['sql', 'CREATE UNIQUE INDEX users_email_idx ON users(email);\nINSERT INTO users (email) VALUES ($1)\nON CONFLICT (email) DO NOTHING;'],
    'question-385-followup-1': ['sql', 'BEGIN;\nUPDATE orders SET status = \'paid\' WHERE id = $1;\nINSERT INTO outbox (event_type, payload)\nVALUES (\'OrderPaid\', $2);\nCOMMIT; -- состояние и событие сохраняются вместе'],
    'question-403-followup-1': ['http', 'HTTP/1.1 429 Too Many Requests\nRetry-After: 30'],
    'question-434-followup-1': ['go', 'go func() {\n    defer func() {\n        if value := recover(); value != nil {\n            log.Print("worker panic: ", value)\n        }\n    }()\n    runWorker()\n}()'],
    'question-435-followup-1': ['go', 'var wg sync.WaitGroup\nwg.Add(1) // до запуска горутины\ngo func() {\n    defer wg.Done()\n    runWorker()\n}()\nwg.Wait()']
  };
  const addCodeExamples = () => {
    const answers = [...list.querySelectorAll('.answer-box')];
    const modal = document.createElement('div');
    modal.className = 'answer-code-modal';
    modal.hidden = true;
    modal.innerHTML = '<div class="answer-code-panel" role="dialog" aria-label="Пример кода">' +
      '<div class="answer-code-head"><span class="answer-code-title">Пример кода</span>' +
      '<div class="answer-code-actions"><button type="button" class="answer-code-copy">Скопировать</button>' +
      '<button type="button" class="answer-code-close" aria-label="Закрыть">×</button></div></div>' +
      '<pre><code></code></pre></div>';
    document.body.append(modal);
    const codeNode = modal.querySelector('code');
    const titleNode = modal.querySelector('.answer-code-title');
    const copyButton = modal.querySelector('.answer-code-copy');
    let pinned = false;
    let activeButton = null;
    let codeText = '';
    let restoringFocus = false;
    const close = () => {
      const button = activeButton;
      const wasPinned = pinned;
      modal.hidden = true;
      modal.classList.remove('pinned');
      modal.querySelector('.answer-code-panel').removeAttribute('aria-modal');
      button?.classList.remove('active');
      activeButton = null;
      pinned = false;
      copyButton.textContent = 'Скопировать';
      if (wasPinned && button) {
        restoringFocus = true;
        button.focus({ preventScroll: true });
        restoringFocus = false;
      }
    };
    const show = (button, pin) => {
      if (restoringFocus) return;
      if (pinned && !pin) return;
      activeButton?.classList.remove('active');
      activeButton = button;
      button.classList.add('active');
      codeText = button.codeExample;
      codeNode.textContent = codeText;
      codeNode.className = button.codeLanguage;
      titleNode.textContent = button.codeTitle;
      copyButton.textContent = 'Скопировать';
      pinned = pin;
      modal.hidden = false;
      modal.classList.toggle('pinned', pin);
      if (pin) {
        modal.querySelector('.answer-code-panel').setAttribute('aria-modal', 'true');
        copyButton.focus({ preventScroll: true });
      }
    };
    answers.forEach(answer => {
      const item = answer.closest('.clarification-item, .question-card');
      if (!item) return;
      const blocks = [...answer.querySelectorAll('pre code')];
      const supplied = extraCodeExamples[item.id] || followupCodeExamples[item.id];
      if (!blocks.length && !supplied) return;
      const code = blocks.length
        ? blocks.map(block => block.textContent.trim()).join('\n\n') : supplied[1];
      const language = blocks[0]?.className || 'language-' + supplied[0];
      // Keep the original code as the source, and show it through the dialog.
      blocks.forEach(block => block.closest('pre').classList.add('answer-code-source'));
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'answer-code-trigger';
      button.textContent = '</>';
      button.setAttribute('aria-label', 'Показать пример кода');
      button.setAttribute('aria-haspopup', 'dialog');
      button.codeExample = code;
      button.codeLanguage = language;
      button.codeTitle = item.querySelector(':scope > .answer-details > summary .question-text')?.textContent.trim() ||
        item.querySelector(':scope > .answer-details > summary')?.textContent.trim() || 'Пример кода';
      button.addEventListener('mouseenter', () => show(button, false));
      button.addEventListener('mouseleave', () => { if (!pinned && activeButton === button) close(); });
      button.addEventListener('focus', () => show(button, false));
      button.addEventListener('blur', () => { if (!pinned && activeButton === button) close(); });
      button.addEventListener('click', () => show(button, true));
      answer.querySelector(':scope > .answer-meta').prepend(button);
    });
    modal.querySelector('.answer-code-close').addEventListener('click', close);
    modal.addEventListener('click', event => { if (event.target === modal && pinned) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && !modal.hidden) close(); });
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codeText);
        copyButton.textContent = 'Скопировано';
      } catch (_) {
        const helper = document.createElement('textarea');
        helper.value = codeText;
        document.body.append(helper);
        helper.select();
        copyButton.textContent = document.execCommand('copy') ? 'Скопировано' : 'Не удалось скопировать';
        helper.remove();
      }
    });
  };
  const answerHighlights = {
    "question-399": ["BFS использует очередь","кратчайший путь","DFS использует стек или рекурсию","O(V + E)"],
    "question-399-followup-1": ["фронт ширины","глубину рекурсии или явный стек","O(V)"],
    "question-400": ["неотрицательными весами","вершину с минимальной текущей оценкой","Отрицательное ребро может улучшить уже окончательно выбранную вершину"],
    "question-400-followup-1": ["одинаковой стоимости всех рёбер","произвольные неотрицательные веса"],
    "question-401": ["O(n)","размер очереди","глубина влияет на стек"],
    "question-401-followup-1": ["O(V + E)","отмечать посещённые вершины"],
    "question-81": ["минимальное число голосов","выделенным лидером","фундамент консенсуса"],
    "question-84": ["открытый стандарт плагинов","только к одной ноде кластера","множеству нод"],
    "question-85": ["двух независимых лидеров","неконсистентности и потере данных","строгий кворум","Fencing / STONITH"],
    "question-89": ["не дожидаясь реплики","RPO > 0","ждет записи на реплику","RPO = 0"],
    "question-389": ["выполняет его при обращении","физически хранит результат","требует REFRESH","ценой устаревания данных"],
    "question-389-followup-1": ["доступ к прежней версии во время обновления","уникальный индекс"],
    "question-390": ["реальные WHERE, ORDER BY и частоты запросов","левый префикс","равенства, диапазоны и сортировка","по всей нагрузке"],
    "question-390-followup-1": ["переиспользованием префикса и сортировкой","диапазон часто ограничивает полезность следующих столбцов"],
    "question-391": ["какую долю строк оставляет условие","последовательное чтение может быть дешевле","актуальности статистики"],
    "question-391-followup-1": ["обновляет статистику распределения значений","оценивает число строк и стоимость"],
    "question-392": ["фактическое число строк против оценок","spill на диск","устраняют причину","репрезентативных данных"],
    "question-392-followup-1": ["какая операция создаёт большую часть работы","верны ли оценки планировщика"],
    "question-393": ["фильтром по бизнес-ключу и опцией upsert","Уникальный индекс на ключ","повторить обновление","сохранять инварианты"],
    "question-393-followup-1": ["Два конкурентных запроса могут вставить отдельные документы","не защищён уникальным индексом"],
    "question-436": ["отдельно агрегируют среднюю цену","соединяют только производителей, имеющих обе категории","предотвращают умножение строк"],
    "question-436-followup-1": ["может повториться для каждой строки другой категории","Сначала агрегируют категории отдельно"],
    "question-88": ["команды выполняются последовательно","RDB:","AOF:","минимальную потерю данных"],
    "question-172": ["после извлечения задача может потеряться","хранят неподтверждённые сообщения до XACK","повторная доставка возможна"],
    "question-172-followup-1": ["pending entries","передачу зависшей задачи другому потребителю","идемпотентным"],
    "question-172-followup-2": ["подтверждает её только после успешной обработки","доставку как минимум один раз","идемпотентность результата"],
    "question-172-followup-3": ["consumer groups","подтверждение и восстановление после сбоя","требований к истории"],
    "question-173": ["преимущественно в памяти","кеша, счётчиков, краткоживущих сессий и очередей","RDB или AOF"],
    "question-173-followup-1": ["различные структуры данных","настраиваемую персистентность","распределённом кеше простых значений"],
    "question-173-followup-2": ["отказать в записи","вытеснять ключи","лимит, политику, TTL и мониторинг"],
    "question-173-followup-3": ["снимки RDB","журнал команд AOF","Репликация сама по себе не заменяет сохранение данных"],
    "question-174": ["Измеряют hit ratio, задержку, нагрузку на источник и цену промахов","допустима политика устаревания","может ухудшить систему"],
    "question-174-followup-1": ["допустимую давность данных и TTL","используют версии, порядок записи или события изменения","ценой дополнительных промахов"],
    "question-174-followup-2": ["низкой доле попаданий","перегрузить источник при одновременных промахах","оценивают по задержке и нагрузке"],
    "question-175": ["при промахе загружает данные из БД","после записи в БД обычно инвалидирует ключ","не обеспечивает строгую консистентность"],
    "question-175-followup-1": ["Cache-aside загружает значение при промахе","Write-through синхронно пишет","Write-behind откладывает запись","риск потери ещё не записанных данных"],
    "question-175-followup-2": ["значение, которого нет в источнике истины","сначала добиваются подтверждённой записи в БД","журнал, повторные попытки"],
    "question-176": ["событийную модель","дополнительные потоки или процессы","Долгая команда всё равно задерживает другие команды"],
    "question-176-followup-1": ["последовательно в основном цикле событий","не является буквально однопоточным","может задержать другие запросы"],
    "question-176-followup-2": ["неблокирующий сетевой ввод-вывод и цикл событий","без отдельного рабочего потока","тяжёлые команды блокируют обработку"],
    "question-176-followup-3": ["создаёт дочерний процесс через fork","копируются при записи","повышают расход памяти"],
    "question-177": ["атомарно создаёт ключ","сравнивают token","не удалить чужую блокировку","может быть недостаточно"],
    "question-177-followup-1": ["только первый клиент получит блокировку","сравнить сохранённый токен со своим и удалить ключ атомарно","Сам SETNX без срока"],
    "question-177-followup-2": ["освобождает блокировку, если владелец умер","атомарно вместе с захватом","защита от прежнего владельца"],
    "question-178": ["атомарно прибавляет целое число","не становится атомарной","Переполнение и нечисловое значение"],
    "question-178-followup-1": ["вернёт ошибку и не изменит ключ","INCRBYFLOAT","тип ключа и ожидаемую схему данных"],
    "question-178-followup-2": ["выполнятся последовательно","не даёт автоматического отката","Lua-скрипт или Redis Function","совместимом слоте"],
    "question-179": ["задаёт срок жизни","Повторный EXPIRE обновляет срок","SET с EX или PX"],
    "question-179-followup-1": ["GET не продлевает TTL","одной атомарной операцией","скользящий срок жизни"],
    "question-179-followup-2": ["немедленному удалению ключа","обработать явно"],
    "question-180": ["-1 означает существующий ключ без срока","-2 — отсутствующий ключ","PTTL"],
    "question-180-followup-1": ["-1, если ключ существует","-2, если ключа нет"],
    "question-180-followup-2": ["TTL или PTTL показывает оставшееся время","Фактическое удаление может произойти лениво"],
    "question-181": ["может долго задерживать остальные операции","обходит ключи порциями","не даёт снимка","до возврата курсора 0"],
    "question-181-followup-1": ["одну блокирующую операцию","курсор и небольшие порции ключей","могут повторяться"],
    "question-181-followup-2": ["SCAN с ограниченным COUNT","проходя курсоры до 0","возможные дубликаты"],
    "question-90": ["атомарную единицу","COMMIT фиксирует результат","ROLLBACK отменяет его","PostgreSQL трактует Read Uncommitted как Read Committed","тем вероятнее конфликты"],
    "question-90-followup-1": ["ко всей таблице","к выбранным строкам","не запрещает обычный SELECT благодаря MVCC"],
    "question-90-followup-2": ["несколько читателей","Конкретная совместимость зависит от уровня"],
    "question-90-followup-3": ["цикл ожиданий","отменяет одну транзакцию","единым порядком захвата ресурсов"],
    "question-90-followup-4": ["pg_locks с pg_stat_activity","pg_blocking_pids(pid)","снимок меняется"],
    "question-90-followup-5": ["чтение неподтверждённых данных","повторное чтение той же строки","изменение набора строк","не допускает dirty read"],
    "question-90-followup-6": ["снимок на оператор","REPEATABLE READ — на транзакцию","ошибкой сериализации"],
    "question-90-followup-7": ["READ COMMITTED","каждый оператор видит снимок данных"],
    "question-90-followup-8": ["транзакции короткими","SKIP LOCKED","не убирайте блокировки ценой потери корректности"],
    "question-91": ["Грязное чтение","неповторяемое чтение","фантомное чтение","lost update, write skew","ошибок сериализации"],
    "question-91-followup-1": ["атомарность, согласованность, изоляцию и долговечность","либо весь набор фиксируется, либо откатывается"],
    "question-91-followup-2": ["COMMIT фиксирует изменения","ROLLBACK отменяет изменения","кроме внешних побочных эффектов"],
    "question-91-followup-3": ["точку внутри транзакции","откатывает изменения после неё","оставляя изменения в общей транзакции"],
    "question-91-followup-4": ["помечает её как прерванную","ROLLBACK TO SAVEPOINT"],
    "question-99": ["check_violation","UNKNOWN для NULL не нарушает ограничение","NOT NULL","Отключение триггеров не отключает CHECK"],
    "question-99-followup-1": ["частых или долгих записях","дороже обычного Mutex","проверяйте бенчмарком"],
    "question-99-followup-2": ["шарды с собственными блокировками","Сначала подтвердите проблему профилем"],
    "question-99-followup-3": ["стабильный хеш","свою map и mutex","в согласованном порядке"],
    "question-100": ["значения нескольких столбцов одной строки","не предназначено для проверки других строк","UNKNOWN"],
    "question-100-followup-1": ["отсутствующее или неизвестное значение","IS NULL и IS NOT NULL","результат обычно тоже NULL"],
    "question-100-followup-2": ["b - c вернёт NULL","delta=NULL"],
    "question-101": ["UNKNOWN","IS NULL и IS NOT NULL","COUNT(*) считает строки","COUNT(column) пропускает строки с NULL"],
    "question-101-followup-1": ["COALESCE(c, 0)","c IS NULL"],
    "question-101-followup-2": ["завершиться ошибкой","временные файлы","OOM Killer"],
    "question-102": ["слева направо","ASC или DESC и порядок NULL","стабильный порядок"],
    "question-103": ["найти и пропустить предшествующие строки","keyset pagination","Без ORDER BY страницы не имеют гарантированного порядка"],
    "question-103-followup-1": ["пройти и отбросить предыдущие строки","повторы и пропуски"],
    "question-103-followup-2": ["полный порядок по индексируемым столбцам","последний ключ предыдущей страницы","условием по этому ключу"],
    "question-110": ["быстро очищает таблицу целиком","может выбирать строки через WHERE","ROLLBACK возвращает данные","сильную блокировку"],
    "question-110-followup-1": ["Предпосылка неверна","можно откатить через ROLLBACK","не является MVCC-безопасным"],
    "question-110-followup-2": ["точный набор таблиц","в транзакции","CASCADE используйте только после просмотра зависимостей"],
    "question-111": ["WHERE и RETURNING","нагрузку на WAL","пакетное удаление","Не следует автоматически запускать ручной VACUUM"],
    "question-111-followup-1": ["DELETE-триггеры","мёртвые версии до VACUUM","не запускает DELETE-триггеры","может быть откатан"],
    "question-111-followup-2": ["autovacuum сам очищает мёртвые версии","VACUUM FULL — тяжёлая перепись"],
    "question-112": ["фактически изменённых","без второго SELECT","результат пуст"],
    "question-112-followup-1": ["созданные ID, вычисленные значения","список реально изменённых строк","заменяет отдельный SELECT"],
    "question-112-followup-2": ["нет собственного JOIN","UPDATE ... FROM","DELETE ... USING"],
    "question-394": ["связей, сложных запросов, ограничений и транзакций","разные модели","инвариантам, профилю нагрузки, схеме доступа"],
    "question-394-followup-1": ["транзакции в некоторой области","границы атомарности и изоляции"],
    "question-395": ["свойства транзакций","доступностью и мягким состоянием","при отсутствии новых записей реплики в итоге согласуются","не отменяет требований к важным инвариантам"],
    "question-395-followup-1": ["для конкретной операции и границы транзакции"],
    "question-396": ["внутри одной логической БД","между независимыми узлами","маршрутизацию, ребалансировку, межшардовые запросы"],
    "question-396-followup-1": ["не позволяет отсечь партиции","дополнительные накладные расходы"],
    "question-397": ["распределять записи и запросы достаточно равномерно","кардинальность, перекос, рост","Горячий шард разгружают","контроля консистентности"],
    "question-397-followup-1": ["концентрируются на одной активной партиции или шарде"],
    "question-398": ["ресурсы одному узлу","добавляет экземпляры","по конкретному узкому месту"],
    "question-398-followup-1": ["предел уже находится в БД","увеличат давление на узкое место"],
    "question-432": ["таблица user_chats","NOT NULL и FOREIGN KEY","автор состоит в чате","(chat_id, created_at, id)"],
    "question-432-followup-1": ["многих чатах","многих пользователей","Отдельная таблица связи"],
    "question-82": ["распределенный замок","WAL-поток","промоут (Failover)","PgBouncer"],
    "question-83": ["перед записью данных на диск","сначала последовательно пишется в журнал WAL","сброс грязных страниц","ускоряет восстановление"],
    "question-86": ["кончилось место в pg_wal","XID Wraparound","Потеря кворума Patroni/etcd"],
    "question-87": ["autovacuum freeze","замораживать старые кортежи","остановит запись"],
    "question-92": ["AccessShareLock","RowExclusiveLock","AccessExclusiveLock","MVCC позволяет читателям не блокировать обычные записи","pg_stat_activity и pg_locks"],
    "question-92-followup-1": ["WHERE фильтрует строки до группировки","HAVING фильтрует уже сформированные группы"],
    "question-92-followup-2": ["иначе PostgreSQL выдаст ошибку","весь набор строк считается одной группой"],
    "question-92-followup-3": ["в SELECT и ORDER BY без HAVING","для фильтрации групп"],
    "question-92-followup-4": ["сначала отбирает строки и соединяет таблицы","EXPLAIN (ANALYZE, BUFFERS)","не обязан быть выгоден"],
    "question-93": ["хранит версии строк","зависит от снимка транзакции","очищает VACUUM"],
    "question-93-followup-1": ["запрещает дубли","логическое условие строки","существования связанной записи"],
    "question-93-followup-2": ["автоматически удаляет дочерние строки","нужно хранить отдельно или аудитировать"],
    "question-93-followup-3": ["до конца транзакции","к COMMIT данные снова корректны"],
    "question-93-followup-4": ["SQLSTATE и именем ограничения","ошибка может появиться на COMMIT","не пробуйте опасную запись на проде"],
    "question-94": ["для повторного использования","предотвращать переполнение счётчиков транзакций","переписывает таблицу","сильной блокировки"],
    "question-94-followup-1": ["только совпавшие пары строк","сохраняет каждую строку левой таблицы","NULL"],
    "question-94-followup-2": ["в ON","в WHERE","может убрать NULL-расширенные строки"],
    "question-94-followup-3": ["NULL = NULL даёт UNKNOWN","IS NOT DISTINCT FROM"],
    "question-94-followup-4": ["типы и кардинальность ключей","EXPLAIN (ANALYZE, BUFFERS)","размножение строк"],
    "question-98": ["повторно использует соединения","ограничивает их число","Слишком большой пул увеличивает конкуренцию","pgxpool или database/sql"],
    "question-98-followup-1": ["author_id как FK в books","book_authors(book_id, author_id)"],
    "question-98-followup-2": ["loans(book_id, reader_id, issued_at, returned_at)","ограничьте число активных выдач"],
    "question-98-followup-3": ["PRIMARY KEY","FOREIGN KEY","UNIQUE","составной ключ из двух FK"],
    "question-98-followup-4": ["не имеет смысла без родителя","каскад может уничтожить нужный аудит","RESTRICT"],
    "question-104": ["обновляет статистику распределения значений","выбирает план запросов","после большого импорта","оценочные и фактические строки"],
    "question-104-followup-1": ["после массовой загрузки","autovacuum ещё не обновил статистику","сначала измерьте состояние"],
    "question-104-followup-2": ["неверно оценивает число строк и селективность","estimated и actual rows"],
    "question-113": ["VACUUM и ANALYZE","удаляет невидимые версии строк","предотвращает опасное старение идентификаторов","не отключают механизм"],
    "question-113-followup-1": ["конкурировать за I/O","Полное отключение обычно хуже"],
    "question-113-followup-2": ["dead tuples и задержку autovacuum","scale_factor, threshold и cost-параметры","не отключайте защиту от wraparound"],
    "question-114": ["текущие значения параметров конфигурации","SHOW work_mem","pg_settings","не изменение конфигурации"],
    "question-114-followup-1": ["Фильтруйте pg_settings","не поддерживает WHERE"],
    "question-114-followup-2": ["значение параметра текущей сессии","имя, значение, единицы, источник и контекст"],
    "question-115": ["состояние, время начала транзакции и текущий запрос","idle in transaction","не доказывает, что процесс безопасно завершать"],
    "question-115-followup-1": ["now() - query_start","pg_stat_statements"],
    "question-115-followup-2": ["открыла транзакцию и ждёт команд клиента","удерживать блокировки и старый снимок","мешать VACUUM"],
    "question-116": ["удерживаемые и ожидаемые блокировки","pg_blocking_pids(pid)","лишь ждёт блокировку"],
    "question-116-followup-1": ["табличные режимы","блокировки строк, страниц, транзакций и advisory locks"],
    "question-116-followup-2": ["отменяет одну транзакцию","PID, SQL и блокирующие связи","порядок захвата ресурсов"],
    "question-117": ["отменить текущий запрос, сохранив соединение","завершает всю сессию","последствия для приложения"],
    "question-117-followup-1": ["отменяет текущий запрос и сохраняет соединение","завершает сессию","откатывается"],
    "question-117-followup-2": ["откатывает незавершённую транзакцию","внешнюю несогласованность","выясните роль сессии"],
    "question-117-followup-3": ["pg_cancel_backend для зависшего запроса","pg_terminate_backend применяйте","последствия для открытой транзакции"],
    "question-117-followup-4": ["увеличивает bloat","опасный wraparound","настройте очистку"],
    "question-95": ["без полного чтения таблицы","когда планировщик считает это выгодным","занимает место","не гарантирует ускорение любого запроса"],
    "question-95-followup-1": ["разбивает входные строки на группы одинаковых ключей","отдельно для каждой группы","NULL в ключе группировки образует одну группу"],
    "question-95-followup-2": ["всей комбинацией полей","Число групп может вырасти","несгруппированные столбцы"],
    "question-95-followup-3": ["до вычисления групп","используйте HAVING","подзапрос"],
    "question-95-followup-4": ["GROUP BY в CTE/подзапрос","во внешний WHERE","HAVING обычно яснее"],
    "question-96": ["физически переписывает таблицу","не поддерживают этот порядок автоматически","не является постоянно кластерным индексом"],
    "question-96-followup-1": ["в нужном порядке","явную сортировку","дешевле индексного обхода"],
    "question-96-followup-2": ["ORDER BY принимает выражение","индекс по выражению","планировщик считает его выгодным"],
    "question-96-followup-3": ["Сортировка в БД часто лучше с LIMIT и индексом","уже загруженного небольшого набора","полный путь по времени и памяти"],
    "question-96-followup-4": ["правила сравнения строк","изменить результат","несовместимым collation"],
    "question-97": ["оценочный план без выполнения","действительно выполняет его","реальные изменения","устаревшую статистику"],
    "question-97-followup-1": ["найти и пропустить предыдущие строки","пропускам и повторам"],
    "question-97-followup-2": ["ключ последней показанной строки","глубина страницы почти не влияет на цену","стабильный уникальный порядок"],
    "question-97-followup-3": ["устойчивой паре","последнее значение","индекс в том же порядке"],
    "question-97-followup-4": ["не гарантирует порядок строк","полный порядок с уникальным завершающим ключом"],
    "question-97-followup-5": ["относительная оценка планировщика","не миллисекунды","EXPLAIN ANALYZE и BUFFERS"],
    "question-97-followup-6": ["статистике и модели стоимости","кеша, диска, конкуренции","estimated rows и actual rows"],
    "question-105": ["перестраивает индекс","подтверждённом раздутии","блокировок и дополнительного места","Сначала проверяют диагноз"],
    "question-105-followup-1": ["размер индекса с числом живых строк","pgstattuple","сам по себе не доказывает bloat"],
    "question-105-followup-2": ["по тому же определению","период без нужного индекса или ограничения"],
    "question-106": ["переписывает таблицу в порядке индекса","блокировки и места","постепенно нарушают физический порядок","автоматической перекластеризации нет"],
    "question-106-followup-1": ["переупорядочивает таблицу по индексу","для возврата места ОС","серьёзной блокировки"],
    "question-106-followup-2": ["диапазонные чтения выигрывают","запланировать блокировку, место и перепись","сначала измеряют пользу"],
    "question-107": ["разные блокировки","полное переписывание таблицы","поэтапную миграцию","ограничение времени ожидания блокировки"],
    "question-107-followup-1": ["ACCESS EXCLUSIVE","блокируют чтение и запись","lock_timeout"],
    "question-107-followup-2": ["без длительной блокировки обычных INSERT, UPDATE и DELETE","больше проходов и ожиданий","не запускается внутри обычного блока транзакции"],
    "question-108": ["позволяет вставкам, обновлениям и удалениям идти во время построения индекса","ждать долгие транзакции","нельзя запускать внутри обычного блока транзакции","недействительный индекс"],
    "question-108-followup-1": ["несколько проходов по таблице","ждёт завершения","допускает запись"],
    "question-108-followup-2": ["INVALID-индекс","pg_index.indisvalid","причину сбоя"],
    "question-109": ["без длительного блокирования записей","не работает внутри блока транзакции","нужное ограничение","реальной нагрузке"],
    "question-109-followup-1": ["без длительной блокировки обычной работы","не выполняется внутри стандартного блока транзакции"],
    "question-109-followup-2": ["новые запросы могут стать медленнее","блокировки и ожидание","критичные планы"],
    "question-134": ["Informer, Lister, DynamicClient, Clientset","скрывающий рутину очередей и кэшей","сравнивает со спекой и приводит реальность к желаемому"],
    "question-138": ["Принцип инверсии зависимостей","узкого интерфейса"],
    "question-243": ["сохранении порядка удаление сдвигает элементы","заменить последним"],
    "question-244": ["SortFunc","BinarySearch","Clone","Chunk","Collect"],
    "question-245": ["comparable","Нельзя: слайсы, map, функции","упадёт в рантайме"],
    "question-246": ["v, ok := m[k]","map[T]struct{}"],
    "question-247": ["ключ записывается один раз, а читается много","непересекающимися наборами ключей","map + RWMutex проще"],
    "question-248": ["CutPrefix","FieldsSeq","CutLast"],
    "question-272": ["структура","одновременное выполнение","зависит от GOMAXPROCS"],
    "question-273": ["Отправитель","больше никто не будет писать","не обязательно","сообщить получателям"],
    "question-274": ["Семафор на канале","worker pool","errgroup.SetLimit"],
    "question-275": ["sync.WaitGroup","wg.Go","errgroup.Group"],
    "question-276": ["все горутины заблокированы","частичный дедлок рантайм не заметит"],
    "question-277": ["решениями и тестами"],
    "question-278": ["Никак принудительно","горутина сама проверяет"],
    "question-279": ["уступить процессор","завершить текущую горутину","привязать горутину к потоку"],
    "question-280": ["передачи владения","защиты состояния","Каналы медленнее мьютекса"],
    "question-434": ["в той же горутине","вокруг обработки конкретного задания","отметить его ошибкой","не следует считать обычной восстанавливаемой ошибкой"],
    "question-434-followup-1": ["той же горутины"],
    "question-435": ["ограничение числа воркеров и размера очереди","WaitGroup.Add до запуска горутин","отмену через context","гонки, отмену во время работы"],
    "question-435-followup-1": ["увидеть нулевой счётчик до Add","завершиться раньше воркера"],
    "question-367": ["максимальная из минимально требуемых","не «самая свежая»","другой путь модуля","только в главном модуле","GOPRIVATE"],
    "question-368": ["-trimpath","-s -w","-X","debug.ReadBuildInfo()","CA-сертификаты и tzdata"],
    "question-369": ["crypto/rand","subtle.ConstantTimeCompare","плейсхолдеры","html/template","os.Root","таймаутов","govulncheck"],
    "question-370": ["GOTRACEBACK=all","kill -QUIT","/debug/pprof/goroutine?debug=2","fatal error","GODEBUG=gctrace"],
    "question-431": ["источники скачивания модулей","исключает их из публичного proxy","аутентификации","не включают в go.mod"],
    "question-431-followup-1": ["публичная база контрольных сумм обычно отключена","каноническому репозиторию","контроль цепочки поставки"],
    "question-123": ["strconv"],
    "question-124": ["errors.As()","errors.Is()"],
    "question-127": ["одиночном Type Assertion","интерфейс хранит другой тип"],
    "question-128": ["HashDoS","случайный криптографический hash seed","непредсказуемым"],
    "question-132": ["24 байта на x64","до 256 элементов емкость удваивается","рост замедляется"],
    "question-142": ["задаёт набор методов","удовлетворяет интерфейсу неявно","динамический тип и данные","типизированный nil внутри интерфейса не равен nil"],
    "question-142-followup-1": ["не требует методов","значение любого типа","проверка или приведение типа"],
    "question-142-followup-2": ["динамическом типе","динамическое значение","деталь реализации"],
    "question-142-followup-3": ["вызывает panic","ok=false без паники"],
    "question-142-followup-4": ["нет ни динамического типа, ни значения","динамический тип сохранится"],
    "question-142-followup-5": ["не описывает методы","Любой объект удовлетворяет"],
    "question-142-followup-6": ["работать с любым типом данных","fmt.Print"],
    "question-142-followup-7": ["указывается для класса явно","имплементация неявная"],
    "question-144": ["использует переменные из окружающей области видимости","хранить локальное состояние","может разместить их в куче","нужно синхронизировать"],
    "question-147": ["указатель на базовый массив, длина и ёмкость","разделять один массив","выделяет новый массив и копирует элементы","полученный слайс нужно сохранить"],
    "question-147-followup-1": ["влияет на производительность вставки","частому выделению памяти","близкой к плановому количеству элементов"],
    "question-147-followup-2": ["копирует элементы в другой заранее выделенный слайс","копирует только заголовок","общий базовый массив"],
    "question-147-followup-3": ["массив будет скопирован в новый","внутренней логике"],
    "question-147-followup-4": ["ни одного слайса, который ссылается"],
    "question-147-followup-5": ["не производит копирование данных","указывающее на исходный массив"],
    "question-147-followup-6": ["инициализированы значениями по умолчанию","участвовать в итерировании"],
    "question-148": ["неизменяемая последовательность байтов","UTF-8, но это не гарантируется","len считает байты","range декодирует руны"],
    "question-148-followup-1": ["int32","представления Unicode"],
    "question-150": ["неупорядоченной итерацией","одновременная запись без синхронизации недопустима","Swiss Tables","не является гарантией языка"],
    "question-150-followup-1": ["сравнивает хеши и затем ключи-кандидаты","не закреплено спецификацией языка"],
    "question-150-followup-2": ["прежней реализации map Go","пробирование групп"],
    "question-150-followup-3": ["перераспределяют записи","зависит от версии Go"],
    "question-150-followup-4": ["создаёт гонку","Защитите map мьютексом","передавайте владение одной горутине"],
    "question-153": ["в момент выполнения defer","при выходе из окружающей функции","в обратном порядке","изменить его перед возвратом"],
    "question-153-followup-1": ["в обратном порядке","при выполнении оператора defer"],
    "question-153-followup-2": ["накладные расходы","измеряйте их профилем","закрывать ресурсы на всех путях выхода"],
    "question-153-followup-3": ["в обратном порядке","перехватить panic","os.Exit не запускает defer"],
    "question-153-followup-4": ["только при выходе из окружающей функции","в отдельную функцию"],
    "question-163": ["не определяет порядок обхода map","сортируют его","отсортированным ключам"],
    "question-165": ["единица хранения данных","кодовой точки Unicode","байт","несколько рун"],
    "question-289": ["глобальную очередь","украсть половину"],
    "question-290": ["P отцепляется","другому M","netpoller","M свободен"],
    "question-291": ["Кооперативное","Асинхронное","безопасной точке"],
    "question-292": ["число CPU хоста","троттлинг CFS","учитывает cgroup CPU limit"],
    "question-293": ["Стартовый размер ~2 КБ","выделяется стек ×2","копируется целиком","нельзя отдавать в C"],
    "question-294": ["размерные классы","mcache","mcentral","mheap","tiny allocator"],
    "question-295": ["целые страницы (spans)","лучше локальность памяти и кэшей","меньше промахов"],
    "question-296": ["GOGC=100","реже GC, больше памяти","мягкий лимит памяти рантайма","риск death spiral"],
    "question-297": ["Меньше аллокаций","предвыделение","структуры без указателей","pprof -alloc_space"],
    "question-298": ["ненадёжен","не воскрешает","работает с циклами","слабые указатели"],
    "question-326": ["горутина на каждое соединение","Handler.ServeHTTP(w, r)","http.ServeMux"],
    "question-327": ["Методы и wildcard-параметры","PathValue"],
    "question-328": ["Порядок: recover → request ID → логирование → метрики → auth → rate limit → handler"],
    "question-329": ["ReadHeaderTimeout","http.DefaultClient","без таймаута","defer resp.Body.Close()","не вернётся в пул keep-alive"],
    "question-330": ["gracefulshutdown"],
    "question-331": ["структурированный логгер","стандартной библиотеке"],
    "question-332": ["через рефлексию","omitzero","строже","поддерживает стриминг"],
    "question-333": ["HTTP/2, мультиплексирование","Protobuf","SSE/WebSocket отдельно",".proto + кодогенерация"],
    "question-334": ["Interceptors","Дедлайны передаются","одно долгое соединение","нельзя менять номера полей"],
    "question-335": ["Не закрыли rows","defer rows.Close()","rows.Err()","закрывается сам после Scan"],
    "question-336": ["запрос в цикле","только плейсхолдеры","никакого fmt.Sprintf"],
    "question-337": ["расширяем → деплоим код → сужаем","CREATE INDEX CONCURRENTLY"],
    "question-338": ["упорядоченность только внутри партиции","одна партиция — один консьюмер группы","после обработки","идемпотентные обработчики"],
    "question-339": ["в той же транзакции","отдельный процесс читает и публикует"],
    "question-281": ["низкоуровневый конфликт доступа к памяти","логическая ошибка из-за порядка событий","возможна и без data race"],
    "question-282": ["sync.OnceValue","считается выполненным"],
    "question-283": ["broadcast-пробуждения","Wait всегда в цикле"],
    "question-284": ["atomic.Int64","CompareAndSwap","не делают атомарной группу операций"],
    "question-285": ["happens-before","гарантированно видна чтению","отправка в канал","Unlock","переупорядочивать операции"],
    "question-286": ["одной кэш-линии","между ядрами","паддингом"],
    "question-287": ["Стандартный Mutex — нет","семафор на канале"],
    "question-288": ["фейковым временем","проходит мгновенно","ждёт, пока все горутины пузыря заблокируются"],
    "question-129": ["зависла навечно","Мусорщик (GC) не может удалить горутину","context.Context с таймаутами"],
    "question-130": ["сигналы отмены, дедлайны и метаданные","вдоль дерева вызовов"],
    "question-131": ["синхронный рандеву","пока в буфере есть место","Вечная блокировка","Zero value, ok=false","ПАНИКА"],
    "question-133": ["эксклюзивная блокировка","множество читателей","копируется внутреннее состояние блокировки","go vet"],
    "question-135": ["Фиксированное число воркеров","общую очередь задач","ограничено числом воркеров"],
    "question-143": ["задача, планируемая рантаймом Go","небольшим растущим стеком","меньшем числе потоков","Поток планирует ОС"],
    "question-143-followup-1": ["нескольких килобайт","растёт по мере необходимости","зависит от версии"],
    "question-143-followup-2": ["множество горутин на потоках ОС","рантайм запускает другую","без отдельного потока на каждую"],
    "question-143-followup-3": ["может быть прерван планировщиком","всё равно загрузит одно ядро","завершать по условию или контексту"],
    "question-143-followup-4": ["единица работы планировщика Go","поток ОС создаёт ядро","меньшем числе потоков ОС"],
    "question-143-followup-5": ["небольшой растущий стек","отдельный стек, которым управляет ОС"],
    "question-143-followup-6": ["на сколько хватит памяти"],
    "question-143-followup-7": ["количество потоков ОС используемых для исполнения горутин"],
    "question-145": ["ровно одному исполнителю","предотвращает гонку","нельзя копировать после первого использования","не всегда быстрее"],
    "question-145-followup-1": ["читать может много потоков одновременно"],
    "question-146": ["типизированная очередь","отправка и получение встречаются","до заполнения ёмкости","ok=false","panic","nil-каналом блокируются навсегда"],
    "question-146-followup-1": ["оставшиеся буферизованные значения","ok=false","вызывает panic"],
    "question-146-followup-2": ["ждёт, пока получатель освободит место","select с готовой альтернативой или default"],
    "question-146-followup-3": ["места в буфере или получателя","значения или закрытия канала","nil-канал блокирует обе операции"],
    "question-146-followup-4": ["select с веткой default","неблокирующей","busy loop"],
    "question-146-followup-5": ["отправка ждёт получателя","пока есть место в буфере","закрытие канала задаёт завершение"],
    "question-146-followup-6": ["оставшиеся элементы буфера","ok=false","вызывает panic"],
    "question-146-followup-7": ["блокировке навсегда","Закрытие такого канала приводит к panic"],
    "question-146-followup-8": ["select { }"],
    "question-146-followup-9": ["готовности одной из операций","выбирается одна из них","default выполняется сразу","context.Done()"],
    "question-146-followup-10": ["Mutex и RWMutex","WaitGroup","Once","Cond","атомарные операции"],
    "question-146-followup-11": ["размер буффера","закрыт/открыт","мьютекс"],
    "question-146-followup-12": ["pipeline","fan-out","fan-in","worker pool","владельца закрытия канала"],
    "question-151": ["вычисляются один раз","один псевдослучайно","default","канал nil никогда не готов"],
    "question-151-followup-1": ["одну готовую ветку псевдослучайно","Не рассчитывайте на приоритет"],
    "question-151-followup-2": ["ни одна коммуникация select не готова","не блокируется","загрузить CPU"],
    "question-151-followup-3": ["for для обработки канала и сигнала завершения","выход по закрытию канала или context.Done()","крутиться без полезной работы"],
    "question-151-followup-4": ["не задаёт порядок выполнения","псевдослучайно","отдельный протокол или синхронизация"],
    "question-152": ["сигнал отмены, deadline и данные","первым аргументом","вызывают cancel","Большие объекты и обязательные параметры","не передают"],
    "question-152-followup-1": ["явным вызовом cancel","автоматически отменяется после срока","всё равно следует вызвать"],
    "question-152-followup-2": ["удерживать таймер и ссылки","освобождает ресурсы","сообщает ожидающим операциям"],
    "question-152-followup-3": ["собственным типом ключа","проверяет тип","обычными аргументами"],
    "question-152-followup-4": ["хранит ссылки на значения","увеличивают удерживаемую память","небольшие данные"],
    "question-155": ["ровно один раз","дождутся её завершения","могут исчезнуть при сборке мусора","нельзя использовать как надёжное хранилище"],
    "question-155-followup-1": ["только один раз","ждут завершения первого","без повторного запуска"],
    "question-155-followup-2": ["сборщик мусора может очистить его содержимое","создавая новый объект"],
    "question-155-followup-3": ["временных объектов","Выгоду проверяют профилем","не подходит"],
    "question-155-followup-4": ["могут быть удалены из Pool","Get вернёт nil","Нельзя рассчитывать, что Put гарантирует последующий Get"],
    "question-156": ["исключительный доступ","нескольким читателям","писатель ждёт","проверяют профилированием"],
    "question-156-followup-1": ["частых записях","коротких критических секциях","проверяют бенчмарком"],
    "question-156-followup-2": ["не отслеживает рекурсивного владельца","может привести к deadlock"],
    "question-156-followup-3": ["фатальную ошибку рантайма","успешным Lock"],
    "question-156-followup-4": ["отдельное состояние блокировки","ломает синхронизацию","не копируйте её"],
    "question-157": ["не упорядочены синхронизацией","навсегда ждут друг друга","логической ошибкой конкурентности"],
    "question-157-followup-1": ["никто не отправит","в противоположном порядке","может не дать рантайму объявить общий deadlock"],
    "question-157-followup-2": ["все горутины заблокированы","не доказывает отсутствие частичных"],
    "question-157-followup-3": ["mutex, атомарными операциями или передачей владения через канал","согласованы одним протоколом","не заменяет проектирование синхронизации"],
    "question-157-followup-4": ["активно реагируют друг на друга, но не продвигаются","не получает ресурс"],
    "question-158": ["гонках, проявившихся в выполненных тестах","не доказывает отсутствие гонок","не выявляет все логические ошибки"],
    "question-158-followup-1": ["инструментирует обращения к памяти","без достаточного отношения happens-before"],
    "question-158-followup-2": ["затрат CPU и памяти","проверочные стенды"],
    "question-158-followup-3": ["лишь выполненные пути","не находит логические ошибки конкурентности"],
    "question-158-followup-4": ["две конфликтующие операции","общий объект","какая синхронизация должна их упорядочить"],
    "question-160": ["очередь данных","очереди ожидающих отправителей и получателей","горутина паркуется","семантику канала"],
    "question-161": ["ok=false","нулевому значению типа","ok=true","закрытия и опустошения буфера"],
    "question-164": ["блокируются навсегда","close(nil) вызывает panic","в select такой case не готов"],
    "question-340": ["точка входа, сборка зависимостей","направление зависимостей внутрь","интерфейсы на стороне потребителя"],
    "question-341": ["маленькие пакеты","интерфейсы и композицию","маленькие интерфейсы","в пакете сервиса"],
    "question-342": ["ручная сборка в main","кодогенерация","рантайм"],
    "question-343": ["sync.OnceValue","func(http.Handler) http.Handler","экспоненциальная задержка + случайность"],
    "question-344": ["Идемпотентность","Таймауты и дедлайны","Saga","Outbox","liveness vs readiness"],
    "question-345": ["Counter","Gauge","Histogram","Summary","взрыв кардинальности"],
    "question-351": ["открывает escape analysis","-gcflags='-m=2'","//go:noinline"],
    "question-352": ["убирает проверки, если может доказать безопасность","подсказка заранее","ssa/check_bce"],
    "question-353": ["CPU-профиль из прода","инлайнит","девиртуализирует","проверяют бенчмарком"],
    "question-354": ["условия сборки","встроить файлы в бинарник","не запускается при go build","запретить инлайнинг"],
    "question-355": ["ассемблер Go","дизассемблирование бинарника","всеми проходами SSA","через регистры"],
    "question-356": ["только для печати/сравнения","в одном выражении","для GC это просто число","unsafe.Add(p, off)","checkptr"],
    "question-357": ["нельзя менять b","нельзя изменять вообще","сам не копирует"],
    "question-358": ["адресуемый Value","кэшировать разбор типа","дженерики, кодогенерация","стоимость проверяют профилем"],
    "question-359": ["батчуйте","тысячи потоков","Правила указателей","runtime.Pinner","CGO_ENABLED=0"],
    "question-360": ["Горутины","Подслайс/подстрока","Map не сжимается","Кэши без лимита и TTL","Память C","pprof -inuse_space"],
    "question-361": ["Предвыделять","strconv.AppendInt","Не упаковывать в интерфейс","Переиспользовать буферы","Проверять"],
    "question-362": ["stop-the-world","без STW","задержку планировщика"],
    "question-363": ["on-CPU","off-CPU","block и mutex","go tool trace","Flight Recorder","mark assist"],
    "question-364": ["интернирование","не держит объект живым","кэши"],
    "question-365": ["CAS-цикл","ABA-проблема","A→B→A","нужно доказывать отдельно","почти всегда"],
    "question-366": ["один атомарный load","копия","никто не меняет"],
    "question-184": ["самостоятельный бинарный файл","Горутины позволяют обслуживать много независимых операций","задержки сборщика мусора, размер бинарника"],
    "question-184-followup-1": ["множество горутин на меньшем числе потоков ОС","не делает вычисления автоматически параллельными"],
    "question-185": ["zero value","нулевые значения рекурсивно","Mutex и bytes.Buffer пригодны к использованию сразу","запись в неё вызывает panic"],
    "question-185-followup-1": ["выделит базовый массив","Результат нужно присвоить"],
    "question-186": ["только внутри функции","указатель на значение T","инициализирует внутреннюю структуру","решает escape analysis"],
    "question-186-followup-1": ["Указатель на nil-map","make(map[string]int)"],
    "question-187": ["новую переменную с тем же именем","возвращается внешняя err со значением nil","присваивание ="],
    "question-187-followup-1": ["хотя бы одна новая переменная","Во вложенном блоке одноимённая переменная уже новая"],
    "question-188": ["начинает отсчёт с нуля","увеличивается на каждой строке","нельзя бездумно переставлять"],
    "question-188-followup-1": ["пустой идентификатор _"],
    "question-189": ["сохраняет точное значение до контекста использования","уже имеет конкретный тип","вычисляются компилятором"],
    "question-189-followup-1": ["представимо в float64","тип выводится из места использования"],
    "question-190": ["Все аргументы передаются по значению","на тот же базовый массив","не меняет переменную вызывающего"],
    "question-190-followup-1": ["копию заголовка слайса","нужно вернуть вызывающему"],
    "question-191": ["с заглавной буквы экспортируется","со строчной виден только внутри пакета","Каталог internal ограничивает импорт"],
    "question-191-followup-1": ["игнорирует неэкспортируемые поля структуры"],
    "question-192": ["импортированные пакеты","пакетные переменные","функции init","после них main","Побочные эффекты init усложняют тестирование"],
    "question-192-followup-1": ["вызывается рантаймом"],
    "question-193": ["новый определённый тип","один и тот же тип","собственным набором методов"],
    "question-193-followup-1": ["не становятся методами нового типа A"],
    "question-194": ["без явного break","без проверки её условия","цепочка условий","выйти из внешнего цикла"],
    "question-194-followup-1": ["завершает только select","используют метку"],
    "question-195": ["именованный тип и набор констант","проверку допустимости","Пустой идентификатор _","проверить соответствие интерфейсу"],
    "question-195-followup-1": ["допускает значения вне объявленных констант","явная валидация"],
    "question-196": ["модуль, версию языка и требования к зависимостям","контрольные суммы","объединяет несколько локальных модулей"],
    "question-196-followup-1": ["требованиями графа модулей","контрольные суммы модулей"],
    "question-197": ["Размер массива входит в его тип","присваивание копирует все элементы","копии заголовка могут делить базовый массив","слайс можно сравнивать только с nil"],
    "question-197-followup-1": ["один базовый массив","Изменение элемента через один слайс видно через другой"],
    "question-198": ["может удерживать его целиком в памяти","создают копию","ограничивает cap","сама по себе массив не освобождает"],
    "question-198-followup-1": ["будущий append выделить новый массив","продолжит удерживать исходный массив"],
    "question-199": ["nil-слайс равен nil","JSON кодирует nil как null, а пустой как []","контракту API"],
    "question-199-followup-1": ["обе функции вернут 0"],
    "question-200": ["адрес элемента не является стабильным","значение считывают, меняют и записывают обратно","немедленного уменьшения внутренней памяти карты не гарантирует"],
    "question-200-followup-1": ["нулевое значение типа элемента","отличает отсутствие от сохранённого нуля"],
    "question-201": ["неизменяемая последовательность байтов","len считает байты","range декодирует руны","байт, а не символ"],
    "question-201-followup-1": ["нескольких Unicode-кодовых точек"],
    "question-202": ["уменьшают число промежуточных строк","сохранение неизменяемости строки","нельзя строить контракт","строгие правила времени жизни"],
    "question-202-followup-1": ["нового выделения и копирования"],
    "question-308": ["дедлайн","сигнал и результат отмены","значения, связанные с операцией"],
    "question-309": ["ручная отмена","по времени","отмена с причиной","значения сохраняются, отмена — нет"],
    "question-310": ["дочерний контекст (и его таймер) живёт","defer cancel()"],
    "question-311": ["Первый параметр функции","Не хранить в структурах","свой неэкспортируемый тип","только request-scoped данные"],
    "question-312": ["новый узел связного списка","от листа к корню","O(глубина)"],
    "question-313": ["принимают ctx и прерывают операцию","r.Context() отменяется"],
    "question-315": ["Периодически проверять ошибку контекста","допустимой задержке остановки"],
    "question-125": ["Work-stealing M:N scheduler","G-M-P","ворует половину горутин"],
    "question-126": ["Ровно одна горутина","на одном P"],
    "question-136": ["инструментацию на каждое чтение и запись","happens-before","без синхронизации"],
    "question-137": ["трехцветный Mark-Sweep","Write Barrier","Белые:","Серые:","Черные:","GOGC=100"],
    "question-139": ["Стек:","Куча:","Escape Analysis:"],
    "question-140": ["максимальное число потоков, одновременно исполняющих Go-код","не ограничение числа горутин","доступными CPU и лимитами контейнера"],
    "question-140-followup-1": ["число P","не ускоряет задачи, ограниченные ожиданием"],
    "question-140-followup-2": ["не начнёт одновременно выполнять больше Go-кода","конкуренцию и переключения"],
    "question-140-followup-3": ["runtime.GOMAXPROCS(0)","не меняет настройку","CPU-квоту контейнера"],
    "question-140-followup-4": ["ограничивает одновременно исполняемый Go-код"],
    "question-141": ["профили CPU, кучи, выделений, блокировок","выборкой стеков","top показывает дорогие функции","под воспроизводимой нагрузкой"],
    "question-141-followup-1": ["процессорное время","распределение памяти","стеки горутин","ожидание блокирующих операций"],
    "question-141-followup-2": ["защищённому диагностическому порту","Ограничьте доступ","сопоставимой нагрузке"],
    "question-141-followup-3": ["Ширина прямоугольника показывает долю отсчётов","вертикальные слои — стек вызовов","собственное время функции от суммарного"],
    "question-141-followup-4": ["после нескольких циклов нагрузки и GC","retained/inuse","Устойчивый рост живого heap"],
    "question-141-followup-5": ["программный API","net/http/pprof"],
    "question-141-followup-6": ["не каждое событие, а каждое N-ное"],
    "question-141-followup-7": ["CPU собирается только по требования","замерять для конкретного приложения"],
    "question-141-followup-8": ["создание / блокировка / разблокировка горутин","больше оверхеда"],
    "question-141-followup-9": ["ширина отражает долю отсчётов","наиболее широкие пути","не называя любой широкий прямоугольник «утечкой»"],
    "question-149": ["G — горутина","M — поток ОС","P — ресурс планировщика","локальных и глобальной очередях","забрать работу у другого P"],
    "question-149-followup-1": ["G — горутина","M — поток ОС","P — ресурс планировщика","степень параллелизма"],
    "question-149-followup-2": ["Число P и есть установленный GOMAXPROCS","ждут в очередях"],
    "question-149-followup-3": ["локальные очереди","глобальная очередь","забрать часть задач"],
    "question-149-followup-4": ["свободный P забирает часть готовых горутин","выровнять нагрузку"],
    "question-154": ["конкурентную маркировку от корней","очистку неотмеченных объектов","барьеры записи","Короткие остановки мира"],
    "question-154-followup-1": ["пауза выполнения пользовательского Go-кода","основную маркировку конкурентно","зависит от программы и нагрузки"],
    "question-154-followup-2": ["при записи ссылки","не пропустить достижимый объект"],
    "question-154-followup-3": ["скорость роста heap","объём работы сборщика","Сначала ищите реальные горячие места"],
    "question-154-followup-4": ["счётчики heap и GC","runtime/metrics","не функция просмотра статистики"],
    "question-159": ["уступает текущую возможность исполнения","не сон и не средство синхронизации","каналы, мьютексы или контекст"],
    "question-159-followup-1": ["добровольно уступает выполнение","не строить корректность"],
    "question-159-followup-2": ["не задавая длительность ожидания","как минимум на указанный интервал","не заменяет синхронизацию"],
    "question-159-followup-3": ["busy loop","блокирующее ожидание события"],
    "question-159-followup-4": ["runtime/trace","не является надёжным доказательством"],
    "question-162": ["не требует отдельного управления каждым объектом","нагрузку на аллокатор и GC","не означает обязательного обнуления"],
    "question-166": ["перестаёт быть активным","может использоваться следующими вызовами","освобождается или сохраняется для повторного использования","escape analysis"],
    "question-261": ["Error() string","обычные значения","последним результатом"],
    "question-262": ["errors.Is(err, ErrNotFound)","errors.As(err, &ve)","цепочка Unwrap","разрывает цепочку"],
    "question-263": ["errors.Join(err1, err2)","Unwrap() []error","все ветки"],
    "question-264": ["что делали","%w","Не логировать и возвращать одновременно"],
    "question-265": ["выполняются defer","ошибок программиста","Для ожидаемых ошибок","error"],
    "question-266": ["непосредственно в отложенной функции","в той же горутине"],
    "question-267": ["в каждой долгоживущей горутине","горутины, запущенные из хендлера"],
    "question-268": ["fatal error","конкурентная запись в map","stack overflow","deadlock"],
    "question-269": ["*runtime.PanicNilError","возвращает не-nil"],
    "question-270": ["в обратном порядке","останавливает раскрутку"],
    "question-271": ["Close может вернуть ошибку сброса буфера","errors.Join(err, f.Close())"],
    "question-346": ["канал таймера стал синхронным","не придёт «протухшее» значение","собираются GC"],
    "question-347": ["отбирает P","вытесняет горутины","опрашивает netpoller","форсирует GC"],
    "question-348": ["перехватывает запись указателя","старое, и новое значение указателя","сканируется один раз","STW-паузы"],
    "question-349": ["return false","рантайм паникует","корутинах рантайма","Обязательно вызывайте stop()"],
    "question-350": ["wall clock","монотонное показание","не ломает измерение интервалов","отбрасывается","t.Equal(u)"],
    "question-299": ["any","comparable","~int","cmp.Ordered"],
    "question-300": ["GC shape stenciling + словари","косвенный вызов","структур данных и алгоритмов"],
    "question-301": ["поведение","сохранить тип"],
    "question-302": ["в интерфейсах","Специализация","type switch"],
    "question-303": ["свои параметры типа","не участвуют в реализации интерфейсов"],
    "question-304": ["ссылаться на себя в своём списке параметров типа"],
    "question-305": ["не создавая новый тип"],
    "question-306": ["проверять результат yield","panic при break"],
    "question-307": ["выводит параметры по аргументам","по типу присваивания"],
    "question-249": ["и тип, и значение","возвращайте nil явно"],
    "question-250": ["все методы","на стороне потребителя","маленькие"],
    "question-251": ["значение T не реализует интерфейс","все на указателе"],
    "question-252": ["композиция с продвижением методов","нет виртуальных вызовов","частичных моков и декораторов"],
    "question-253": ["если все поля comparable","ошибка компиляции","panic в рантайме"],
    "question-254": ["0 байт","map[K]struct{}","chan struct{}"],
    "question-255": ["24 байта","16 байт","unsafe.Sizeof","atomic.Int64"],
    "question-256": ["Метаданные для рефлексии","reflect.StructTag.Get","omitzero"],
    "question-257": ["Только для типов своего пакета","type MyTime time.Time","обёртка-структура"],
    "question-258": ["Алиас interface{}","теряется типобезопасность","дженерики"],
    "question-259": ["Option func(*Server)","opts ...Option","идиоматичного API"],
    "question-260": ["копируется в кучу","статических таблиц","go build -gcflags=-m"],
    "question-316": ["t.Run(tt.name","t.Parallel()","tt := tt"],
    "question-317": ["отметить провал и продолжить","провал и runtime.Goexit","t.Helper()","t.Cleanup(f)"],
    "question-318": ["b.Loop()","-benchmem","benchstat"],
    "question-319": ["автоматически созданных входных данных","go test -fuzz"],
    "question-320": ["Детерминированное тестирование","без реальных Sleep"],
    "question-321": ["-coverprofile","GOCOVERDIR"],
    "question-322": ["где тратится процессорное время","сейчас в памяти","ожидание на каналах/мьютексах","не выставляйте наружу"],
    "question-323": ["работу планировщика, GC, блокировки по времени","кольцевом буфере","когда случилась аномалия"],
    "question-324": ["CPU-профиль продакшена","инлайнинга и девиртуализации","измеряется бенчмарком"],
    "question-325": ["go vet","staticcheck","govulncheck","go fix"],
    "question-433": ["наблюдаемый контракт и важные инварианты","различает корректную и ошибочную реализацию","стабильно работает","реалистичным хранилищем"],
    "question-433-followup-1": ["исполненные строки","не качество утверждений и сценариев","ловит ли тест намеренно внесённую ошибку"],
    "question-5": ["/proc/<PID>/fd/","lsof -p <PID>"],
    "question-6": ["/proc/<PID>/fd/","номера дескрипторов"],
    "question-7": ["SIGKILL (9) и SIGSTOP (19)","невозможно","SIGTERM (15)"],
    "question-8": ["Статус D","ядро Linux намеренно отключает проверку любых сигналов","Статус Z"],
    "question-12": ["Место не освободится","пока дескриптор открыт"],
    "question-13": ["того же самого inode","отдельный файл со своим inode","битой ссылкой"],
    "question-14": ["дублирует процесс","перезаписывает адресное пространство","только тогда, когда один из процессов пытается в них записать"],
    "question-17": ["родитель умер","не вызвал waitpid()","занимает запись в таблице PID"],
    "question-20": ["контролируемый переход","согласно ABI","проверяет аргументы","зависит от самой операции"],
    "question-20-followup-1": ["переход привилегий","копирование данных или ожидание устройства","зависит от операции"],
    "question-20-followup-2": ["номер вызова и аргументы в регистры","специальную инструкцию перехода","возвращает результат"],
    "question-20-followup-3": ["Нет универсального","блокируется ли поток","fsync","конкретную нагрузку"],
    "question-20-followup-4": ["готовность файловых дескрипторов"],
    "question-20-followup-5": ["разные PID","copy-on-write","PID ребёнка","0"],
    "question-20-followup-6": ["из пользовательского режима в режим ядра","возвращает управление"],
    "question-23": ["небольшое целое число","собственной таблице открытых ресурсов","текущим смещением и флагами","освобождает ссылку"],
    "question-23-followup-1": ["EMFILE","перестать принимать соединения"],
    "question-23-followup-2": ["мягкий и жёсткий предел RLIMIT_NOFILE","ulimit или prlimit"],
    "question-23-followup-3": ["/proc/<pid>/fd","lsof -p <pid>","/proc/<pid>/limits"],
    "question-23-followup-4": ["0, 1 и 2"],
    "question-25": ["собственное адресное пространство","разделяют память и открытые дескрипторы","отдельные стеки","какие ресурсы разделяются"],
    "question-25-followup-1": ["отдельным адресным пространством","до первой записи","разные значения"],
    "question-25-followup-2": ["разделяют адресное пространство","отдельная адресная среда","зависят от ОС"],
    "question-25-followup-3": ["адресные пространства нескольких процессов","без пересылки каждого байта","доступ нужно синхронизировать"],
    "question-25-followup-4": ["каналы и пайпы","сокеты","разделяемую память","сигналы"],
    "question-27": ["SIGTERM","завершиться штатно","SIGKILL","крайний вариант","непрерываемом ожидании ядра"],
    "question-27-followup-1": ["может быть обработан","не может перехватить или игнорировать","очистка на уровне приложения не выполняется"],
    "question-27-followup-2": ["не завершает дочерние процессы","переподчиняются","группу процессов или менеджер сервиса"],
    "question-27-followup-3": ["lsof <путь>","ss -ltnp","права администратора"],
    "question-27-followup-4": ["PID, права и состояние процесса","непрерываемый сон в ядре","зомби уже завершился"],
    "question-27-followup-5": ["сигнал SIGKILL","не запускаются","сначала посылают SIGTERM"],
    "question-11": ["oom_score","/proc/<PID>/oom_score_adj","наивысшим баллом"],
    "question-18": ["VIRT:","RSS:","Page Fault:","Minor","Major"],
    "question-19": ["единица отображения виртуальной памяти","Таблицы страниц","TLB кеширует трансляции","page fault","внутреннюю фрагментацию"],
    "question-19-followup-1": ["проверяет адрес и права","подгружает страницу или создаёт её","SIGSEGV"],
    "question-19-followup-2": ["активности и давления на память","давно не использованные страницы","в swap","перечитать из файла"],
    "question-19-followup-3": ["число записей в таблицах страниц и TLB","внутренние потери памяти","могут расходовать лишнюю память"],
    "question-19-followup-4": ["в TLB","избегает повторного обхода таблиц страниц"],
    "question-19-followup-5": ["большего размера","больше памяти одной записью TLB"],
    "question-24": ["выгружать анонимные страницы на диск","производительность резко снизится","OOM killer","не обязательно окажется именно текущий сервис","лимит памяти cgroup"],
    "question-24-followup-1": ["oom_score","не устраняет причину утечки","журнале ядра"],
    "question-24-followup-2": ["во времени","smaps","профиль выделений","продолжают расти"],
    "question-24-followup-3": ["значительно медленнее RAM","интенсивную подкачку","всё равно возможен OOM"],
    "question-24-followup-4": ["фактическое использование памяти и oom_score","не только размер виртуального адресного пространства"],
    "question-28": ["кеширует преобразования виртуальных адресов","Большие страницы покрывают больше памяти","не ускоряют всякую нагрузку"],
    "question-28-followup-1": ["читает таблицы страниц","page fault"],
    "question-28-followup-2": ["одной записью TLB","частоты TLB miss","собственную цену"],
    "question-28-followup-3": ["площадью, энергопотреблением и временем поиска","не бесплатен"],
    "question-4": ["нет структуры struct container","обычный процесс","Namespaces","Cgroups","pivot_root / chroot","Capabilities / Seccomp"],
    "question-9": ["R (Running/Runnable) и D","дисковый ввод-вывод","сетевой файловой системе"],
    "question-10": ["Закончились inodes","огромного количества микрофайлов"],
    "question-15": ["Дропаются сетевые пакеты","таблица отслеживания состояний NAT переполнена"],
    "question-16": ["независимыми деревьями","единая древовидная структура","PSI"],
    "question-21": ["исключительный доступ","число одновременных участников","ждать изменения условия","активно ждёт","быстрый путь в пользовательском пространстве"],
    "question-21-followup-1": ["одному владельцу","счётчик разрешений","не обязательно привязана к владельцу"],
    "question-21-followup-2": ["очень коротком ожидании","не усыпляет поток","позволяет заснуть и не тратить CPU"],
    "question-21-followup-3": ["многократно проверяет условие","всё время расходует процессорное время"],
    "question-22": ["ограниченными привилегиями","привилегированные операции","системный вызов, исключение или прерывание","защищает систему"],
    "question-22-followup-1": ["системному вызову, прерыванию или исключению","переключает режим","восстанавливает пользовательский контекст"],
    "question-22-followup-2": ["сохранения и восстановления контекста","увеличивают задержку","объединяют в пакеты"],
    "question-22-followup-3": ["аппаратная проверка прав","через системный вызов"],
    "question-26": ["1,46 логического процессора","нормально для многопоточного процесса","само число не доказывает перегрузку"],
    "question-26-followup-1": ["пользовательское и системное время","изменение этого времени за интервал"],
    "question-26-followup-2": ["одновременно работать на разных ядрах","суммарно больше 100%"],
    "question-26-followup-3": ["1, 5 и 15 минут","ожидают CPU","непрерываемом ожидании","числом доступных CPU"],
    "question-1": ["системные и технические недостатки","не наказать инженера","замалчиванию проблем"],
    "question-2": ["SLI (Indicator)","SLO (Objective)","SLA (Agreement)","Error Budget Burn Rate"],
    "question-121": ["Latency","Traffic","Errors","Saturation"],
    "question-419": ["идемпотентность","общим дедлайном","экспоненциальную задержку с jitter","умножает нагрузку"],
    "question-419-followup-1": ["синхронно повторит запрос","новый пик нагрузки"],
    "question-420": ["ограничивает ожидание отдельного запроса","временно прекращает обращения","пробные вызовы","метрик состояний"],
    "question-420-followup-1": ["half-open","пробные вызовы"],
    "question-421": ["замедляет производителя или ограничивает очередь","отвергает часть запросов заранее","лучше бесконечного накопления"],
    "question-421-followup-1": ["увеличивает время ожидания","устаревшую работу"],
    "question-422": ["после небольшого порога","первый успешный ответ","идемпотентных чтений","отмена проигравшего запроса","ухудшает ситуацию"],
    "question-422-followup-1": ["два эффекта","идемпотентного протокола"],
    "question-423": ["выводят из балансировки","ждут завершения текущих запросов","подтверждает только завершённые события","выдерживать повторы"],
    "question-423-followup-1": ["поймать сигнал","дождаться работы и закрыть ресурсы"],
    "question-118": ["сам опрашивает","централизованный контроль частоты","приложения шлют метрики сами","короткоживущих batch-джобов"],
    "question-119": ["Каждая уникальная комбинация лейблов","отдельный time-series","миллионов","OOM"],
    "question-120": ["числовые агрегаты во времени","текстовые записи событий","путь одного запроса","узких мест"],
    "question-122": ["управляет конфигурацией Prometheus декларативно","ServiceMonitor","PodMonitor","без перезапуска"],
    "question-169": ["метрики, логи и распределённые трассировки","Профилирование CPU и памяти","корреляционные идентификаторы","по симптомам для пользователя и SLO"],
    "question-169-followup-1": ["Rate","Errors","Duration","Utilization","Saturation","p95/p99"],
    "question-169-followup-2": ["собирает и показывает состояние","уведомляет ответственного","пользовательскому эффекту"],
    "question-169-followup-3": ["trace ID","span ID","путь и задержки вызовов","через все границы"],
    "question-169-followup-4": ["Prometheus собирает и хранит","Grafana строит панели","сначала определяют нужные показатели"],
    "question-169-followup-5": ["pprof","runtime/pprof","представительной нагрузке"],
    "question-169-followup-6": ["/debug/vars","диагностические переменные","доступ к нему нужно ограничивать"],
    "question-169-followup-7": ["kubectl logs","--previous","-f"],
    "question-171": ["trace ID","span ID","через заголовки или сообщения","задержки отдельных этапов"],
    "question-3": ["CI-раннер имеет админские токены","агент внутри кластера следит за Git-репозиторием","Git — единственный источник правды"],
    "question-50": ["линтеры и тесты с детектором гонок","multi-stage сборка","GitOps Sync","Startup/Readiness пробы","SIGTERM"],
    "question-58": ["Pod Security Admission","privileged","baseline","restricted"],
    "question-59": ["плавная замена старых подов","полная параллельная среда","малый процент трафика","Следят за ошибками"],
    "question-60": ["не модифицируются «на лету»","вносится в код","дрейф конфигураций","невоспроизводимой при аварии"],
    "question-51": ["Multi-stage сборка","scratch или distroless",".dockerignore"],
    "question-52": ["изолированный процесс","Namespaces","Cgroups","pivot_root","AppArmor / Seccomp"],
    "question-53": ["PID 1","не применяет дефолтные обработчики","собирать статус завершения дочерних процессов","tini","dumb-init"],
    "question-54": ["фиксированная бинарная команда","аргументы по умолчанию","запускает бинарник напрямую","/bin/sh -c"],
    "question-55": ["gRPC-интерфейс","высокоуровневые демоны-рантаймы","низкоуровневый CLI-инструмент"],
    "question-56": ["USER 10001:10001","readOnlyRootFilesystem","drop: [\"ALL\"]","allowPrivilegeEscalation: false"],
    "question-57": ["Инвалидация одного слоя","всех последующих","сначала копировать манифесты зависимостей","потом копировать исходный код"],
    "question-167": ["вокруг ресурсов и стандартной семантики HTTP","RPC описывает вызываемые операции","версионирование, идемпотентность, таймауты"],
    "question-167-followup-1": ["каждый запрос содержит данные, необходимые серверу","не требуется помнить контекст предыдущего запроса","облегчает кеширование, балансировку"],
    "question-167-followup-2": ["бинарному Protobuf, HTTP/2 и постоянным соединениям","скорость зависит от размера сообщений","проверяют измерением типичной нагрузки"],
    "question-167-followup-3": ["REST удобен для публичного HTTP API","RPC/gRPC подходит для строго типизированного взаимодействия сервисов","Сравнивают требования к клиентам"],
    "question-167-followup-4": ["JSON","Protobuf и MessagePack","Сериализация выбирается по контракту"],
    "question-167-followup-5": ["REST — архитектурный стиль","HTTP предоставляет методы, URI, заголовки и кеширование","поддерживать ограничения REST"],
    "question-167-followup-6": ["RPC описывает вызов удалённой операции","поверх HTTP/2, обычного TCP или другого транспорта","кодирование запроса, границы сообщений, ответы, ошибки"],
    "question-167-followup-7": ["POST /Calculator/Add","аргументы в теле JSON или Protobuf","ошибки","контракт метода и таймаут"],
    "question-167-followup-8": ["определить границы сообщений","идентификатор запроса, таймауты","TCP передаёт поток байт","TLS и проверка сторон"],
    "question-168": ["протокол запросов и ответов прикладного уровня","Запрос содержит метод, целевой URI и версию протокола","ответ содержит статус, заголовки и тело","коды 2xx/3xx/4xx/5xx"],
    "question-168-followup-1": ["GET для чтения","POST для обработки или создания","PUT для полной замены","PATCH для частичного изменения","Семантика безопасности и идемпотентности"],
    "question-168-followup-2": ["Content-Type описывает формат тела","Accept — ожидаемый формат ответа","Authorization — данные авторизации","Cache-Control — правила кеширования"],
    "question-168-followup-3": ["1xx (informational)","2xx (success)","3xx (redirect)","4xx (client error)","5xx (server error)"],
    "question-170": ["ключ сообщения и партиционирование","порядок внутри партиции","consumer groups","управление offset и повторную обработку","проверку внешних побочных эффектов"],
    "question-381": ["Kafka хранит упорядоченный журнал событий в партициях","RabbitMQ ориентирован на маршрутизацию и доставку сообщений","нагрузки, порядка, хранения истории"],
    "question-381-followup-1": ["Смещение потребителя хранится отдельно от журнала","событие будет прочитано повторно","идемпотентным"],
    "question-382": ["Тема разбита на партиции","каждую партицию обрабатывает один активный потребитель","Реплики партиций хранят копии","replication factor, min.insync.replicas, acks"],
    "question-382-followup-1": ["порядок внутри партиции","один ключ партиционирования","глобальный порядок с несколькими партициями отсутствует"],
    "question-383": ["at-most-once сообщение может потеряться","at-least-once повторы возможны","Exactly-once достижимо только в конкретной границе транзакции","сторонней БД или API требует отдельного механизма"],
    "question-383-followup-1": ["После сохранения результата","сбой между подтверждением и записью приведёт к потере эффекта"],
    "question-384": ["стабильный идентификатор","В той же транзакции","уникальный ключ операции","кэш дедупликации не защищает от потери"],
    "question-384-followup-1": ["Два обработчика могут одновременно пройти проверку","уникальная констрейнт и атомарная транзакция"],
    "question-385": ["одной транзакцией БД","Отдельный издатель читает outbox","публикация потеряна","идемпотентного потребителя"],
    "question-385-followup-1": ["Между двумя операциями процесс может завершиться","событие не появится"],
    "question-386": ["FOR UPDATE SKIP LOCKED","срок аренды для зависших задач","блокировку строки не удерживают на всё время","периодически продлевает его"],
    "question-386-followup-1": ["После истечения аренды задачу возвращают в очередь","побочный эффект должен быть идемпотентным"],
    "question-387": ["одному из конкурирующих обработчиков","Журнал сохраняет записи на заданный срок","группы потребителей независимо ведут свои позиции"],
    "question-387-followup-1": ["группа потребителей распределяет партиции","порядок, повторы и параллелизм определяются партициями"],
    "question-388": ["Синхронный вызов нужен, когда ответ другого сервиса обязателен","Событие снижает связанность по времени","задержку, повторную доставку и eventual consistency","дедлайн, повтор, версионирование"],
    "question-388-followup-1": ["сразу нужен окончательный результат","состояние операции, отслеживание прогресса","обработка неуспеха"],
    "question-408": ["Источник истины хранит остаток или доступность","атомарно проверяет и резервирует единицу","срок действия и состояния","идемпотентно"],
    "question-408-followup-1": ["Параллельный клиент может пройти ту же проверку","одной атомарной операцией"],
    "question-409": ["Каталог и поиск выдерживают большой объём чтений","Заказ и остатки требуют строгих инвариантов","фиксируют цену и состав","поисковый индекс не становится источником истины"],
    "question-409-followup-1": ["Каталог может измениться","согласованную цену, показанную при подтверждении"],
    "question-410": ["коротким сроком жизни и уникальным идентификатором сессии","повторные события не должны удваивать счётчик","глобальное значение может сходиться с небольшой задержкой","допуск ошибки задают явно"],
    "question-410-followup-1": ["Клиент может исчезнуть без корректного отключения","TTL, восстановление и дедупликация"],
    "question-411": ["устойчивый ID и сохраняется в источнике истины","событие доставляется подписчикам","клиент дедуплицирует повторы","после переподключения догружает пропущенное","эфемерны"],
    "question-411-followup-1": ["порядок внутри диалога или канала","глобальный порядок для всех чатов не нужен"],
    "question-412": ["Метаданные файлов и иерархию хранят отдельно от содержимого","делят на чанки","Хеш содержимого помогает дедупликации","контрольные суммы проверяют целостность","права доступа проверяют по метаданным"],
    "question-412-followup-1": ["неподходящую нагрузку на транзакционную БД","объектное хранилище лучше для содержимого"],
    "question-413": ["геоиндексе с TTL","кандидатов из соседних ячеек","фильтрует по доступности и точному расстоянию","атомарным изменением состояния"],
    "question-413-followup-1": ["группирует точки по ячейкам","вычислить расстояние","границы соседних ячеек"],
    "question-414": ["Fan-out-on-write быстро отдаёт готовую ленту","Fan-out-on-read снижает цену публикации","Гибридная схема материализует обычные связи","курсор и дедупликация"],
    "question-414-followup-1": ["асинхронны","eventual consistency"],
    "question-415": ["централизованным генератором диапазонов, распределённым счётчиком или случайной строкой","быструю копию соответствия ID → URL","аналитику переходов отправлять асинхронно","срок действия, защита от вредоносных адресов"],
    "question-415-followup-1": ["зависимость к каждому redirect","аналитики обычно менее критична"],
    "question-416": ["sorted set","Долговременную историю и пересчёт сохраняют отдельно","идемпотентными по ID события","TTL и правила поздних событий"],
    "question-416-followup-1": ["долговечного журнала результатов или периодического снимка","события после снимка"],
    "question-417": ["rate limiting, дедлайнами и повтором с jitter","с временем обновления держат в быстром хранилище","WebSocket или SSE","последнее известное положение с возрастом данных"],
    "question-417-followup-1": ["Число клиентов умножит внешнюю нагрузку","риск превышения лимитов API"],
    "question-418": ["изолируют в отдельной среде","лимитами CPU, памяти, времени, файловой системы и сети","Очередь отделяет приём запроса","Изоляция контейнера сама по себе недостаточна","ограничения привилегий, системных вызовов, исходящего трафика"],
    "question-418-followup-1": ["Недоверенный код может пытаться прочитать скрытые данные","внешняя доверенная часть системы"],
    "question-371": ["идемпотентные","временные","Экспоненциальная задержка + jitter","Retry budget","одном","дедлайн"],
    "question-372": ["кратковременный","длительного","Open","Half-Open","Closed","fallback"],
    "question-373": ["Idempotency-Key","сохранённый ответ","TTL","дедупликация по ID сообщения","at-least-once доставка + идемпотентная обработка"],
    "question-374": ["2PC","блокирующий","Сага","компенсирующее действие","Оркестрация","Хореография"],
    "question-375": ["SET key token NX PX 30000","блокировка истекла","fencing token","монотонно растущий номер","Redlock эту проблему не решает"],
    "question-376": ["hash(key) % N","кольцо","1/N","Виртуальные узлы","rendezvous hashing"],
    "question-377": ["Backpressure","Load shedding","Bulkhead","Adaptive concurrency limits"],
    "question-378": ["дубликат","первый ответ","p99","идемпотентных чтений"],
    "question-379": ["автоматически","grpc-timeout","исходный бюджет","вручную","остаток времени"],
    "question-380": ["Lease-объект","concurrency.NewElection","pg_try_advisory_lock","fencing","дважды"],
    "question-182": ["уникальную случайную соль","медленную функцию","Argon2id, scrypt или bcrypt","быстрый hash(password + salt) недостаточен"],
    "question-182-followup-1": ["Соль можно хранить рядом с хешем пароля","уникальную случайную соль","pepper, если используется, хранят отдельно"],
    "question-182-followup-2": ["bcrypt использует адаптивную стоимость вычисления","scrypt специально требует существенной памяти","Argon2id также настраивает память, время и параллелизм","уникальная соль"],
    "question-183": ["время ответа не должно зависеть от позиции первого несовпадающего байта","crypto/subtle.ConstantTimeCompare","проверку длины и другие ветви обработки"],
    "question-183-followup-1": ["время выполнения зависит от длины общего префикса","побочный канал","сравнение с постоянным временем"],
    "question-183-followup-2": ["без раннего выхода при первом несовпадении","При различной длине функция возвращает 0 сразу","остальная логика проверки тоже должны учитывать утечки времени"],
    "question-402": ["LRU удаляет запись, к которой дольше всего не обращались","Хеш-таблица находит элемент по ключу","двусвязный список переносит его в начало","блокировки, TTL, ограничения по байтам"],
    "question-402-followup-1": ["быстро находит ключ","не хранит порядок последнего использования"],
    "question-403": ["Token bucket допускает короткие всплески","Leaky bucket сглаживает выпуск","Fixed window прост, но допускает двойной всплеск","sliding window точнее","согласованную область действия"],
    "question-403-followup-1": ["HTTP 429","Retry-After","ключу, который нельзя легко подменить"],
    "question-404": ["корректность при конкурентном доступе","одновременной загрузке одного ключа","ограничение памяти, TTL, инвалидирование","после рестарта"],
    "question-404-followup-1": ["Множество запросов одновременно видит промах","singleflight, jitter TTL и ограничение параллелизма"],
    "question-405": ["много интерфейсов с одинаковыми правилами","типобезопасные сигнатуры","AST или go/types","детерминированный код","явная обёртка проще"],
    "question-405-followup-1": ["go/types разрешает импорты, алиасы, типы и методы","текстовый поиск ломается"],
    "question-406": ["пользовательскую задержку и ошибки","насыщением CPU, памяти, очередей, сетевых соединений и БД","Трейс показывает","времени начала, охвату, недавним изменениям"],
    "question-406-followup-1": ["p95/p99 показывают хвосты распределения","неизменном среднем"],
    "question-407": ["сохраняет основную функцию при отказе необязательной зависимости","какие данные допустимо показывать устаревшими","обозначить неполный результат","Для платежей и инвариантов"],
    "question-407-followup-1": ["долю запросов на запасном пути","возраст данных и длительность деградации"],
    "question-30": ["надежный, с установлением соединения","гарантирует порядок доставки","без установки соединения","без гарантии доставки и порядка"],
    "question-31": ["MAC-адрес работает только на канальном уровне","MAC-адрес вашего Default Gateway","ARP"],
    "question-32": ["разных IP-адресах","TCP","UDP","SO_REUSEPORT"],
    "question-33": ["TTL (Time to Live)","уменьшается на 1","Checksum","меняются MAC-адреса источника и назначения"],
    "question-34": ["DF (Don't Fragment) = 0","фрагментирован","потере одного фрагмента теряется весь UDP-пакет","DF = 1","ICMP-ответ Fragmentation Needed"],
    "question-36": ["TIME_WAIT","локальная сторона","2*MSL","CLOSE_WAIT","приложение не вызвало close(socket)"],
    "question-37": ["Оверлейные протоколы","внутренний MTU должен быть не более 1450","ICMP «Fragmentation Needed» заблокирован","MTU Blackhole"],
    "question-41": ["TCP Keep-Alive","проверки живого состояния соединения","SO_REUSEPORT","балансировку входящих соединений"],
    "question-42": ["BGP-сессию","анонсирует внешний IP сервиса","ECMP"],
    "question-43": ["упорядоченный поток байтов","повторной передачей, управлением потоком и перегрузкой","отдельные датаграммы без гарантии доставки","bind/listen/accept","connect"],
    "question-43-followup-1": ["не выполняет подтверждение или повторную передачу","накладные расходы и задержка могут быть ниже","не гарантия большей скорости приложения"],
    "question-43-followup-2": ["SYN, SYN-ACK, ACK","начальные номера последовательности и параметры соединения"],
    "question-43-followup-3": ["обнаруживает потерю по подтверждениям и таймерам","повторно передаёт","UDP сам не восстанавливает пакет"],
    "question-43-followup-4": ["низкая задержка","DNS, медиапотоки, игровые пакеты, QUIC","не делает UDP автоматически быстрее"],
    "question-43-followup-5": ["упорядоченный надёжный поток байтов","контролем перегрузки и повторной передачей","задержка зависит от сети и приложения"],
    "question-43-followup-6": ["низкая задержка или собственное управление потерями","не подтверждает доставку и не гарантирует порядок","гарантии добавляет приложение"],
    "question-45": ["TCP или через uTP поверх UDP","надёжность реализована выше UDP","блоки файла проверяются по хешам","Сам UDP ни порядок, ни доставку не обеспечивает"],
    "question-40": ["502 Bad Gateway","Connection refused","504 Gateway Timeout","принял соединение, но не ответил","долгий SQL-запрос, дедлок, зависание внешнего API"],
    "question-44": ["Прямой proxy принимает запрос от клиента","Reverse proxy расположен перед серверами приложения","завершать TLS, балансировать нагрузку и кешировать ответы"],
    "question-44-followup-1": ["от имени клиента","стоит перед сервером","к внутренним серверам"],
    "question-44-followup-2": ["завершать TLS","маршрутизировать и балансировать запросы","кешировать ответы","ограничивать трафик"],
    "question-44-followup-3": ["upstream-серверов","proxy_pass","health checks","X-Forwarded-* заголовки"],
    "question-44-followup-4": ["распределяет запросы между несколькими экземплярами","закрепляют клиента за экземпляром","состояние лучше хранить отдельно"],
    "question-46": ["HTTP-семантику по QUIC поверх UDP","надёжные независимые потоки и TLS 1.3","не все потоки TCP-соединения"],
    "question-47": ["отделить политику кеширования","не отправлять прикладные cookie","дополнительное соединение и DNS-запрос","проверяют на реальном трафике"],
    "question-48": ["текстовое представление сообщений","бинарные кадры","мультиплексирование потоков","HPACK","Семантика методов и кодов ответа сохраняется"],
    "question-49": ["100 Continue — промежуточный ответ","после проверки заголовков","301 Moved Permanently","Location","нюансы поведения клиентов"],
    "question-29": ["внешний IP (LoadBalancer/BGP)","терминирует TLS","ClusterIP нет сетевого интерфейса","подменяет IP назначения","VXLAN/Geneve","veth-пару"],
    "question-35": ["виртуальный ClusterIP","TCP SYN","iptables DNAT или eBPF","IP конкретного пода","интерфейс CNI"],
    "question-38": ["линейный перебор цепочек правил","хэш-таблицы","eBPF","XDP"],
    "question-39": ["ndots:5","перебирает все search-домены","точку на конце имени","NodeLocal DNSCache"],
    "question-62": ["ресурсы с неудаляемыми Finalizers","Недоступен Custom Metrics API сервис или агрегированный API-сервер"],
    "question-69": ["kubectl auth can-i","SelfSubjectAccessReview"],
    "question-70": ["StartupProbe","Liveness и Readiness не опрашиваются","ReadinessProbe","исключается из Endpoints","LivenessProbe","перезапускает контейнер"],
    "question-72": ["Удаление пода из Endpoints происходит асинхронно","SIGTERM","preStop hook","закрывает соединения"],
    "question-73": ["kubectl describe pod","Events","kubectl logs","--previous","OOMKilled","Exit Code: 137"],
    "question-75": ["requests.cpu","Планировщик использует requests","limits.cpu","троттлингу","limits.memory","OOM Killer"],
    "question-76": ["DiskPressure, MemoryPressure, PIDPressure","systemctl status kubelet","journalctl -u kubelet","systemctl status containerd","df -h","free -m"],
    "question-77": ["нельзя коммитить открытый base64","External Secrets Operator","Mozilla SOPS","Sealed Secrets"],
    "question-78": ["HPA меняет количество реплик","VPA меняет Requests/Limits","оба настроены на одну метрику","шторм рестартов"],
    "question-79": ["metadata.finalizers","не удаляй объект из etcd","контроллер не выполнит очистку","контроллер упал или завис"],
    "question-61": ["Authentication","Authorization","Сохранение в etcd","Deployment Controller","ReplicaSet Controller","kube-scheduler","kubelet на ноде"],
    "question-63": ["Главный агент на каждой рабочей ноде","отслеживает спецификации Pod'ов","через CRI","через CSI","отправляет статус ноды"],
    "question-64": ["nodeSelector","nodeAffinity / nodeAntiAffinity","podAntiAffinity","Taints & Tolerations","topologySpreadConstraints"],
    "question-65": ["строго консистентное key-value хранилище","Raft","кроме kube-apiserver"],
    "question-66": ["DaemonSet","на каждом узле","CNI-агентов","сборщиков логов"],
    "question-67": ["Scheduler Framework","точки расширения","--scheduler-name=my-scheduler","spec.schedulerName"],
    "question-68": ["Mutating Admission Webhooks","валидация схемы","Validating Admission Webhooks","окончательное, полностью сформированное состояние"],
    "question-71": ["консенсус Raft","кворум равен 2 ноды","кворум потерян","Новые поды и изменения применить невозможно"],
    "question-74": ["CRD (Custom Resource Definition)","Informer","WorkQueue","Reconcile Loop","реальное состояние","желаемым"],
    "question-80": ["Ingress","Gateway API","разделением ролей","GatewayClass и Gateway","HTTPRoute","GRPCRoute"],
  };
  const highlightAnswerKeys = () => {
    list.querySelectorAll('.answer-box').forEach(answer => {
      const item = answer.closest('.clarification-item') || answer.closest('.question-card');
      const phrases = answerHighlights[item?.id] || [];
      phrases.forEach(phrase => {
        const walker = document.createTreeWalker(answer, NodeFilter.SHOW_TEXT, {
          acceptNode(node) {
            return node.parentElement.closest('button, .answer-meta, .answer-code-modal')
              ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
          }
        });
        const nodes = [];
        let fullText = '';
        let node;
        while ((node = walker.nextNode())) {
          nodes.push({ node, start: fullText.length, end: fullText.length + node.length });
          fullText += node.textContent;
        }
        const candidates = [];
        for (let start = fullText.indexOf(phrase); start !== -1; start = fullText.indexOf(phrase, start + 1)) {
          const end = start + phrase.length;
          const parts = nodes.filter(part => part.start < end && part.end > start);
          if (!parts.length || parts.some(part => part.node.parentElement.closest('.answer-key'))) continue;
          candidates.push({ start, end, parts, inCodeBlock: parts.some(part => part.node.parentElement.closest('pre')) });
        }
        const match = candidates.find(candidate => !candidate.inCodeBlock) || candidates[0];
        if (!match) return;
        match.parts.reverse().forEach(part => {
          const range = document.createRange();
          range.setStart(part.node, Math.max(0, match.start - part.start));
          range.setEnd(part.node, Math.min(part.node.length, match.end - part.start));
          const highlight = document.createElement('span');
          highlight.className = 'answer-key';
          highlight.append(range.extractContents());
          range.insertNode(highlight);
        });
      });
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
  const setSubtopicExpanded = (section, expanded) => {
    const button = section.querySelector(':scope > h3 > .subtopic-collapse-button');
    if (!button) return;
    section.classList.toggle('subtopic-collapsed', !expanded);
    button.setAttribute('aria-expanded', String(expanded));
    button.setAttribute('aria-label', (expanded ? 'Свернуть' : 'Развернуть') +
      ' вопросы подтемы «' + button.dataset.subtopicTitle + '»');
  };
  const setupSubtopicCollapses = () => {
    list.querySelectorAll('.question-section').forEach(section => {
      const heading = section.querySelector(':scope > h3');
      if (!heading || !section.querySelector(':scope > .question-card')) return;
      const title = document.createElement('span');
      title.className = 'subtopic-heading-title';
      while (heading.firstChild) title.append(heading.firstChild);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'subtopic-collapse-button';
      button.dataset.subtopicTitle = title.textContent.trim();
      button.innerHTML = '<span aria-hidden="true">▾</span>';
      heading.classList.add('collapsible-subtopic-heading');
      heading.append(title, button);
      button.addEventListener('click', () => {
        setSubtopicExpanded(section, section.classList.contains('subtopic-collapsed'));
      });
      setSubtopicExpanded(section, true);
    });
  };
  const scrollToHash = () => {
    if (!location.hash) return;
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (!target) return;
    const topicSection = target.closest('.question-section');
    if (topicSection?.classList.contains('subtopic-collapsed')) {
      setSubtopicExpanded(topicSection, true);
    }
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
    addCodeExamples();
    restoreStudyState();
    syncAllQuestionCheckboxes();
    centerQuestionCheckboxes();
    addRelatedQuestions();
    addAdditionalSources();
    addStudyExportButtons();
    setupNumberControls();
    setupSubtopicCollapses();
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
  addCodeExamples();
  restoreStudyState();
  syncAllQuestionCheckboxes();
  centerQuestionCheckboxes();
  addRelatedQuestions();
  addAdditionalSources();
  addStudyExportButtons();
  scrollToHash();
})();
