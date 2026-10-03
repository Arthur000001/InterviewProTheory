window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["databases/postgresql"] = `<article class="question-card" id="question-82">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>82.</strong> Как организовать High Availability (HA) для PostgreSQL в Kubernetes? (Patroni, DCS/etcd, streaming replication, VIP/PgBouncer)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Архитектура Patroni:</strong></p>
<ol>
  <li>На каждом поде крутится агент Patroni и PostgreSQL.</li>
  <li>Лидер держит распределенный замок (lease) в <strong>etcd (DCS)</strong>.</li>
  <li>Реплики получают WAL-поток через потоковую репликацию (Streaming Replication).</li>
  <li>При падении лидера замок истекает, оставшиеся реплики через etcd выбирают наиболее актуальную ноду и делают промоут (Failover).</li>
  <li>Трафик маршрутизируется через PgBouncer или сервис-селектор Patroni.</li>
</ol>
        </div>
</details>

</article>
<article class="question-card" id="question-83">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>83.</strong> Что такое Write-Ahead Log (WAL) и checkpoints в реляционных СУБД, и зачем они нужны для надежности данных?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong></p>
<ul>
  <li><strong>WAL (журнал упреждающей записи):</strong> перед записью данных на диск в тяжелые таблицы транзакция сначала последовательно пишется в журнал WAL (быстрая операция). Это гарантирует свойство Durability (ACID).</li>
  <li><strong>Checkpoint:</strong> периодический сброс грязных страниц из буферного пула RAM на постоянный диск. Позволяет усекать старые сегменты WAL и ускоряет восстановление при краше.</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-86">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>86.</strong> СУБД PostgreSQL внезапно встала в Read-Only. Какие возможные инфраструктурные причины (заполнение диска WAL, XID wraparound, потеря лидера Patroni)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Причины:</strong></p>
<ol>
  <li><strong>100% диска:</strong> кончилось место в <code>pg_wal</code> (отвалилась репликация, копится WAL). СУБД блокирует запись для спасения целостности.</li>
  <li><strong>XID Wraparound:</strong> счетчик транзакций приблизился к 2 млрд без отработавшего вакуума. Postgres принудительно уходит в Read-Only.</li>
  <li><strong>Потеря кворума Patroni/etcd:</strong> нода разжалована из Primary в Replica из-за сетевого сплита.</li>
</ol>
        </div>
</details>

</article>
<article class="question-card" id="question-87">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>87.</strong> Что такое Transaction ID Wraparound в PostgreSQL и почему жизненно необходим автовакуум (autovacuum)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> В PostgreSQL счетчик транзакций 32-битный (максимум ~4 миллиарда). Чтобы старые транзакции не стали казаться совершенными в будущем (переполнение счетчика), процесс <strong>autovacuum freeze</strong> обязан периодически замораживать старые кортежи (делая их бесконечно старыми). Если autovacuum отключен или отстает, база аварийно остановит запись.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-92">
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
<article class="question-card" id="question-98">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>98.</strong> Зачем приложению пул соединений с PostgreSQL?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Пул повторно использует соединения, ограничивает их число и уменьшает стоимость подключения и аутентификации. Слишком большой пул увеличивает конкуренцию за память и CPU сервера; размер выбирают по нагрузке и лимитам БД. В Go используют, например, pgxpool или database/sql с настроенными ограничениями.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(4)</small></h3>
<div class="clarification-item" id="question-98-followup-1" data-parent-question="question-98">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как связать авторов и книги (one-to-many)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Если у книги один автор, храните author_id как FK в books — это one-to-many. Если авторов может быть несколько, нужна связующая book_authors(book_id, author_id), то есть many-to-many.</p></div>
</details>
</div>
<div class="clarification-item" id="question-98-followup-2" data-parent-question="question-98">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как реализовать many-to-many между книгами и читателями?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Для истории выдач создайте loans(book_id, reader_id, issued_at, returned_at): одна книга и один читатель могут встречаться много раз во времени. Если одновременно книга может быть только у одного читателя, ограничьте число активных выдач.</p></div>
</details>
</div>
<div class="clarification-item" id="question-98-followup-3" data-parent-question="question-98">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Какие ключи нужны для целостности?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Назначьте PRIMARY KEY каждой сущности, FOREIGN KEY для ссылок и UNIQUE там, где бизнес-правило запрещает повторы. Для связующей таблицы обычно нужен составной ключ из двух FK.</p></div>
</details>
</div>
<div class="clarification-item" id="question-98-followup-4" data-parent-question="question-98">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему важно задавать ON DELETE CASCADE?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">ON DELETE CASCADE уместен, когда дочерняя запись не имеет смысла без родителя, например строка связующей таблицы. Для истории выдач каскад может уничтожить нужный аудит; там часто лучше RESTRICT или мягкое удаление.</p></div>
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
<article class="question-card" id="question-114">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>114.</strong> Что показывает SHOW ALL?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>SHOW ALL выводит текущие значения параметров конфигурации сессии PostgreSQL. Конкретное значение можно получить через SHOW work_mem; для расширенной диагностики используют представление pg_settings. Это чтение настроек, не изменение конфигурации.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(2)</small></h3>
<div class="clarification-item" id="question-114-followup-1" data-parent-question="question-114">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как фильтровать параметры по имени?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Фильтруйте pg_settings: SELECT name, setting FROM pg_settings WHERE name ILIKE '%work_mem%'. SHOW принимает конкретный параметр или SHOW ALL, но не поддерживает WHERE.</p></div>
</details>
</div>
<div class="clarification-item" id="question-114-followup-2" data-parent-question="question-114">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Чем отличается SHOW от pg_settings?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">SHOW показывает значение параметра текущей сессии; pg_settings даёт имя, значение, единицы, источник и контекст настройки и позволяет фильтровать результат SQL-запросом.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-115">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>115.</strong> Как pg_stat_activity помогает найти долгий запрос?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Представление показывает серверные процессы, их состояние, время начала транзакции и текущий запрос с учётом прав наблюдателя. Для диагностики смотрят длительность active-запросов и idle in transaction, затем сопоставляют с блокировками. Само долгое состояние не доказывает, что процесс безопасно завершать.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(2)</small></h3>
<div class="clarification-item" id="question-115-followup-1" data-parent-question="question-115">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как найти долгие запросы?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">В pg_stat_activity ищите активные запросы с большим now() - query_start. Для истории медленных запросов включают логирование и/или pg_stat_statements с учётом прав и накладных расходов.</p></div>
</details>
</div>
<div class="clarification-item" id="question-115-followup-2" data-parent-question="question-115">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что значит состояние “idle in transaction”?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Сессия открыла транзакцию и ждёт команд клиента, не завершая её. Она может удерживать блокировки и старый снимок, мешать VACUUM и увеличивать bloat; исправляйте границы транзакции в клиенте.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-116">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>116.</strong> Как найти блокирующую сессию через pg_locks?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>pg_locks показывает удерживаемые и ожидаемые блокировки; его сопоставляют с pg_stat_activity по PID. Функция pg_blocking_pids(pid) помогает получить непосредственных блокировщиков. Важно различать долгий запрос и запрос, который лишь ждёт блокировку.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(2)</small></h3>
<div class="clarification-item" id="question-116-followup-1" data-parent-question="question-116">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Какие типы блокировок существуют в PostgreSQL?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">В PostgreSQL есть табличные режимы вроде AccessShare, RowExclusive и AccessExclusive, блокировки строк, страниц, транзакций и advisory locks. Для диагностики смотрите pg_locks вместе с pg_stat_activity.</p></div>
</details>
</div>
<div class="clarification-item" id="question-116-followup-2" data-parent-question="question-116">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как найти deadlock и его источник?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">PostgreSQL записывает deadlock в журнал и отменяет одну транзакцию. Сопоставьте PID, SQL и блокирующие связи через pg_stat_activity, pg_locks и pg_blocking_pids, затем исправьте порядок захвата ресурсов.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-117">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>117.</strong> Когда использовать pg_cancel_backend и pg_terminate_backend?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>pg_cancel_backend пытается отменить текущий запрос, сохранив соединение; pg_terminate_backend завершает всю сессию и откатывает её открытую транзакцию. Перед действием определяют PID, владельца, блокируемые операции и последствия для приложения. Это диагностический инструмент последней необходимости, а не обычный способ управления нагрузкой.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(4)</small></h3>
<div class="clarification-item" id="question-117-followup-1" data-parent-question="question-117">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Чем отличается pg_cancel_backend от pg_terminate_backend?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">pg_cancel_backend(pid) отменяет текущий запрос и сохраняет соединение. pg_terminate_backend(pid) завершает сессию; её незавершённая транзакция откатывается.</p></div>
</details>
</div>
<div class="clarification-item" id="question-117-followup-2" data-parent-question="question-117">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Какие риски при завершении активных транзакций?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Завершение сессии откатывает незавершённую транзакцию, может оборвать операцию и вызвать повторные попытки или внешнюю несогласованность после побочного эффекта приложения. Сначала выясните роль сессии.</p></div>
</details>
</div>
<div class="clarification-item" id="question-117-followup-3" data-parent-question="question-117">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Когда использовать pg_cancel_backend, а когда terminate?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Сначала используйте pg_cancel_backend для зависшего запроса, если соединение должно остаться. pg_terminate_backend применяйте, когда сессию нужно полностью разорвать, оценив последствия для открытой транзакции.</p></div>
</details>
</div>
<div class="clarification-item" id="question-117-followup-4" data-parent-question="question-117">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему нельзя убивать autovacuum-процессы?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Повторное завершение autovacuum оставляет мёртвые строки, увеличивает bloat и приближает опасный wraparound. Вместо этого диагностируйте нагрузку и настройте очистку; аварийное вмешательство требует понимания конкретного процесса.</p></div>
</details>
</div>
</div>
</article>`;
