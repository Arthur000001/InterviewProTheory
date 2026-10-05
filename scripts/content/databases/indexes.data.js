window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["databases/indexes"] = `<article class="question-card" id="question-95">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>95.</strong> Что делает индекс и какую цену за него платит запись?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Индекс позволяет находить строки без полного чтения таблицы, когда планировщик считает это выгодным. PostgreSQL поддерживает разные методы, чаще используют B-tree. Индекс занимает место, обновляется при изменениях данных и сам по себе не гарантирует ускорение любого запроса.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(4)</small></h3>
<div class="clarification-item" id="question-95-followup-1" data-parent-question="question-95">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как работает агрегирование внутри групп?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">GROUP BY разбивает входные строки на группы одинаковых ключей, а агрегат вычисляет результат отдельно для каждой группы. NULL в ключе группировки образует одну группу с другими NULL этого ключа.</p></div>
</details>
</div>
<div class="clarification-item" id="question-95-followup-2" data-parent-question="question-95">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что будет при использовании нескольких полей в GROUP BY?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Группа определяется всей комбинацией полей, например (user_id, status), а не каждым полем по отдельности. Число групп может вырасти, и SELECT не может выводить несгруппированные столбцы без агрегирования или допустимой функциональной зависимости.</p></div>
</details>
</div>
<div class="clarification-item" id="question-95-followup-3" data-parent-question="question-95">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему нельзя фильтровать агрегаты через WHERE?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">WHERE применяется до вычисления групп и не знает значения SUM или COUNT для группы. Для фильтра по агрегату используйте HAVING либо вынесите агрегирование в подзапрос и фильтруйте внешний результат.</p></div>
</details>
</div>
<div class="clarification-item" id="question-95-followup-4" data-parent-question="question-95">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Когда HAVING можно заменить на подзапрос?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Когда нужно отдельно вычислить агрегаты и затем сложнее фильтровать или соединять их, поместите GROUP BY в CTE/подзапрос, а условие — во внешний WHERE. Для простого условия по группе HAVING обычно яснее.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-97">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>97.</strong> Чем EXPLAIN ANALYZE отличается от EXPLAIN?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>EXPLAIN показывает оценочный план без выполнения запроса, а EXPLAIN ANALYZE действительно выполняет его и добавляет фактические строки и время. Для UPDATE или DELETE это означает реальные изменения, если не обернуть исследование в транзакцию с ROLLBACK. Сравнение оценок с фактом помогает обнаружить устаревшую статистику.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(6)</small></h3>
<div class="clarification-item" id="question-97-followup-1" data-parent-question="question-97">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему OFFSET плохо масштабируется?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">OFFSET заставляет БД найти и пропустить предыдущие строки; чем дальше страница, тем больше лишней работы. Между запросами новые или удалённые строки могут также привести к пропускам и повторам.</p></div>
</details>
</div>
<div class="clarification-item" id="question-97-followup-2" data-parent-question="question-97">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое keyset pagination и чем она лучше?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Keyset pagination передаёт ключ последней показанной строки и запрашивает следующую порцию через WHERE key &gt; last_key с тем же ORDER BY. При подходящем индексе глубина страницы почти не влияет на цену, а стабильный уникальный порядок снижает дубли.</p></div>
</details>
</div>
<div class="clarification-item" id="question-97-followup-3" data-parent-question="question-97">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как реализовать бесконечную прокрутку без OFFSET?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Сортируйте по устойчивой паре, например (created_at, id), и для следующей порции передавайте её последнее значение: WHERE (created_at, id) &lt; (:last_time, :last_id) ORDER BY created_at DESC, id DESC LIMIT :n. Нужен индекс в том же порядке.</p></div>
</details>
</div>
<div class="clarification-item" id="question-97-followup-4" data-parent-question="question-97">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему LIMIT без ORDER BY может давать непредсказуемые результаты?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Без ORDER BY SQL не гарантирует порядок строк; план и параллелизм могут изменить, какие записи окажутся в первых LIMIT строках. Для воспроизводимого результата задайте полный порядок с уникальным завершающим ключом.</p></div>
</details>
</div>
<div class="clarification-item" id="question-97-followup-5" data-parent-question="question-97">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как читать cost в плане выполнения?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Cost — относительная оценка планировщика для startup и полной обработки узла, а не миллисекунды. Сравнивайте планы и оценочные строки; реальность проверяйте EXPLAIN ANALYZE и BUFFERS.</p></div>
</details>
</div>
<div class="clarification-item" id="question-97-followup-6" data-parent-question="question-97">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему фактическое время может отличаться от оценочного?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Оценка строится на статистике и модели стоимости, а фактическое время зависит от кеша, диска, конкуренции и распределения данных. Большой разрыв между estimated rows и actual rows часто указывает на устаревшую или недостаточную статистику.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-105">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>105.</strong> Когда применяют REINDEX?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>REINDEX перестраивает индекс, например при повреждении или подтверждённом раздутии. Операция может требовать блокировок и дополнительного места; доступность режима CONCURRENTLY зависит от объекта и версии PostgreSQL. Сначала проверяют диагноз, а не перестраивают все индексы по расписанию без причины.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(2)</small></h3>
<div class="clarification-item" id="question-105-followup-1" data-parent-question="question-105">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как понять, что индекс фрагментирован (bloat)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Сравните размер индекса с числом живых строк и оцените свободное место через подходящие диагностические расширения, например pgstattuple. Рост файла сам по себе не доказывает bloat.</p></div>
</details>
</div>
<div class="clarification-item" id="question-105-followup-2" data-parent-question="question-105">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Чем REINDEX отличается от DROP/CREATE INDEX?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">REINDEX перестраивает индекс по тому же определению и удобен для устранения bloat или повреждения. DROP/CREATE требует сохранить определение и может оставить период без нужного индекса или ограничения.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-107">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>107.</strong> Какие риски у ALTER TABLE на большой таблице?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Разные формы ALTER TABLE берут разные блокировки и могут выполнять полное переписывание таблицы. Перед миграцией проверяют конкретную форму команды, версию PostgreSQL, длительные транзакции и свободное место. Для дорогих изменений применяют поэтапную миграцию и ограничение времени ожидания блокировки.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(2)</small></h3>
<div class="clarification-item" id="question-107-followup-1" data-parent-question="question-107">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Какие операции ALTER TABLE блокируют запись?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Многие формы ALTER TABLE требуют ACCESS EXCLUSIVE и временно блокируют чтение и запись; длительность зависит от переписывания таблицы. Даже быстрая команда может ждать чужую транзакцию — проверяйте форму и задавайте lock_timeout.</p></div>
</details>
</div>
<div class="clarification-item" id="question-107-followup-2" data-parent-question="question-107">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что делает опция CONCURRENTLY?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">CREATE INDEX CONCURRENTLY строит индекс без длительной блокировки обычных INSERT, UPDATE и DELETE. Он делает больше проходов и ожиданий и не запускается внутри обычного блока транзакции.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-108">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>108.</strong> Чем CREATE INDEX CONCURRENTLY отличается от обычного создания?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>CONCURRENTLY позволяет вставкам, обновлениям и удалениям идти во время построения индекса, но выполняет больше проходов и может ждать долгие транзакции. Команду нельзя запускать внутри обычного блока транзакции. После сбоя может остаться недействительный индекс, который надо диагностировать отдельно.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(2)</small></h3>
<div class="clarification-item" id="question-108-followup-1" data-parent-question="question-108">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему она медленнее обычного создания индекса?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Конкурентное создание выполняет несколько проходов по таблице и ждёт завершения затрагивающих транзакций и старых снимков. Поэтому оно обычно дольше обычного CREATE INDEX, зато допускает запись.</p></div>
</details>
</div>
<div class="clarification-item" id="question-108-followup-2" data-parent-question="question-108">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что произойдёт при сбое во время выполнения?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">При сбое CREATE INDEX CONCURRENTLY может оставить INVALID-индекс: планировщик не использует его, но он занимает место и может создавать накладные расходы. Проверьте pg_index.indisvalid и причину сбоя, затем удалите или пересоздайте индекс.</p></div>
</details>
</div>
</div>
</article>
`;

window.InterviewProContent["databases/indexes"] += window.InterviewProBuildCards("databases/indexes", [
  {
    "id": 427,
    "title": "Что такое частичный индекс в PostgreSQL и чем он отличается от префиксного индекса MySQL?",
    "answer": "**Частичный индекс** хранит записи только для строк, удовлетворяющих предикату. Он полезен, когда запросы часто обращаются к небольшой части таблицы, например к активным заказам.\n\n```sql\n-- PostgreSQL\nCREATE INDEX idx_open_orders ON orders (created_at)\nWHERE status = 'open';\n\nSELECT * FROM orders\nWHERE status = 'open'\nORDER BY created_at;\n```\n\nПланировщик должен доказать, что условие запроса подразумевает предикат индекса. Параметризованный или иначе записанный фильтр не всегда позволяет это сделать. Индекс занимает меньше места, но изменения подходящих строк и переходы через границу предиката всё равно требуют его обслуживания.\n\nВ **MySQL 8.4** нет прямого CREATE INDEX ... WHERE. Префиксный индекс `CREATE INDEX idx_name ON users (name(20));` индексирует начало значения строки, а не подмножество строк. Индексируемый generated column может помочь для отдельного запроса, но не является полным аналогом частичного индекса.",
    "markdown": true
  }
]);

window.InterviewProContent["databases/indexes"] += window.InterviewProBuildCards("databases/indexes", [
  {
    "id": 491,
    "title": "Как устроен B-tree индекс и какие операции он ускоряет? Для каких запросов вместо него подходят GIN, GiST или BRIN?",
    "answer": "**Ответ:** B-tree — сбалансированная структура упорядоченных ключей: подходит равенству, диапазонам и сортировке при подходящем порядке индекса. GIN индексирует компоненты составных значений, например элементы массивов или лексемы. GiST — расширяемая структура для пространственных и других специализированных операторов. BRIN хранит сводки диапазонов страниц и полезен на больших таблицах с корреляцией значений и физического порядка.\n\nТип выбирают по операторам и нагрузке: специализированный индекс не является универсально более быстрым. [Типы индексов](https://www.postgresql.org/docs/current/indexes-types.html).",
    "markdown": true
  },
  {
    "id": 492,
    "title": "Чем Index Scan, Bitmap Heap Scan и Index Only Scan отличаются по работе с таблицей? Как INCLUDE и visibility map влияют на возможность избежать чтения heap?",
    "answer": "**Ответ:** Index Scan находит указатели в индексе и обращается к строкам heap. Bitmap Heap Scan сначала собирает bitmap подходящих адресов, затем читает страницы таблицы более сгруппированно. Index Only Scan может взять все необходимые значения из индекса.\n\n`INCLUDE` добавляет полезные столбцы без включения их в ключ поиска. Но для проверки MVCC-видимости чтение heap всё ещё нужно, если visibility map не отмечает страницу как all-visible. Поэтому название Index Only Scan не гарантирует нулевое число heap fetches. [Index-only scans](https://www.postgresql.org/docs/current/indexes-index-only-scans.html).",
    "markdown": true
  },
  {
    "id": 493,
    "title": "Когда нужен индекс по выражению? Почему условие с функцией или приведением типа может не использовать ожидаемый индекс?",
    "answer": "**Ответ:** Индекс по выражению хранит результат вычисления, например `CREATE INDEX ON users (lower(email))`, и подходит запросам с согласованным выражением. PostgreSQL требует immutable-функции в индексируемом выражении.\n\nОбычный индекс по `email` не обязательно поможет условию `lower(email) = ...`; аналогично приведение типа может изменить применимый оператор. Иногда лучше преобразовать параметр, а не столбец. Совпадение выражения ещё не заставляет планировщик выбрать индекс: учитываются селективность, статистика и цена доступа.",
    "markdown": true
  }
]);
