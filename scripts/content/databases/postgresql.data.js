window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["databases/postgresql"] = `<article class="question-card" id="question-92">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>92.</strong> Какие типы локов (блокировок) есть в PostgreSQL? Кто берет эти локи?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer"><p>PostgreSQL использует блокировки таблиц, строк, advisory locks и блокировки на уровне внутренней реализации. Обычные SELECT берут AccessShareLock на таблицу; INSERT, UPDATE и DELETE берут табличную RowExclusiveLock и блокируют изменяемые строки. DDL может требовать более строгих блокировок вплоть до AccessExclusiveLock. MVCC позволяет читателям не блокировать обычные записи, но конкурирующие изменения строк ждут друг друга; диагностировать ожидания можно через pg_stat_activity и pg_locks.</p></div>

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
