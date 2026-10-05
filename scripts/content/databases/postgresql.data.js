window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["databases/postgresql"] = `<article class="question-card" id="question-92">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>92.</strong> Какие типы локов (блокировок) есть в PostgreSQL? Кто берет эти локи?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer">
            <p>PostgreSQL различает <strong>режимы блокировки таблицы</strong> и <strong>режимы блокировки конкретной строки</strong>. Один запрос может брать оба уровня. Слова <code>ROW SHARE</code> и <code>ROW EXCLUSIVE</code> обозначают именно табличные режимы, а не блокировку строки. Блокировка мешает только несовместимому режиму на том же объекте; обычный <code>SELECT</code> благодаря MVCC обычно читает данные параллельно с изменением строк.</p>
            <p><strong>Все 8 табличных режимов — зачем нужны и кто их берёт:</strong></p>
            <ul>
              <li><code>ACCESS SHARE</code> — защищает таблицу от удаления или перестройки во время чтения; его берёт обычный <code>SELECT</code>. Ему мешает только <code>ACCESS EXCLUSIVE</code>.</li>
              <li><code>ROW SHARE</code> — отмечает, что запрос собирается блокировать выбранные строки; его берёт <code>SELECT ... FOR UPDATE/NO KEY UPDATE/SHARE/KEY SHARE</code>. Не запрещает обычные чтения и изменения других строк.</li>
              <li><code>ROW EXCLUSIVE</code> — защищает таблицу на время изменения данных; его берут <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>, <code>MERGE</code>. Несколько изменяющих транзакций могут держать его одновременно, если не конфликтуют на строках.</li>
              <li><code>SHARE UPDATE EXCLUSIVE</code> — позволяет обслуживать таблицу без остановки обычного чтения и записи, но исключает конкурирующее обслуживание и ряд изменений схемы; его берут обычные <code>VACUUM</code>, <code>ANALYZE</code>, <code>CREATE INDEX CONCURRENTLY</code>.</li>
              <li><code>SHARE</code> — защищает таблицу от изменения данных во время операции, которой нужна стабильная таблица; пример — <code>CREATE INDEX</code> без <code>CONCURRENTLY</code>. Обычные читатели продолжают работу, писатели ждут.</li>
              <li><code>SHARE ROW EXCLUSIVE</code> — запрещает конкурентное изменение данных и одновременное выполнение такой же операции; его берут <code>CREATE TRIGGER</code> и некоторые формы <code>ALTER TABLE</code>.</li>
              <li><code>EXCLUSIVE</code> — оставляет доступ только обычным читателям с <code>ACCESS SHARE</code>; пример — <code>REFRESH MATERIALIZED VIEW CONCURRENTLY</code>.</li>
              <li><code>ACCESS EXCLUSIVE</code> — даёт исключительный доступ к таблице, блокируя даже обычный <code>SELECT</code>; его берут <code>TRUNCATE</code>, <code>DROP TABLE</code>, <code>VACUUM FULL</code> и многие формы <code>ALTER TABLE</code>.</li>
            </ul>
            <p><strong>Все 4 режима блокировки строк — что защищают:</strong></p>
            <ul>
              <li><code>FOR KEY SHARE</code> — не даёт удалить строку или изменить её ключ, на который может ссылаться внешний ключ; допускает изменение неключевых полей. Используется, в частности, при проверке ссылочной целостности.</li>
              <li><code>FOR SHARE</code> — даёт нескольким транзакциям совместно защитить строку от изменения или удаления. <code>SELECT ... FOR SHARE</code> блокирует конкурирующие <code>UPDATE</code> и <code>DELETE</code> этой строки.</li>
              <li><code>FOR NO KEY UPDATE</code> — исключает конкурирующее изменение той же строки, но допускает <code>FOR KEY SHARE</code>, поскольку ключ не меняется. Обычно его берёт <code>UPDATE</code> неключевых полей.</li>
              <li><code>FOR UPDATE</code> — самый строгий строковый режим: исключает другие захваты и изменения этой строки. Его берут <code>DELETE</code>, изменение ключевых столбцов через <code>UPDATE</code> и явный <code>SELECT ... FOR UPDATE</code>.</li>
            </ul>
            <p><strong>Другие семейства:</strong> <code>advisory locks</code> приложение берёт по условному ключу для собственного правила взаимного исключения; БД сама не связывает их со строками, а время жизни может быть до конца транзакции или сессии. Краткие блокировки страниц защищают внутренний доступ к страницам памяти и обычно не управляются приложением. Предикатные <code>SIReadLock</code> на уровне <code>SERIALIZABLE</code> отслеживают опасные сочетания чтения и записи для обнаружения аномалий сериализации; сами по себе они не блокируют запросы. Для анализа ожиданий смотрят <code>pg_locks</code>, <code>pg_stat_activity</code> и <code>pg_blocking_pids()</code>.</p>
          </div>

  <div style="margin: 12px 0; padding: 12px 16px; background: rgba(245, 158, 11, 0.08); border-left: 4px solid #f59e0b; border-radius: 6px;">
    <strong style="color: #f59e0b; display: block; margin-bottom: 8px; font-size: 0.95rem;">🟡 Базовый уровень:</strong>
    <div style="color: var(--text-secondary); line-height: 1.65;"><p style="margin: 6px 0; color: var(--text-secondary); line-height: 1.65;">Лок на таблицу, лок на запись, пользовательские (рекомендательные) локи.<br>Далее важно, чтобы человек порассуждал на тему что это за локи, как они конфликтуют<br>между собой.<br>Локи на таблицу могут брать стандартные команды SQL (Update, Delete, Select, Alter<br>table...) Например:SELECT берет лок на таблицу типа ACCESS SHARE, который конфликтует,<br>например, с самым строгим ACCESS EXCLUSIVE.<br>Локи на строчки в таблице берут стандартные команды SQL, которые меняют данные у<br>каких-либо записей. Например, есть тип блокировки FOR UPDATE, который конфликтует<br>сам с собой. Эти же типы локов можно указывать у оператора SELECT. Пример: Select *<br>from t1 for update nowait (skip locked).<br>Пользовательские локи можно брать, например, когда нужен общий ресурс для<br>нескольких приложений и нет возможности шарить его в другой инфре.</p></div>
  </div>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(4)</small></h3>
<div class="clarification-item" id="question-92-followup-1" data-parent-question="question-92">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Чем отличается HAVING от WHERE?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">WHERE фильтрует строки до группировки; HAVING фильтрует уже сформированные группы и может использовать агрегаты. Условие по обычному полю обычно лучше помещать в WHERE, чтобы обрабатывать меньше строк.</p></div>
</details>
</div>
<div class="clarification-item" id="question-92-followup-2" data-parent-question="question-92">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что произойдёт, если убрать GROUP BY?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Если SELECT содержит агрегат и обычные столбцы, последние должны быть сгруппированы или функционально зависеть от группировки — иначе PostgreSQL выдаст ошибку. Если в выборке только агрегаты, без GROUP BY весь набор строк считается одной группой.</p></div>
</details>
</div>
<div class="clarification-item" id="question-92-followup-3" data-parent-question="question-92">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Можно ли использовать агрегатные функции без HAVING?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Да. SUM, COUNT и другие агрегаты можно использовать в SELECT и ORDER BY без HAVING; HAVING нужен только для фильтрации групп по условию.</p></div>
</details>
</div>
<div class="clarification-item" id="question-92-followup-4" data-parent-question="question-92">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как оптимизировать такой запрос индексами?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Индексируйте столбцы, по которым запрос сначала отбирает строки и соединяет таблицы; для группировки иногда полезен порядок индекса. Проверяйте EXPLAIN (ANALYZE, BUFFERS): индекс не обязан быть выгоден, если запрос читает большую часть таблицы.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-93">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>93.</strong> Что такое MVCC в PostgreSQL?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>MVCC хранит версии строк, чтобы чтения и записи меньше блокировали друг друга. Видимость версии зависит от снимка транзакции и уровня изоляции: при Read Committed снимок обычно берётся для каждого оператора, а при Repeatable Read сохраняется дольше. Старые версии затем очищает VACUUM.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(4)</small></h3>
<div class="clarification-item" id="question-93-followup-1" data-parent-question="question-93">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Чем отличаются UNIQUE, CHECK, FOREIGN KEY?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">UNIQUE запрещает дубли соответствующего ключа, CHECK проверяет логическое условие строки, FOREIGN KEY требует существования связанной записи. У каждого ограничения свои правила обработки NULL и момента проверки.</p></div>
</details>
</div>
<div class="clarification-item" id="question-93-followup-2" data-parent-question="question-93">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как работает CASCADE при удалении?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">ON DELETE CASCADE у внешнего ключа автоматически удаляет дочерние строки при удалении родителя. Это удобно для зависимых записей, но опасно, если дочерние данные нужно хранить отдельно или аудитировать.</p></div>
</details>
</div>
<div class="clarification-item" id="question-93-followup-3" data-parent-question="question-93">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что делает DEFERRABLE INITIALLY DEFERRED?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">DEFERRABLE INITIALLY DEFERRED откладывает проверку ограничения до конца транзакции по умолчанию. Это позволяет временно нарушить его внутри транзакции, если к COMMIT данные снова корректны.</p></div>
</details>
</div>
<div class="clarification-item" id="question-93-followup-4" data-parent-question="question-93">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как проверить, нарушено ли ограничение?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Попытка вставки или обновления, нарушающая ограничение, вернёт ошибку с SQLSTATE и именем ограничения; у отложенного ограничения ошибка может появиться на COMMIT. Для проверки существующих данных используйте диагностический SELECT и системные каталоги, а не пробуйте опасную запись на проде.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-94">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>94.</strong> Зачем PostgreSQL нужен VACUUM и чем отличается VACUUM FULL?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Обычный VACUUM освобождает место от уже невидимых версий строк для повторного использования и помогает предотвращать переполнение счётчиков транзакций. VACUUM FULL переписывает таблицу и может вернуть место файловой системе, но требует более сильной блокировки и дополнительного места на время работы.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(4)</small></h3>
<div class="clarification-item" id="question-94-followup-1" data-parent-question="question-94">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Чем отличается INNER JOIN от LEFT JOIN?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">INNER JOIN выдаёт только совпавшие пары строк. LEFT JOIN сохраняет каждую строку левой таблицы даже без пары справа, подставляя NULL в правые поля.</p></div>
</details>
</div>
<div class="clarification-item" id="question-94-followup-2" data-parent-question="question-94">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как реализовать фильтрацию после объединения?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Если условие должно ограничить пары при LEFT JOIN, поместите его в ON; если нужно отфильтровать уже полученные строки, используйте WHERE. Условие по правой таблице в WHERE может убрать NULL-расширенные строки и превратить результат в аналог INNER JOIN.</p></div>
</details>
</div>
<div class="clarification-item" id="question-94-followup-3" data-parent-question="question-94">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что происходит при объединении по NULL-значениям?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Обычное равенство NULL = NULL даёт UNKNOWN, поэтому такие ключи не соединяются через =. Если нужно считать NULL совпадающими, используйте IS NOT DISTINCT FROM с осознанием семантики результата.</p></div>
</details>
</div>
<div class="clarification-item" id="question-94-followup-4" data-parent-question="question-94">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как улучшить производительность JOIN’ов?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Проверьте типы и кардинальность ключей, фильтры до соединения и подходящие индексы; затем смотрите EXPLAIN (ANALYZE, BUFFERS). Избыточные JOIN, неактуальная статистика и многократное размножение строк часто важнее выбора конкретного метода соединения.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-104">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>104.</strong> Зачем выполнять ANALYZE после крупного изменения данных?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>ANALYZE обновляет статистику распределения значений, по которой планировщик выбирает план запросов. Автоматический анализ запускается по порогам изменений, но после большого импорта статистику иногда обновляют вручную. Проверяют оценочные и фактические строки в EXPLAIN ANALYZE.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(2)</small></h3>
<div class="clarification-item" id="question-104-followup-1" data-parent-question="question-104">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Когда стоит запускать вручную?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">ANALYZE запускают после массовой загрузки или изменения распределения данных, когда autovacuum ещё не обновил статистику. VACUUM вручную нужен, если автоочистка отстаёт; сначала измерьте состояние.</p></div>
</details>
</div>
<div class="clarification-item" id="question-104-followup-2" data-parent-question="question-104">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как влияет устаревшая статистика на планировщик?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Планировщик неверно оценивает число строк и селективность условий, поэтому выбирает неподходящий JOIN, сканирование или сортировку. Сравните estimated и actual rows в EXPLAIN ANALYZE и обновите статистику.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-113">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>113.</strong> Что делает autovacuum?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Autovacuum автоматически запускает VACUUM и ANALYZE по порогам активности таблиц. Он удаляет невидимые версии строк, обновляет статистику и предотвращает опасное старение идентификаторов транзакций. При высокой записи проверяют отставание и настраивают пороги и ресурсы, а не отключают механизм.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(2)</small></h3>
<div class="clarification-item" id="question-113-followup-1" data-parent-question="question-113">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Когда autovacuum может вызвать нагрузку?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Autovacuum читает и записывает много страниц при очистке больших таблиц и может конкурировать за I/O с запросами, особенно если накопилось много мёртвых строк. Полное отключение обычно хуже из-за bloat и wraparound.</p></div>
</details>
</div>
<div class="clarification-item" id="question-113-followup-2" data-parent-question="question-113">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как его тюнить под интенсивную запись?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Измерьте dead tuples и задержку autovacuum, затем настройте scale_factor, threshold и cost-параметры для конкретной таблицы, чтобы очистка начиналась раньше. Сопоставляйте параметры с нагрузкой и не отключайте защиту от wraparound.</p></div>
</details>
</div>
</div>
</article>
`;

window.InterviewProContent["databases/postgresql"] += window.InterviewProBuildCards("databases/postgresql", [
  {
    "id": 494,
    "title": "Как применять pg_stat_activity, pg_stat_statements и сведения об ожиданиях, чтобы отличить медленный запрос от ожидания блокировки или перегрузки БД?",
    "answer": "**Ответ:** `pg_stat_activity` показывает текущие сессии, запросы, состояние и `wait_event_type`/`wait_event`; `pg_blocking_pids(pid)` помогает найти блокирующую сессию. `pg_stat_statements`, если расширение настроено, агрегирует статистику запросов: вызовы, суммарное и среднее время, обработанные строки и I/O.\n\nСначала определяют: запрос выполняется, ждёт lock, I/O или простаивает в транзакции. Затем сопоставляют с CPU, диском, числом соединений и планом. Высокое время запроса не доказывает нехватку CPU, а `EXPLAIN ANALYZE` действительно выполняет запрос.",
    "markdown": true
  },
  {
    "id": 495,
    "title": "Что такое WAL, checkpoint и crash recovery? Чем журнал предзаписи отличается от резервной копии?",
    "answer": "**Ответ:** WAL фиксирует изменения до записи соответствующих страниц данных на устойчивый носитель. Это позволяет после сбоя восстановить согласованное состояние через воспроизведение необходимых записей. Checkpoint сохраняет необходимые грязные страницы и контрольную точку, сокращая объём последующего recovery.\n\nWAL сам по себе не заменяет backup: для восстановления нужен исходный набор данных и достаточная непрерывная история журнала. Успешный COMMIT и гарантии сохранности зависят также от настроек durability и надёжности хранилища.",
    "markdown": true
  },
  {
    "id": 496,
    "title": "Чем логический backup отличается от физического и как работает point-in-time recovery? Как проверить восстановление после случайного удаления данных?",
    "answer": "**Ответ:** Логический backup содержит определения объектов и данные для восстановления через SQL/формат dump. Физический сохраняет файлы кластера и используется совместно с WAL. Для PITR восстанавливают подходящую базовую копию и проигрывают непрерывный архив WAL до выбранного момента или позиции.\n\nПосле случайного DELETE восстанавливают отдельное окружение до ошибки, проверяют данные и выбирают способ возврата с учётом более поздних корректных записей. Регулярная учебная реставрация проверяет не только наличие файлов, но и достижимые RPO/RTO. [PITR](https://www.postgresql.org/docs/current/continuous-archiving.html).",
    "markdown": true
  },
  {
    "id": 498,
    "title": "Для чего нужен PgBouncer? Чем session pooling отличается от transaction pooling и какие ограничения это накладывает на состояние сессии приложения?",
    "answer": "**Ответ:** PgBouncer уменьшает число серверных соединений, обслуживая много клиентских. Session pooling закрепляет соединение до отключения клиента; transaction pooling выдаёт его на транзакцию и затем возвращает в пул.\n\nПри transaction pooling нельзя рассчитывать на обычный session-level SET, временные объекты между транзакциями, LISTEN или session advisory locks. Используют транзакционно-локальные настройки и проверяют возможности конкретной версии. Поддержка protocol-level prepared statements зависит от конфигурации `max_prepared_statements`; SQL-команда PREPARE — отдельный случай. [Совместимость PgBouncer](https://www.pgbouncer.org/features.html).",
    "markdown": true
  }
]);
