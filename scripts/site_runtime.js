(() => {
  const groups = [{"id":"golang","label":"GoLang","topics":[{"id":"basics","label":"Основы языка","count":13,"path":"golang/basics.html"},{"id":"concurrency","label":"Конкурентность","count":16,"path":"golang/concurrency.html"},{"id":"runtime","label":"Рантайм и профилирование","count":9,"path":"golang/runtime.html"},{"id":"ecosystem","label":"Экосистема и тестирование","count":0,"path":"golang/ecosystem.html"},{"id":"language","label":"Язык и значения","count":17,"path":"golang/language.html"},{"id":"collections_deep","label":"Коллекции и строки","count":4,"path":"golang/collections_deep.html"},{"id":"types","label":"Типы, интерфейсы и структуры","count":5,"path":"golang/types.html"},{"id":"errors","label":"Ошибки и паники","count":7,"path":"golang/errors.html"},{"id":"concurrency_patterns","label":"Паттерны конкурентности","count":4,"path":"golang/concurrency_patterns.html"},{"id":"synchronization","label":"Синхронизация и память","count":3,"path":"golang/synchronization.html"},{"id":"runtime_deep","label":"Планировщик и память","count":8,"path":"golang/runtime_deep.html"},{"id":"generics","label":"Дженерики и итераторы","count":3,"path":"golang/generics.html"},{"id":"context_deep","label":"Контекст и отмена","count":1,"path":"golang/context_deep.html"},{"id":"testing","label":"Тестирование и профилирование","count":4,"path":"golang/testing.html"},{"id":"backend","label":"HTTP, gRPC и данные","count":4,"path":"golang/backend.html"},{"id":"design","label":"Проектирование Go-сервисов","count":3,"path":"golang/design.html"},{"id":"runtime_internals","label":"Внутренности рантайма","count":0,"path":"golang/runtime_internals.html"},{"id":"optimization","label":"Оптимизация и unsafe","count":3,"path":"golang/optimization.html"},{"id":"build_security","label":"Сборка и безопасность","count":2,"path":"golang/build_security.html"}]},{"id":"linux","label":"Linux и ОС","topics":[{"id":"processes","label":"Процессы и файлы","count":4,"path":"linux/processes.html"},{"id":"memory","label":"Память","count":3,"path":"linux/memory.html"},{"id":"kernel","label":"Ядро и диагностика","count":2,"path":"linux/kernel.html"}]},{"id":"network","label":"Сети","topics":[{"id":"transport","label":"Транспорт и маршрутизация","count":1,"path":"network/transport.html"},{"id":"http","label":"HTTP и прокси","count":2,"path":"network/http.html"},{"id":"kubernetes","label":"Сеть Kubernetes","count":2,"path":"network/kubernetes.html"}]},{"id":"containers","label":"Контейнеры и доставка","topics":[{"id":"docker","label":"Docker и контейнеры","count":3,"path":"containers/docker.html"},{"id":"delivery","label":"CI/CD и развёртывание","count":3,"path":"containers/delivery.html"}]},{"id":"kubernetes","label":"Kubernetes","topics":[{"id":"architecture","label":"Устройство кластера","count":3,"path":"kubernetes/architecture.html"},{"id":"operations","label":"Эксплуатация","count":3,"path":"kubernetes/operations.html"}]},{"id":"databases","label":"Базы данных","topics":[{"id":"sql","label":"SQL и транзакции","count":6,"path":"databases/sql.html"},{"id":"postgresql","label":"PostgreSQL","count":5,"path":"databases/postgresql.html"},{"id":"indexes","label":"Индексы и оптимизация","count":5,"path":"databases/indexes.html"},{"id":"distributed","label":"Репликация и распределение","count":1,"path":"databases/distributed.html"},{"id":"redis","label":"Redis и кеширование","count":6,"path":"databases/redis.html"},{"id":"querying","label":"Запросы и представления","count":2,"path":"databases/querying.html"},{"id":"scaling","label":"Модели и масштабирование","count":3,"path":"databases/scaling.html"}]},{"id":"algorithms","label":"Алгоритмы","topics":[{"id":"graphs","label":"Графы и обходы","count":1,"path":"algorithms/graphs.html"}]},{"id":"architecture","label":"Архитектура сервисов","topics":[{"id":"services","label":"API и интеграции","count":1,"path":"architecture/services.html"},{"id":"security","label":"Безопасность","count":0,"path":"architecture/security.html"},{"id":"messaging","label":"Брокеры и доставка событий","count":8,"path":"architecture/messaging.html"},{"id":"distributed","label":"Распределённые системы","count":9,"path":"architecture/distributed.html"},{"id":"service_patterns","label":"Паттерны сервисов","count":4,"path":"architecture/service_patterns.html"},{"id":"scenarios","label":"Архитектурные сценарии","count":3,"path":"architecture/scenarios.html"}]},{"id":"reliability","label":"SRE и наблюдаемость","topics":[{"id":"sre","label":"SRE и показатели","count":2,"path":"reliability/sre.html"},{"id":"observability","label":"Метрики, логи и трассировка","count":4,"path":"reliability/observability.html"},{"id":"resilience","label":"Устойчивость сервисов","count":2,"path":"reliability/resilience.html"}]}];
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
    '<section class="sidebar-profile" aria-label="Профиль">' +
    '<div class="sidebar-profile-row"><span class="sidebar-profile-name" id="profile-name"></span>' +
    '<button type="button" id="profile-rename" aria-label="Переименовать профиль" title="Переименовать профиль">✎</button></div>' +
    '<p id="profile-status" role="status" aria-live="polite"></p>' +
    '</section>' +
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
  const profileNameStorageKey = 'interviewpro-theory-profile-name-v1';
  const topicKeys = groups.flatMap(group => group.topics.map(topic => group.id + '/' + topic.id));
  const topicFileName = topic => topic.replace('/', '__') + '.json';
  const validProfileName = name => /^[\p{L}\p{N}_-]{1,64}$/u.test(name);
  let profileName = 'artur';
  try {
    const savedName = localStorage.getItem(profileNameStorageKey);
    if (savedName && validProfileName(savedName)) profileName = savedName;
  } catch (_) { /* use the default name */ }
  const profileNameLabel = sidebar.querySelector('#profile-name');
  profileNameLabel.textContent = profileName;
  const stateFileName = 'state.json';
  const loadedStorageKey = () => profileName === 'artur'
    ? 'interviewpro-theory-artur-loaded-v1'
    : 'interviewpro-theory-profile-loaded-' + encodeURIComponent(profileName) + '-v1';
  const dirtyStudyStorageKey = 'interviewpro-theory-unsaved-state-v1';
  const profileStatus = sidebar.querySelector('#profile-status');
  const readPreference = key => {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  };
  const writePreference = (key, value) => {
    try { localStorage.setItem(key, value); } catch (_) { /* unavailable */ }
  };
  let stateLoaded = readPreference(loadedStorageKey()) === '1';
  let studyDirty = readPreference(dirtyStudyStorageKey) === '1' ||
    (!stateLoaded && Object.values(studied).some(value => value === true));
  const setStudyDirty = dirty => {
    studyDirty = dirty;
    writePreference(dirtyStudyStorageKey, dirty ? '1' : '0');
  };
  const showProfileStatus = (message, openDirectly = false) => {
    [profileStatus, ...document.querySelectorAll('.study-save-status')].forEach(status => {
      status.textContent = message;
      if (!openDirectly) return;
      const link = document.createElement('a');
      link.href = window.location.href;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Открыть страницу отдельно';
      status.append(' ', link);
    });
  };
  sidebar.querySelector('#profile-rename').addEventListener('click', () => {
    const nextName = window.prompt('Новое имя профиля (буквы, цифры, _ или -):', profileName);
    if (nextName === null) return;
    const trimmedName = nextName.trim();
    if (!validProfileName(trimmedName)) {
      showProfileStatus('Имя: от 1 до 64 символов; только буквы, цифры, _ и -.');
      return;
    }
    if (trimmedName === profileName) return;
    profileName = trimmedName;
    profileNameLabel.textContent = profileName;
    writePreference(profileNameStorageKey, profileName);
    stateLoaded = false;
    if (Object.keys(studySnapshot()).length) setStudyDirty(true);
    const loadButton = document.querySelector('.study-number-load');
    if (loadButton) loadButton.textContent = 'Загрузить состояние ' + profileName;
    showProfileStatus('Имя изменено. Новое сохранение: data/' + profileName + '/state.json. Старый файл сохранён.');
  });
  const studySnapshot = () => Object.fromEntries(
    Object.entries(studied).filter(([, value]) => value === true));
  const validStudyMarks = value => value && typeof value === 'object' &&
    !Array.isArray(value) && Object.entries(value).every(([key, marked]) =>
      /^question-\d+(?:-followup-[1-9]\d*)?$/.test(key) && marked === true);
  let storeHandle = null;
  const folderDatabase = () => new Promise((resolve, reject) => {
    const request = indexedDB.open('interviewpro-theory-folder-v1', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('settings');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  const savedFolder = async () => {
    const database = await folderDatabase();
    try {
      return await new Promise((resolve, reject) => {
        const request = database.transaction('settings').objectStore('settings').get('store');
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    } finally { database.close(); }
  };
  const rememberFolder = async handle => {
    const database = await folderDatabase();
    try {
      await new Promise((resolve, reject) => {
        const transaction = database.transaction('settings', 'readwrite');
        transaction.objectStore('settings').put(handle, 'store');
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error);
      });
    } finally { database.close(); }
  };
  const ensureStoreFolder = async () => {
    if (typeof window.showDirectoryPicker !== 'function') {
      throw new Error('Этот браузер не поддерживает запись в выбранную папку.');
    }
    if (storeHandle && !['store', 'data', profileName].includes(storeHandle.name)) {
      storeHandle = null;
    }
    if (storeHandle) {
      if (await storeHandle.requestPermission({ mode: 'readwrite' }) === 'granted') {
        return storeHandle;
      }
      storeHandle = null;
      throw new Error('Доступ к выбранной папке не разрешён. Нажмите кнопку ещё раз.');
    }
    const handle = await window.showDirectoryPicker({ id: 'interviewpro-store', mode: 'readwrite' });
    if (!['store', 'data', profileName].includes(handle.name)) {
      throw new Error('Выберите папку store, data или папку профиля ' + profileName + '.');
    }
    storeHandle = handle;
    if (await handle.requestPermission({ mode: 'readwrite' }) !== 'granted') {
      storeHandle = null;
      throw new Error('Разрешите запись в выбранную папку.');
    }
    stateLoaded = false;
    writePreference(loadedStorageKey(), '0');
    try { await rememberFolder(handle); } catch (_) { /* select again after navigation */ }
    return handle;
  };
  const readJsonFile = async (directory, name) => {
    try {
      const file = await directory.getFileHandle(name);
      return JSON.parse(await (await file.getFile()).text());
    } catch (cause) {
      if (cause.name === 'NotFoundError') return null;
      throw cause;
    }
  };
  const writeJsonFile = async (directory, name, value) => {
    const file = await directory.getFileHandle(name, { create: true });
    const writer = await file.createWritable();
    try {
      await writer.write(JSON.stringify(value, null, 2) + '\n');
      await writer.close();
    } catch (cause) {
      await writer.abort().catch(() => {});
      throw cause;
    }
  };
  const profileFolder = async create => {
    try {
      if (storeHandle.name === profileName) return storeHandle;
      const data = storeHandle.name === 'data'
        ? storeHandle : await storeHandle.getDirectoryHandle('data', { create });
      return await data.getDirectoryHandle(profileName, { create });
    } catch (cause) {
      if (cause.name === 'NotFoundError') return null;
      throw cause;
    }
  };
  const readProfileState = async () => {
    const directory = await profileFolder(false);
    if (!directory) {
      const cause = new Error('У ' + profileName + ' пока нет сохранённых данных.');
      cause.code = 'no_data';
      throw cause;
    }
    const legacy = await readJsonFile(directory, stateFileName);
    if (legacy && (legacy.version !== 1 || legacy.profile !== profileName || !validStudyMarks(legacy.studied))) {
      throw new Error('Некорректный файл data/' + profileName + '/state.json.');
    }
    const marks = legacy ? { ...legacy.studied } : { ...studySnapshot() };
    let hasSavedState = Boolean(legacy);
    for (const topic of topicKeys) {
      const saved = await readJsonFile(directory, topicFileName(topic));
      if (!saved) continue;
      if (saved.version !== 1 || saved.profile !== profileName || saved.topic !== topic ||
          !Array.isArray(saved.questions)) {
        throw new Error('Некорректный файл ' + topicFileName(topic) + '.');
      }
      for (const question of saved.questions) {
        if (!question || !/^question-\d+$/.test(question.id) ||
            typeof question.text !== 'string' || !Array.isArray(question.clarifications)) {
          throw new Error('Некорректный файл ' + topicFileName(topic) + '.');
        }
        for (const item of [question, ...question.clarifications]) {
          if (!item || typeof item.id !== 'string' ||
              (item.studied !== null && typeof item.studied !== 'boolean')) {
            throw new Error('Некорректный файл ' + topicFileName(topic) + '.');
          }
          if (item.studied === true) marks[item.id] = true;
          if (item.studied === false) delete marks[item.id];
          if (item.studied !== null) hasSavedState = true;
        }
      }
    }
    if (!hasSavedState) {
      const cause = new Error('У ' + profileName + ' пока нет сохранённых данных.');
      cause.code = 'no_data';
      throw cause;
    }
    return { studied: marks };
  };
  const topicSnapshot = section => ({
    version: 1,
    profile: profileName,
    topic: section.dataset.studyTopic,
    savedAt: new Date().toISOString(),
    questions: [...section.querySelectorAll(':scope > .question-card')].map(card => {
      const title = card.querySelector(':scope > .answer-details > .main-question .question-text');
      return {
        id: card.id,
        text: title?.textContent.trim().replace(/^\d+\.\s*/, '') || '',
        studied: studied[card.id] === true,
        clarifications: [...card.querySelectorAll(':scope > .answer-details > .clarifications .clarification-item')]
          .map(item => ({
            id: item.id,
            text: item.querySelector(':scope > .answer-details > .clarification-question .question-text')
              ?.textContent.trim().replace(/^↳\s*/, '') || '',
            studied: studied[item.id] === true
          }))
      };
    })
  });
  const writeProfileState = async () => {
    const directory = await profileFolder(true);
    const sections = [...list.querySelectorAll('.question-section[data-study-topic]')];
    if (!sections.length) throw new Error('Темы на странице не найдены.');
    const visible = new Map(sections.map(section => [section.dataset.studyTopic, topicSnapshot(section)]));
    let written = 0;
    for (const topic of topicKeys) {
      const source = visible.get(topic) || await readJsonFile(directory, topicFileName(topic));
      if (!source) continue;
      const snapshot = {
        ...source,
        profile: profileName,
        savedAt: new Date().toISOString(),
        questions: source.questions.map(question => ({
          ...question,
          studied: studied[question.id] === true,
          clarifications: question.clarifications.map(item => ({
            ...item, studied: studied[item.id] === true
          }))
        }))
      };
      await writeJsonFile(directory, topicFileName(topic), snapshot);
      written++;
    }
    return written;
  };
  const loadProfileState = async () => {
    if (studyDirty) {
      showProfileStatus('Текущие отметки не сохранены. Загрузка остановлена, чтобы не потерять их.');
      return;
    }
    try {
      await ensureStoreFolder();
      const result = await readProfileState();
      studied = result.studied;
      saveStudyState();
      restoreStudyState();
      syncAllQuestionCheckboxes();
      updateRemainingCounts();
      stateLoaded = true;
      writePreference(loadedStorageKey(), '1');
      setStudyDirty(false);
      showProfileStatus('Состояние ' + profileName + ' загружено.');
    } catch (cause) {
      if (cause.name === 'SecurityError' && /Cross origin sub frames/i.test(cause.message)) {
        showProfileStatus('Встроенный предпросмотр запрещает выбор папки. Откройте страницу отдельно и повторите загрузку.', true);
        return;
      }
      showProfileStatus(cause.code === 'no_data'
        ? 'У ' + profileName + ' пока нет сохранённых данных. Текущие отметки остались в браузере.'
        : 'Не удалось загрузить: ' + cause.message);
    }
  };
  const saveCurrentProfile = async () => {
    showProfileStatus('Сохранение...');
    try {
      await ensureStoreFolder();
      if (!stateLoaded) {
        try {
          await readProfileState();
          showProfileStatus('У ' + profileName + ' уже есть данные. Запись остановлена, чтобы не перезаписать их.');
          return;
        } catch (cause) {
          if (cause.code !== 'no_data') throw cause;
        }
      }
      const written = await writeProfileState();
      stateLoaded = true;
      writePreference(loadedStorageKey(), '1');
      setStudyDirty(false);
      showProfileStatus('Сохранено файлов тем: ' + written + ' в data/' + profileName + '/.');
    } catch (cause) {
      if (cause.name === 'SecurityError' && /Cross origin sub frames/i.test(cause.message)) {
        showProfileStatus('Встроенный предпросмотр запрещает выбор папки. Откройте страницу отдельно и повторите сохранение.', true);
        return;
      }
      showProfileStatus(cause.name === 'AbortError'
        ? 'Сохранение отменено. Файл не записан.'
        : 'Не удалось сохранить: ' + cause.message);
    }
  };
  const initStudyFolder = async () => {
    try { storeHandle = await savedFolder(); }
    catch (_) { /* folder can still be chosen on save or load */ }
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
    setStudyDirty(true);
    updateRemainingCounts();
  });
  const section = (group, topic, summary) => {
    const key = group.id + '/' + topic.id;
    if (typeof content[key] !== 'string') {
      return '<p class="content-error">Не удалось загрузить раздел «' + topic.label + '».</p>';
    }
    const heading = summary ? 'h3' : 'h2';
    return '<section class="question-section" id="topic-' + group.id + '-' + topic.id +
      '" data-study-topic="' + key + '">' +
      '<' + heading + '>' + topic.label + ' <small>(' + topic.count + ')</small></' + heading + '>' +
      content[key] + '</section>';
  };
  // Learning order within each topic: fundamentals, common use, then edge cases and design.
  // Stable question IDs remain unchanged so study state and related links keep working.
  const questionOrder = {
    'golang/basics': [123, 148, 165, 147, 132, 163, 150, 128, 144, 153, 142, 127, 124],
    'golang/concurrency': [143, 146, 131, 161, 164, 151, 145, 133, 156, 155, 157, 158, 152, 129, 160, 135],
    'golang/runtime': [126, 140, 125, 149, 139, 154, 137, 141, 136],
    'golang/ecosystem': [],
    'golang/language': [184, 185, 191, 188, 189, 190, 193, 194, 195, 192, 187, 197, 199, 198, 201, 202, 200],
    'golang/collections_deep': [246, 245, 243, 247],
    'golang/types': [254, 253, 257, 258, 260],
    'golang/errors': [261, 264, 265, 266, 267, 268, 269],
    'golang/concurrency_patterns': [275, 273, 278, 274],
    'golang/synchronization': [281, 283, 285],
    'golang/runtime_deep': [292, 289, 290, 291, 293, 294, 296, 297],
    'golang/generics': [300, 304, 303],
    'golang/context_deep': [308],
    'golang/testing': [321, 325, 318, 322],
    'golang/backend': [330, 333, 335, 339],
    'golang/design': [342, 341, 345],
    'golang/runtime_internals': [],
    'golang/optimization': [360, 362, 353],
    'golang/build_security': [369, 370],
    'linux/processes': [25, 20, 5, 27],
    'linux/memory': [19, 18, 24],
    'linux/kernel': [22, 21],
    'network/transport': [30],
    'network/http': [48, 44],
    'network/kubernetes': [39, 38],
    'containers/docker': [52, 51, 57],
    'containers/delivery': [59, 50, 60],
    'kubernetes/architecture': [65, 63, 71],
    'kubernetes/operations': [79, 62, 72],
    'databases/sql': [102, 99, 112, 111, 90, 91],
    'databases/postgresql': [104, 93, 92, 113, 94],
    'databases/indexes': [95, 97, 108, 105, 107],
    'databases/distributed': [89],
    'databases/redis': [173, 176, 88, 174, 175, 177],
    'databases/querying': [391, 390],
    'databases/scaling': [398, 396, 397],
    'algorithms/graphs': [399],
    'architecture/services': [168],
    'architecture/security': [],
    'architecture/messaging': [387, 388, 381, 383, 384, 386, 385, 382],
    'architecture/distributed': [371, 373, 379, 372, 378, 377, 376, 375, 380],
    'architecture/service_patterns': [402, 403, 406, 407],
    'architecture/scenarios': [408, 412, 411],
    'reliability/sre': [2, 121],
    'reliability/observability': [169, 120, 171, 118],
    'reliability/resilience': [423, 419],
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
    24: [1, 3, 2, 4],
    25: [1, 2, 3, 4],
    27: [5, 1, 2, 4, 3],
    44: [1, 2, 4, 3],
    90: [7, 5, 6, 2, 1, 3, 4, 8],
    91: [1, 2, 4, 3],
    92: [3, 2, 1, 4],
    93: [1, 2, 4, 3],
    94: [1, 2, 3, 4],
    95: [1, 2, 3, 4],
    97: [4, 1, 2, 3, 5, 6],
    99: [1, 2, 3],
    104: [2, 1],
    105: [1, 2],
    107: [1, 2],
    108: [1, 2],
    111: [1, 2],
    112: [1, 2],
    113: [1, 2],
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
    168: [1, 2, 3],
    169: [1, 4, 2, 7, 5, 6, 3],
    173: [1, 3, 2],
    174: [2, 1],
    175: [1, 2],
    176: [1, 2, 3],
    177: [1, 2],
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
  const removedAllQuestionNumbers = new Set([27, 33, 36, 37, 43, 44, 47, 57, 67, 68, 72, 73, 75, 77, 78, 79, 80, 84, 85, 86, 88, 93, 97, 99, 100, 101, 102, 103, 105, 107, 108, 110, 111, 120, 121, 122, 123, 124, 125, 126, 127, 132, 133, 134, 135, 136, 137, 138, 139, 140, 144, 145, 147, 148, 149, 150, 151, 152, 153, 154, 157, 159, 160, 161, 163, 166, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 197, 198, 201, 202, 203, 204, 205, 206, 209, 211, 213, 214, 216, 217, 218, 219, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 234, 235, 236, 237, 238, 242, 245, 246, 247, 249, 252, 255, 256, 257, 258, 259, 261, 262, 263, 264, 265, 266, 270, 271, 272, 273, 276, 278, 282, 283, 284, 285, 289, 290, 291, 294, 295, 296, 299, 300, 302, 306, 307, 308, 310, 311, 312, 313, 319, 320, 323, 324, 325, 326, 327, 329, 333, 334, 336, 337, 338, 339, 357, 362, 363, 364, 365, 366, 368, 370, 371, 372, 374, 377, 382, 383, 385, 387, 388]);
  const numberCards = () => {
    let displayNumber = 1;
    list.querySelectorAll('.question-card').forEach(card => {
      if (allQuestions) {
        while (removedAllQuestionNumbers.has(displayNumber)) displayNumber++;
      }
      const number = card.querySelector('.main-question .question-text > strong');
      if (number) number.textContent = String(displayNumber) + '.';
      displayNumber++;
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
    "question-89": ["не дожидаясь реплики","RPO > 0","ждет записи на реплику","RPO = 0"],
    "question-390": ["реальные WHERE, ORDER BY и частоты запросов","левый префикс","равенства, диапазоны и сортировка","по всей нагрузке"],
    "question-390-followup-1": ["переиспользованием префикса и сортировкой","диапазон часто ограничивает полезность следующих столбцов"],
    "question-391": ["какую долю строк оставляет условие","последовательное чтение может быть дешевле","актуальности статистики"],
    "question-391-followup-1": ["обновляет статистику распределения значений","оценивает число строк и стоимость"],
    "question-88": ["команды выполняются последовательно","RDB:","AOF:","минимальную потерю данных"],
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
    "question-90": ["атомарную единицу","COMMIT фиксирует результат","ROLLBACK отменяет его","PostgreSQL трактует Read Uncommitted как Read Committed","тем вероятнее конфликты"],
    "question-90-followup-1": ["Один оператор может брать оба уровня","не означают блокировку строк","Обычный SELECT не ждёт построчную блокировку"],
    "question-90-followup-2": ["ACCESS SHARE совместим с ROW EXCLUSIVE","SHARE конфликтует с ROW EXCLUSIVE","Точную совместимость определяют режим и объект блокировки"],
    "question-90-followup-3": ["цикл ожиданий","отменяет одну транзакцию","единым порядком захвата ресурсов"],
    "question-90-followup-4": ["pg_locks с pg_stat_activity","pg_blocking_pids(pid)","снимок меняется"],
    "question-90-followup-5": ["Dirty read (грязное чтение)","Non-repeatable read (неповторяемое чтение)","Phantom read (фантом)","Serialization anomaly (аномалия сериализации)"],
    "question-90-followup-6": ["READ UNCOMMITTED по стандарту","READ COMMITTED (уровень PostgreSQL по умолчанию)","REPEATABLE READ: снимок закреплён","SERIALIZABLE: результат успешно завершённых транзакций"],
    "question-90-followup-7": ["READ COMMITTED","каждый оператор видит снимок данных"],
    "question-90-followup-8": ["транзакции короткими","SKIP LOCKED","не убирайте блокировки ценой потери корректности"],
    "question-90-followup-9": ["Режимы на одной таблице совместимы","ACCESS EXCLUSIVE","единственный режим, блокирующий обычный"],
    "question-90-followup-10": ["одной и той же строки","FOR KEY SHARE","FOR NO KEY UPDATE","FOR UPDATE","не запрашивает строковую блокировку"],
    "question-91": ["Грязное чтение","Неповторяемое чтение","Фантомное чтение","Аномалия сериализации","lost update","SERIALIZABLE отменяет опасную транзакцию"],
    "question-91-followup-1": ["Atomicity: все её изменения","Consistency: транзакция переводит данные","Isolation: результат параллельной работы","Durability: подтверждённый COMMIT"],
    "question-91-followup-2": ["COMMIT фиксирует изменения","ROLLBACK отменяет изменения","кроме внешних побочных эффектов"],
    "question-91-followup-3": ["точку внутри транзакции","откатывает изменения после неё","оставляя изменения в общей транзакции"],
    "question-91-followup-4": ["помечает её как прерванную","ROLLBACK TO SAVEPOINT"],
    "question-91-followup-5": ["сохраняются оба изменения","не сохраняется ни одно","отправленное письмо или внешний платёж"],
    "question-91-followup-6": ["сохранять инварианты данных","бизнес-правило, не выраженное ограничением","Допустимое состояние до транзакции"],
    "question-91-followup-7": ["выбранный уровень изоляции","соответствовал некоторому последовательному выполнению","Изоляция не означает физического выполнения"],
    "question-91-followup-8": ["После подтверждённого","журналу WAL","Граница гарантии зависит от настроек","не означает, что изменение уже попало"],
    "question-99": ["check_violation","UNKNOWN для NULL не нарушает ограничение","NOT NULL","Отключение триггеров не отключает CHECK"],
    "question-99-followup-1": ["частых или долгих записях","дороже обычного Mutex","проверяйте бенчмарком"],
    "question-99-followup-2": ["шарды с собственными блокировками","Сначала подтвердите проблему профилем"],
    "question-99-followup-3": ["стабильный хеш","свою map и mutex","в согласованном порядке"],
    "question-102": ["слева направо","ASC или DESC и порядок NULL","стабильный порядок"],
    "question-111": ["WHERE и RETURNING","нагрузку на WAL","пакетное удаление","Не следует автоматически запускать ручной VACUUM"],
    "question-111-followup-1": ["DELETE-триггеры","мёртвые версии до VACUUM","не запускает DELETE-триггеры","может быть откатан"],
    "question-111-followup-2": ["autovacuum сам очищает мёртвые версии","VACUUM FULL — тяжёлая перепись"],
    "question-112": ["фактически изменённых","без второго SELECT","результат пуст"],
    "question-112-followup-1": ["созданные ID, вычисленные значения","список реально изменённых строк","заменяет отдельный SELECT"],
    "question-112-followup-2": ["нет собственного JOIN","UPDATE ... FROM","DELETE ... USING"],
    "question-396": ["внутри одной логической БД","между независимыми узлами","маршрутизацию, ребалансировку, межшардовые запросы"],
    "question-396-followup-1": ["не позволяет отсечь партиции","дополнительные накладные расходы"],
    "question-397": ["распределять записи и запросы достаточно равномерно","кардинальность, перекос, рост","Горячий шард разгружают","контроля консистентности"],
    "question-397-followup-1": ["концентрируются на одной активной партиции или шарде"],
    "question-398": ["ресурсы одному узлу","добавляет экземпляры","по конкретному узкому месту"],
    "question-398-followup-1": ["предел уже находится в БД","увеличат давление на узкое место"],
    "question-92": ["8 табличных режимов","ACCESS SHARE","ROW SHARE","ROW EXCLUSIVE","SHARE UPDATE EXCLUSIVE","SHARE ROW EXCLUSIVE","ACCESS EXCLUSIVE","4 режима блокировки строк","FOR KEY SHARE","FOR NO KEY UPDATE","advisory locks","Предикатные","pg_blocking_pids()"],
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
    "question-104": ["обновляет статистику распределения значений","выбирает план запросов","после большого импорта","оценочные и фактические строки"],
    "question-104-followup-1": ["после массовой загрузки","autovacuum ещё не обновил статистику","сначала измерьте состояние"],
    "question-104-followup-2": ["неверно оценивает число строк и селективность","estimated и actual rows"],
    "question-113": ["VACUUM и ANALYZE","удаляет невидимые версии строк","предотвращает опасное старение идентификаторов","не отключают механизм"],
    "question-113-followup-1": ["конкурировать за I/O","Полное отключение обычно хуже"],
    "question-113-followup-2": ["dead tuples и задержку autovacuum","scale_factor, threshold и cost-параметры","не отключайте защиту от wraparound"],
    "question-95": ["без полного чтения таблицы","когда планировщик считает это выгодным","занимает место","не гарантирует ускорение любого запроса"],
    "question-95-followup-1": ["разбивает входные строки на группы одинаковых ключей","отдельно для каждой группы","NULL в ключе группировки образует одну группу"],
    "question-95-followup-2": ["всей комбинацией полей","Число групп может вырасти","несгруппированные столбцы"],
    "question-95-followup-3": ["до вычисления групп","используйте HAVING","подзапрос"],
    "question-95-followup-4": ["GROUP BY в CTE/подзапрос","во внешний WHERE","HAVING обычно яснее"],
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
    "question-107": ["разные блокировки","полное переписывание таблицы","поэтапную миграцию","ограничение времени ожидания блокировки"],
    "question-107-followup-1": ["ACCESS EXCLUSIVE","блокируют чтение и запись","lock_timeout"],
    "question-107-followup-2": ["без длительной блокировки обычных INSERT, UPDATE и DELETE","больше проходов и ожиданий","не запускается внутри обычного блока транзакции"],
    "question-108": ["позволяет вставкам, обновлениям и удалениям идти во время построения индекса","ждать долгие транзакции","нельзя запускать внутри обычного блока транзакции","недействительный индекс"],
    "question-108-followup-1": ["несколько проходов по таблице","ждёт завершения","допускает запись"],
    "question-108-followup-2": ["INVALID-индекс","pg_index.indisvalid","причину сбоя"],
    "question-243": ["сохранении порядка удаление сдвигает элементы","заменить последним"],
    "question-245": ["comparable","Нельзя: слайсы, map, функции","упадёт в рантайме"],
    "question-246": ["v, ok := m[k]","map[T]struct{}"],
    "question-247": ["ключ записывается один раз, а читается много","непересекающимися наборами ключей","map + RWMutex проще"],
    "question-273": ["Отправитель","больше никто не будет писать","не обязательно","сообщить получателям"],
    "question-274": ["Семафор на канале","worker pool","errgroup.SetLimit"],
    "question-275": ["sync.WaitGroup","wg.Go","errgroup.Group"],
    "question-278": ["Никак принудительно","горутина сама проверяет"],
    "question-369": ["crypto/rand","subtle.ConstantTimeCompare","плейсхолдеры","html/template","os.Root","таймаутов","govulncheck"],
    "question-370": ["GOTRACEBACK=all","kill -QUIT","/debug/pprof/goroutine?debug=2","fatal error","GODEBUG=gctrace"],
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
    "question-296": ["GOGC=100","реже GC, больше памяти","мягкий лимит памяти рантайма","риск death spiral"],
    "question-297": ["Меньше аллокаций","предвыделение","структуры без указателей","pprof -alloc_space"],
    "question-330": ["gracefulshutdown"],
    "question-333": ["HTTP/2, мультиплексирование","Protobuf","SSE/WebSocket отдельно",".proto + кодогенерация"],
    "question-335": ["Не закрыли rows","defer rows.Close()","rows.Err()","закрывается сам после Scan"],
    "question-339": ["в той же транзакции","отдельный процесс читает и публикует"],
    "question-281": ["низкоуровневый конфликт доступа к памяти","логическая ошибка из-за порядка событий","возможна и без data race"],
    "question-283": ["broadcast-пробуждения","Wait всегда в цикле"],
    "question-285": ["happens-before","гарантированно видна чтению","отправка в канал","Unlock","переупорядочивать операции"],
    "question-129": ["зависла навечно","Мусорщик (GC) не может удалить горутину","context.Context с таймаутами"],
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
    "question-341": ["маленькие пакеты","интерфейсы и композицию","маленькие интерфейсы","в пакете сервиса"],
    "question-342": ["ручная сборка в main","кодогенерация","рантайм"],
    "question-345": ["Counter","Gauge","Histogram","Summary","взрыв кардинальности"],
    "question-353": ["CPU-профиль из прода","инлайнит","девиртуализирует","проверяют бенчмарком"],
    "question-360": ["Горутины","Подслайс/подстрока","Map не сжимается","Кэши без лимита и TTL","Память C","pprof -inuse_space"],
    "question-362": ["stop-the-world","без STW","задержку планировщика"],
    "question-184": ["самостоятельный бинарный файл","Горутины позволяют обслуживать много независимых операций","задержки сборщика мусора, размер бинарника"],
    "question-184-followup-1": ["множество горутин на меньшем числе потоков ОС","не делает вычисления автоматически параллельными"],
    "question-185": ["zero value","нулевые значения рекурсивно","Mutex и bytes.Buffer пригодны к использованию сразу","запись в неё вызывает panic"],
    "question-185-followup-1": ["выделит базовый массив","Результат нужно присвоить"],
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
    "question-261": ["Error() string","обычные значения","последним результатом"],
    "question-264": ["что делали","%w","Не логировать и возвращать одновременно"],
    "question-265": ["выполняются defer","ошибок программиста","Для ожидаемых ошибок","error"],
    "question-266": ["непосредственно в отложенной функции","в той же горутине"],
    "question-267": ["в каждой долгоживущей горутине","горутины, запущенные из хендлера"],
    "question-268": ["fatal error","конкурентная запись в map","stack overflow","deadlock"],
    "question-269": ["*runtime.PanicNilError","возвращает не-nil"],
    "question-300": ["GC shape stenciling + словари","косвенный вызов","структур данных и алгоритмов"],
    "question-303": ["свои параметры типа","не участвуют в реализации интерфейсов"],
    "question-304": ["ссылаться на себя в своём списке параметров типа"],
    "question-253": ["если все поля comparable","ошибка компиляции","panic в рантайме"],
    "question-254": ["0 байт","map[K]struct{}","chan struct{}"],
    "question-257": ["Только для типов своего пакета","type MyTime time.Time","обёртка-структура"],
    "question-258": ["Алиас interface{}","теряется типобезопасность","дженерики"],
    "question-260": ["копируется в кучу","статических таблиц","go build -gcflags=-m"],
    "question-318": ["b.Loop()","-benchmem","benchstat"],
    "question-321": ["-coverprofile","GOCOVERDIR"],
    "question-322": ["где тратится процессорное время","сейчас в памяти","ожидание на каналах/мьютексах","не выставляйте наружу"],
    "question-325": ["go vet","staticcheck","govulncheck","go fix"],
    "question-5": ["/proc/<PID>/fd/","lsof -p <PID>"],
    "question-20": ["контролируемый переход","согласно ABI","проверяет аргументы","зависит от самой операции"],
    "question-20-followup-1": ["переход привилегий","копирование данных или ожидание устройства","зависит от операции"],
    "question-20-followup-2": ["номер вызова и аргументы в регистры","специальную инструкцию перехода","возвращает результат"],
    "question-20-followup-3": ["Нет универсального","блокируется ли поток","fsync","конкретную нагрузку"],
    "question-20-followup-4": ["готовность файловых дескрипторов"],
    "question-20-followup-5": ["разные PID","copy-on-write","PID ребёнка","0"],
    "question-20-followup-6": ["из пользовательского режима в режим ядра","возвращает управление"],
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
    "question-21": ["исключительный доступ","число одновременных участников","ждать изменения условия","активно ждёт","быстрый путь в пользовательском пространстве"],
    "question-21-followup-1": ["одному владельцу","счётчик разрешений","не обязательно привязана к владельцу"],
    "question-21-followup-2": ["очень коротком ожидании","не усыпляет поток","позволяет заснуть и не тратить CPU"],
    "question-21-followup-3": ["многократно проверяет условие","всё время расходует процессорное время"],
    "question-22": ["ограниченными привилегиями","привилегированные операции","системный вызов, исключение или прерывание","защищает систему"],
    "question-22-followup-1": ["системному вызову, прерыванию или исключению","переключает режим","восстанавливает пользовательский контекст"],
    "question-22-followup-2": ["сохранения и восстановления контекста","увеличивают задержку","объединяют в пакеты"],
    "question-22-followup-3": ["аппаратная проверка прав","через системный вызов"],
    "question-2": ["SLI (Indicator)","SLO (Objective)","SLA (Agreement)","Error Budget Burn Rate"],
    "question-121": ["Latency","Traffic","Errors","Saturation"],
    "question-419": ["идемпотентность","общим дедлайном","экспоненциальную задержку с jitter","умножает нагрузку"],
    "question-419-followup-1": ["синхронно повторит запрос","новый пик нагрузки"],
    "question-423": ["выводят из балансировки","ждут завершения текущих запросов","подтверждает только завершённые события","выдерживать повторы"],
    "question-423-followup-1": ["поймать сигнал","дождаться работы и закрыть ресурсы"],
    "question-118": ["сам опрашивает","централизованный контроль частоты","приложения шлют метрики сами","короткоживущих batch-джобов"],
    "question-120": ["числовые агрегаты во времени","текстовые записи событий","путь одного запроса","узких мест"],
    "question-169": ["метрики, логи и распределённые трассировки","Профилирование CPU и памяти","корреляционные идентификаторы","по симптомам для пользователя и SLO"],
    "question-169-followup-1": ["Rate","Errors","Duration","Utilization","Saturation","p95/p99"],
    "question-169-followup-2": ["собирает и показывает состояние","уведомляет ответственного","пользовательскому эффекту"],
    "question-169-followup-3": ["trace ID","span ID","путь и задержки вызовов","через все границы"],
    "question-169-followup-4": ["Prometheus собирает и хранит","Grafana строит панели","сначала определяют нужные показатели"],
    "question-169-followup-5": ["pprof","runtime/pprof","представительной нагрузке"],
    "question-169-followup-6": ["/debug/vars","диагностические переменные","доступ к нему нужно ограничивать"],
    "question-169-followup-7": ["kubectl logs","--previous","-f"],
    "question-171": ["trace ID","span ID","через заголовки или сообщения","задержки отдельных этапов"],
    "question-50": ["линтеры и тесты с детектором гонок","multi-stage сборка","GitOps Sync","Startup/Readiness пробы","SIGTERM"],
    "question-59": ["плавная замена старых подов","полная параллельная среда","малый процент трафика","Следят за ошибками"],
    "question-60": ["не модифицируются «на лету»","вносится в код","дрейф конфигураций","невоспроизводимой при аварии"],
    "question-51": ["Multi-stage сборка","scratch или distroless",".dockerignore"],
    "question-52": ["изолированный процесс","Namespaces","Cgroups","pivot_root","AppArmor / Seccomp"],
    "question-57": ["Инвалидация одного слоя","всех последующих","сначала копировать манифесты зависимостей","потом копировать исходный код"],
    "question-168": ["протокол запросов и ответов прикладного уровня","Запрос содержит метод, целевой URI и версию протокола","ответ содержит статус, заголовки и тело","коды 2xx/3xx/4xx/5xx"],
    "question-168-followup-1": ["GET для чтения","POST для обработки или создания","PUT для полной замены","PATCH для частичного изменения","Семантика безопасности и идемпотентности"],
    "question-168-followup-2": ["Content-Type описывает формат тела","Accept — ожидаемый формат ответа","Authorization — данные авторизации","Cache-Control — правила кеширования"],
    "question-168-followup-3": ["1xx (informational)","2xx (success)","3xx (redirect)","4xx (client error)","5xx (server error)"],
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
    "question-411": ["устойчивый ID и сохраняется в источнике истины","событие доставляется подписчикам","клиент дедуплицирует повторы","после переподключения догружает пропущенное","эфемерны"],
    "question-411-followup-1": ["порядок внутри диалога или канала","глобальный порядок для всех чатов не нужен"],
    "question-412": ["Метаданные файлов и иерархию хранят отдельно от содержимого","делят на чанки","Хеш содержимого помогает дедупликации","контрольные суммы проверяют целостность","права доступа проверяют по метаданным"],
    "question-412-followup-1": ["неподходящую нагрузку на транзакционную БД","объектное хранилище лучше для содержимого"],
    "question-371": ["идемпотентные","временные","Экспоненциальная задержка + jitter","Retry budget","одном","дедлайн"],
    "question-372": ["кратковременный","длительного","Open","Half-Open","Closed","fallback"],
    "question-373": ["Idempotency-Key","сохранённый ответ","TTL","дедупликация по ID сообщения","at-least-once доставка + идемпотентная обработка"],
    "question-375": ["SET key token NX PX 30000","блокировка истекла","fencing token","монотонно растущий номер","Redlock эту проблему не решает"],
    "question-376": ["hash(key) % N","кольцо","1/N","Виртуальные узлы","rendezvous hashing"],
    "question-377": ["Backpressure","Load shedding","Bulkhead","Adaptive concurrency limits"],
    "question-378": ["дубликат","первый ответ","p99","идемпотентных чтений"],
    "question-379": ["автоматически","grpc-timeout","исходный бюджет","вручную","остаток времени"],
    "question-380": ["Lease-объект","concurrency.NewElection","pg_try_advisory_lock","fencing","дважды"],
    "question-402": ["LRU удаляет запись, к которой дольше всего не обращались","Хеш-таблица находит элемент по ключу","двусвязный список переносит его в начало","блокировки, TTL, ограничения по байтам"],
    "question-402-followup-1": ["быстро находит ключ","не хранит порядок последнего использования"],
    "question-403": ["Token bucket допускает короткие всплески","Leaky bucket сглаживает выпуск","Fixed window прост, но допускает двойной всплеск","sliding window точнее","согласованную область действия"],
    "question-403-followup-1": ["HTTP 429","Retry-After","ключу, который нельзя легко подменить"],
    "question-406": ["пользовательскую задержку и ошибки","насыщением CPU, памяти, очередей, сетевых соединений и БД","Трейс показывает","времени начала, охвату, недавним изменениям"],
    "question-406-followup-1": ["p95/p99 показывают хвосты распределения","неизменном среднем"],
    "question-407": ["сохраняет основную функцию при отказе необязательной зависимости","какие данные допустимо показывать устаревшими","обозначить неполный результат","Для платежей и инвариантов"],
    "question-407-followup-1": ["долю запросов на запасном пути","возраст данных и длительность деградации"],
    "question-30": ["надежный, с установлением соединения","гарантирует порядок доставки","без установки соединения","без гарантии доставки и порядка"],
    "question-44": ["Прямой proxy принимает запрос от клиента","Reverse proxy расположен перед серверами приложения","завершать TLS, балансировать нагрузку и кешировать ответы"],
    "question-44-followup-1": ["от имени клиента","стоит перед сервером","к внутренним серверам"],
    "question-44-followup-2": ["завершать TLS","маршрутизировать и балансировать запросы","кешировать ответы","ограничивать трафик"],
    "question-44-followup-3": ["upstream-серверов","proxy_pass","health checks","X-Forwarded-* заголовки"],
    "question-44-followup-4": ["распределяет запросы между несколькими экземплярами","закрепляют клиента за экземпляром","состояние лучше хранить отдельно"],
    "question-48": ["текстовое представление сообщений","бинарные кадры","мультиплексирование потоков","HPACK","Семантика методов и кодов ответа сохраняется"],
    "question-38": ["линейный перебор цепочек правил","хэш-таблицы","eBPF","XDP"],
    "question-39": ["ndots:5","перебирает все search-домены","точку на конце имени","NodeLocal DNSCache"],
    "question-62": ["ресурсы с неудаляемыми Finalizers","Недоступен Custom Metrics API сервис или агрегированный API-сервер"],
    "question-72": ["Удаление пода из Endpoints происходит асинхронно","SIGTERM","preStop hook","закрывает соединения"],
    "question-79": ["metadata.finalizers","не удаляй объект из etcd","контроллер не выполнит очистку","контроллер упал или завис"],
    "question-63": ["Главный агент на каждой рабочей ноде","отслеживает спецификации Pod'ов","через CRI","через CSI","отправляет статус ноды"],
    "question-65": ["строго консистентное key-value хранилище","Raft","кроме kube-apiserver"],
    "question-71": ["консенсус Raft","кворум равен 2 ноды","кворум потерян","Новые поды и изменения применить невозможно"],
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
      actions.innerHTML = '<button type="button" class="hero-btn hero-btn-primary" data-study-export="xlsx">Скачать Excel: вопросы и уточнения</button>' +
        '<button type="button" class="hero-btn hero-btn-primary" data-study-export="json">Сохранить состояние текущих вопросов в JSON</button>' +
        '<p class="study-save-status" role="status" aria-live="polite"></p>';
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
    const hint = document.getElementById('study-number-hint');
    const copyButton = document.getElementById('copy-studied-numbers');
    const heading = document.querySelector('.questions-heading-row');
    if (!form || !input || !status || !hint || !copyButton || !heading) return;
    const dialog = document.createElement('dialog');
    dialog.className = 'study-number-dialog';
    dialog.setAttribute('aria-label', 'Отметить вопросы по номерам');
    const title = document.createElement('h2');
    title.textContent = 'Отметить по номерам';
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'study-number-close';
    closeButton.textContent = 'Закрыть';
    const loadButton = document.createElement('button');
    loadButton.type = 'button';
    loadButton.className = 'hero-btn hero-btn-primary study-number-load';
    loadButton.textContent = 'Загрузить состояние ' + profileName;
    loadButton.addEventListener('click', loadProfileState);
    dialog.append(title, form, hint, status, loadButton, closeButton);
    document.body.append(dialog);
    const openButton = document.createElement('button');
    openButton.type = 'button';
    openButton.className = 'hero-btn hero-btn-primary';
    openButton.textContent = 'Отметить по номерам';
    heading.append(openButton);
    openButton.addEventListener('click', () => dialog.showModal());
    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
    const checkboxes = new Map();
    list.querySelectorAll('.question-card').forEach(card => {
      const number = card.querySelector('.main-question .question-text > strong')?.textContent.replace(/\D/g, '');
      if (!number) return;
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
      const targetCheckboxes = new Set();
      const addTarget = (raw, checkbox) => {
        if (targetCheckboxes.has(checkbox)) return;
        targetCheckboxes.add(checkbox);
        targets.push({ raw, checkbox });
      };
      let marked = 0;
      for (const raw of tokens) {
        const number = raw.replace(/\.$/, '');
        const checkbox = /^\d+(?:\.\d+)?$/.test(number) ? checkboxes.get(number) : null;
        if (!checkbox) {
          missing.push(raw);
          continue;
        }
        const card = checkbox.closest('.question-card');
        if (!checkbox.closest('.clarification-item') && card) {
          clarificationCheckboxes(card).forEach((followup, followupIndex) => {
            addTarget(number + '.' + (followupIndex + 1), followup);
          });
        }
        addTarget(raw, checkbox);
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
        setStudyDirty(true);
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
  const xmlText = value => String(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  const worksheetXml = rows => '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>' +
    rows.map((row, rowIndex) => '<row r="' + (rowIndex + 1) + '">' +
      row.map((value, columnIndex) => '<c r="' + String.fromCharCode(65 + columnIndex) +
        (rowIndex + 1) + '" t="inlineStr"><is><t xml:space="preserve">' +
        xmlText(value) + '</t></is></c>').join('') + '</row>').join('') +
    '</sheetData></worksheet>';
  const crcTable = Array.from({ length: 256 }, (_, number) => {
    let crc = number;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xEDB88320 : 0);
    return crc >>> 0;
  });
  const zipWorkbook = files => {
    const encoder = new TextEncoder();
    const chunks = [];
    const directory = [];
    let offset = 0;
    const put = (view, position, value, size) => {
      if (size === 2) view.setUint16(position, value, true);
      else view.setUint32(position, value, true);
    };
    files.forEach(([name, contents]) => {
      const nameBytes = encoder.encode(name);
      const data = encoder.encode(contents);
      let crc = 0xFFFFFFFF;
      data.forEach(byte => { crc = (crc >>> 8) ^ crcTable[(crc ^ byte) & 0xFF]; });
      crc = (crc ^ 0xFFFFFFFF) >>> 0;
      const local = new Uint8Array(30 + nameBytes.length);
      const localView = new DataView(local.buffer);
      put(localView, 0, 0x04034B50, 4);
      put(localView, 4, 20, 2);
      put(localView, 6, 0x0800, 2);
      put(localView, 14, crc, 4);
      put(localView, 18, data.length, 4);
      put(localView, 22, data.length, 4);
      put(localView, 26, nameBytes.length, 2);
      local.set(nameBytes, 30);
      chunks.push(local, data);
      const central = new Uint8Array(46 + nameBytes.length);
      const centralView = new DataView(central.buffer);
      put(centralView, 0, 0x02014B50, 4);
      put(centralView, 4, 20, 2);
      put(centralView, 6, 20, 2);
      put(centralView, 8, 0x0800, 2);
      put(centralView, 16, crc, 4);
      put(centralView, 20, data.length, 4);
      put(centralView, 24, data.length, 4);
      put(centralView, 28, nameBytes.length, 2);
      put(centralView, 42, offset, 4);
      central.set(nameBytes, 46);
      directory.push(central);
      offset += local.length + data.length;
    });
    const directorySize = directory.reduce((size, entry) => size + entry.length, 0);
    const ending = new Uint8Array(22);
    const endingView = new DataView(ending.buffer);
    put(endingView, 0, 0x06054B50, 4);
    put(endingView, 8, files.length, 2);
    put(endingView, 10, files.length, 2);
    put(endingView, 12, directorySize, 4);
    put(endingView, 16, offset, 4);
    return new Blob([...chunks, ...directory, ending], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  };
  const workbookBlob = (questions, clarifications) => {
    const ns = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
    return zipWorkbook([
      ['[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8"?>' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
        '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
        '<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
        '</Types>'],
      ['_rels/.rels', '<?xml version="1.0" encoding="UTF-8"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="' + ns + '/officeDocument" Target="xl/workbook.xml"/>' +
        '</Relationships>'],
      ['xl/workbook.xml', '<?xml version="1.0" encoding="UTF-8"?>' +
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="' + ns + '">' +
        '<sheets><sheet name="Вопросы" sheetId="1" r:id="rId1"/>' +
        '<sheet name="Уточнения" sheetId="2" r:id="rId2"/></sheets></workbook>'],
      ['xl/_rels/workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="' + ns + '/worksheet" Target="worksheets/sheet1.xml"/>' +
        '<Relationship Id="rId2" Type="' + ns + '/worksheet" Target="worksheets/sheet2.xml"/>' +
        '</Relationships>'],
      ['xl/worksheets/sheet1.xml', worksheetXml([
        ['Вопрос', 'Статус'], ...questions.map(row =>
          [row[1], row[2] ? 'Ответили' : 'Не ответили'])
      ])],
      ['xl/worksheets/sheet2.xml', worksheetXml([
        ['Номер вопроса', 'Уточнение', 'Статус'], ...clarifications.map(row =>
          [row[0], row[1], row[2] ? 'Ответили' : 'Не ответили'])
      ])]
    ]);
  };
  const downloadWorkbook = (name, blob) => {
    const address = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = address;
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(address), 1000);
  };
  list.addEventListener('click', event => {
    const button = event.target.closest('[data-study-export]');
    if (!button) return;
    const section = button.closest('.question-section');
    const scope = section || list;
    const fileBase = section ? section.id.replace(/^topic-/, '') : 'all-questions';
    const { questions, clarifications } = collectStudyRows(scope);
    if (button.dataset.studyExport === 'xlsx') {
      downloadWorkbook(fileBase + '.xlsx', workbookBlob(questions, clarifications));
    } else if (button.dataset.studyExport === 'json') {
      saveCurrentProfile();
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
    initStudyFolder();
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
  initStudyFolder();
})();
