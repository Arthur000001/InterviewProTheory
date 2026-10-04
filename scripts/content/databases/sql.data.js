window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["databases/sql"] = `<article class="question-card" id="question-90">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>90.</strong> Что такое транзакция? Какие уровни изоляции транзакций существуют в РСУБД?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer"><p>Транзакция объединяет операции в атомарную единицу: COMMIT фиксирует результат, ROLLBACK отменяет его, SAVEPOINT позволяет откатить часть работы. ACID описывает атомарность, согласованность, изоляцию и долговечность. Стандартные уровни изоляции: Read Uncommitted, Read Committed, Repeatable Read и Serializable; PostgreSQL трактует Read Uncommitted как Read Committed. Чем сильнее изоляция, тем меньше допустимых аномалий и тем вероятнее конфликты или повтор транзакции.</p></div>

  
  
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(8)</small></h3>
<div class="clarification-item" id="question-90-followup-1" data-parent-question="question-90">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Чем отличаются row-level и table-level lock?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Табличная блокировка относится ко всей таблице, построчная — к выбранным строкам. В PostgreSQL их режимы различаются; UPDATE обычно берёт блокировку таблицы на уровне команды и блокирует изменяемые строки, но не запрещает обычный SELECT благодаря MVCC.</p></div>
</details>
</div>
<div class="clarification-item" id="question-90-followup-2" data-parent-question="question-90">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое shared/exclusive lock?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Разделяемую блокировку могут одновременно держать несколько читателей; эксклюзивная конфликтует с другими режимами, которые мешают изменению защищённого объекта. Конкретная совместимость зависит от уровня — таблица, строка или объект — и режима PostgreSQL.</p></div>
</details>
</div>
<div class="clarification-item" id="question-90-followup-3" data-parent-question="question-90">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Когда возникают deadlock-и?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Deadlock возникает, когда транзакции образуют цикл ожиданий: первая держит ресурс A и ждёт B, вторая держит B и ждёт A. PostgreSQL обнаруживает цикл и отменяет одну транзакцию; уменьшайте риск единым порядком захвата ресурсов и короткими транзакциями.</p></div>
</details>
</div>
<div class="clarification-item" id="question-90-followup-4" data-parent-question="question-90">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как посмотреть текущие блокировки (pg_locks)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Соедините pg_locks с pg_stat_activity по pid, чтобы увидеть режимы, granted и ожидающие запросы; pg_blocking_pids(pid) покажет блокирующие сессии. Учитывайте, что снимок меняется во время наблюдения.</p></div>
</details>
</div>
<div class="clarification-item" id="question-90-followup-5" data-parent-question="question-90">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое dirty read, non-repeatable read, phantom read?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Dirty read — чтение неподтверждённых данных; non-repeatable read — повторное чтение той же строки с другим результатом; phantom read — изменение набора строк, удовлетворяющих предикату. PostgreSQL не допускает dirty read даже на уровне READ UNCOMMITTED, который у него ведёт себя как READ COMMITTED.</p></div>
</details>
</div>
<div class="clarification-item" id="question-90-followup-6" data-parent-question="question-90">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как уровень изоляции влияет на аномалии?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Более строгий уровень ограничивает изменения, которые транзакция может наблюдать между запросами, но может увеличивать конфликты и потребность в повторе транзакций. В PostgreSQL READ COMMITTED даёт снимок на оператор, REPEATABLE READ — на транзакцию, SERIALIZABLE может завершить конфликтную транзакцию ошибкой сериализации.</p></div>
</details>
</div>
<div class="clarification-item" id="question-90-followup-7" data-parent-question="question-90">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Какой уровень изоляции по умолчанию в PostgreSQL?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">По умолчанию PostgreSQL использует READ COMMITTED: каждый оператор видит снимок данных, зафиксированных до его начала, с оговорками для собственных изменений транзакции.</p></div>
</details>
</div>
<div class="clarification-item" id="question-90-followup-8" data-parent-question="question-90">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как минимизировать влияние блокировок на производительность?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Держите транзакции короткими, индексируйте условия поиска обновляемых строк и захватывайте ресурсы в одном порядке. Для очередей можно применять SKIP LOCKED, для диагностики — pg_stat_activity, pg_locks и таймауты ожидания; не убирайте блокировки ценой потери корректности.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-91">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>91.</strong> Какие аномалии могут быть при параллельном исполнении транзакций?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p style="margin: 6px 0; color: var(--text-secondary); line-height: 1.65;">Расскажи кратко о каждой аномалии: Dirty Read, Non-repeatable Read, Phantom Read, Serialization Anomaly.</p>
          <div class="complete-answer"><p>Грязное чтение видит ещё не зафиксированные данные; неповторяемое чтение получает разные значения одной строки в рамках транзакции; фантомное чтение меняет набор строк по одному предикату. Возможны также lost update, write skew и аномалии сериализации. Какие аномалии допустимы, зависит от уровня изоляции и конкретной СУБД. В PostgreSQL MVCC и Serializable Snapshot Isolation устраняют часть конфликтов ценой возможных ошибок сериализации, которые приложение должно повторять.</p></div>

  
  
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(4)</small></h3>
<div class="clarification-item" id="question-91-followup-1" data-parent-question="question-91">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое ACID?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">ACID означает атомарность, согласованность, изоляцию и долговечность транзакций. Это свойства выполнения изменений: либо весь набор фиксируется, либо откатывается; ограничения сохраняются; конкурентные операции изолируются согласно уровню; зафиксированное переживает сбой в рамках гарантий БД.</p></div>
</details>
</div>
<div class="clarification-item" id="question-91-followup-2" data-parent-question="question-91">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Чем COMMIT отличается от ROLLBACK?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">COMMIT фиксирует изменения текущей транзакции, делая их видимыми другим согласно изоляции. ROLLBACK отменяет изменения транзакции; после него данные возвращаются к состоянию до её начала, кроме внешних побочных эффектов.</p></div>
</details>
</div>
<div class="clarification-item" id="question-91-followup-3" data-parent-question="question-91">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как работают savepoint’ы?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">SAVEPOINT создаёт точку внутри транзакции. ROLLBACK TO SAVEPOINT откатывает изменения после неё, не отменяя всю транзакцию; RELEASE SAVEPOINT удаляет точку, оставляя изменения в общей транзакции.</p></div>
</details>
</div>
<div class="clarification-item" id="question-91-followup-4" data-parent-question="question-91">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что произойдёт, если в середине транзакции произойдёт ошибка?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">После ошибки SQL в транзакции PostgreSQL помечает её как прерванную: следующие команды отклоняются до ROLLBACK. Если заранее создан SAVEPOINT, можно выполнить ROLLBACK TO SAVEPOINT и продолжить транзакцию.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-99">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>99.</strong> Что произойдёт, если строка нарушит CHECK в PostgreSQL?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>INSERT или UPDATE завершится ошибкой check_violation, а в транзакции потребуется откатить ошибочный оператор или всю транзакцию. CHECK проверяет выражение для каждой строки; результат UNKNOWN для NULL не нарушает ограничение, поэтому при необходимости добавляют NOT NULL. Отключение триггеров не отключает CHECK.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(3)</small></h3>
<div class="clarification-item" id="question-99-followup-1" data-parent-question="question-99">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Если для решения использовался sync.RWMutex, то спросить: в каких случаях это будет работать медленно?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">RWMutex тормозит при частых или долгих записях: писатели ждут читателей, а новые читатели ждут писателя. При коротких операциях его учёт может быть дороже обычного Mutex; проверяйте бенчмарком.</p></div>
</details>
</div>
<div class="clarification-item" id="question-99-followup-2" data-parent-question="question-99">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как это можно решить?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Если один mutex в кеше создаёт конкуренцию, разбейте записи на шарды с собственными блокировками и выбирайте shard по хешу ключа. Сначала подтвердите проблему профилем: при малой нагрузке обычный mutex проще и может быть быстрее.</p></div>
</details>
</div>
<div class="clarification-item" id="question-99-followup-3" data-parent-question="question-99">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как шардировать данные?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Для каждого ключа вычислите стабильный хеш и выберите shard по остатку от числа шардов; каждый shard содержит свою map и mutex. Операции над одним ключом обращаются только к его shard, а операции над несколькими шардами должны брать блокировки в согласованном порядке.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-102">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>102.</strong> Как ORDER BY сортирует по нескольким полям?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Поля применяются слева направо: второе разрешает равенства по первому. Направление ASC или DESC и порядок NULL задают для каждого поля отдельно. Например, ORDER BY created_at DESC, id DESC даёт стабильный порядок, если id уникален.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-111">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>111.</strong> Когда использовать DELETE вместо TRUNCATE?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>DELETE удаляет выбранные строки и поддерживает WHERE и RETURNING, но массовое удаление создаёт нагрузку на WAL и последующую уборку версий строк. Для больших объёмов оценивают пакетное удаление, длительность транзакций и работу autovacuum. Не следует автоматически запускать ручной VACUUM после каждого DELETE.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(2)</small></h3>
<div class="clarification-item" id="question-111-followup-1" data-parent-question="question-111">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Чем отличается DELETE от TRUNCATE?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">DELETE удаляет выбранные строки и запускает DELETE-триггеры, оставляя мёртвые версии до VACUUM. TRUNCATE быстро очищает таблицу целиком, не запускает DELETE-триггеры, берёт сильную блокировку и в PostgreSQL может быть откатан.</p></div>
</details>
</div>
<div class="clarification-item" id="question-111-followup-2" data-parent-question="question-111">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Когда нужно выполнять VACUUM после DELETE?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Обычный autovacuum сам очищает мёртвые версии после DELETE. Ручной VACUUM нужен, если он отстаёт или требуется быстрее сделать место доступным для повторного использования; VACUUM FULL — тяжёлая перепись для возврата места ОС.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-112">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>112.</strong> Что возвращает UPDATE ... RETURNING?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>RETURNING отдаёт значения строк, фактически изменённых оператором UPDATE. Например, UPDATE jobs SET status = paid WHERE id = 10 RETURNING id, status показывает результат без второго SELECT. Если условие не нашло строк, результат пуст.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(2)</small></h3>
<div class="clarification-item" id="question-112-followup-1" data-parent-question="question-112">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Когда RETURNING особенно полезен?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">RETURNING полезен, когда после INSERT, UPDATE или DELETE нужно получить созданные ID, вычисленные значения или список реально изменённых строк. Это заменяет отдельный SELECT и помогает проверить результат.</p></div>
</details>
</div>
<div class="clarification-item" id="question-112-followup-2" data-parent-question="question-112">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Можно ли использовать RETURNING с JOIN?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">У RETURNING нет собственного JOIN, но его можно использовать в UPDATE ... FROM или DELETE ... USING с соединением в основной команде. Возвращайте поля изменяемой таблицы и допустимые выражения; доступность полей источника зависит от формы команды.</p></div>
</details>
</div>
</div>
</article>`;
