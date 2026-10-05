window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["databases/sql"] = `<article class="question-card" id="question-90">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>90.</strong> Что такое транзакция? Какие уровни изоляции транзакций существуют в РСУБД?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer"><p>Транзакция объединяет операции в атомарную единицу: COMMIT фиксирует результат, ROLLBACK отменяет его, SAVEPOINT позволяет откатить часть работы. ACID описывает атомарность, согласованность, изоляцию и долговечность. Стандартные уровни изоляции: Read Uncommitted, Read Committed, Repeatable Read и Serializable; PostgreSQL трактует Read Uncommitted как Read Committed. Чем сильнее изоляция, тем меньше допустимых аномалий и тем вероятнее конфликты или повтор транзакции.</p></div>

  
  
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(10)</small></h3>
<div class="clarification-item" id="question-90-followup-1" data-parent-question="question-90">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Чем отличаются row-level и table-level lock?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Табличная блокировка защищает отношение целиком от несовместимых операций, а блокировка строки — конкретную строку от конкурирующего изменения или захвата. Один оператор может брать оба уровня: UPDATE получает на таблицу ROW EXCLUSIVE и блокирует изменяемые строки; SELECT FOR UPDATE получает на таблицу ROW SHARE и блокирует выбранные строки. Названия табличных режимов ROW SHARE и ROW EXCLUSIVE не означают блокировку строк. Табличные режимы сравнивают с табличными режимами на той же таблице, строковые — со строковыми на той же строке; при этом строгая табличная блокировка остановит оператор ещё до захвата им строки. Обычный SELECT не ждёт построчную блокировку: MVCC позволяет прочитать доступную версию строки.</p></div>
</details>
</div>
<div class="clarification-item" id="question-90-followup-2" data-parent-question="question-90">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое shared/exclusive lock?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Shared означает, что несколько транзакций могут одновременно держать совместимые режимы на одном объекте; exclusive запрещает определённые конкурирующие режимы. Это не простое правило «все чтения совместимы, все записи нет»: например, табличный ACCESS SHARE совместим с ROW EXCLUSIVE, поэтому обычный SELECT и UPDATE идут параллельно, а SHARE конфликтует с ROW EXCLUSIVE и задержит UPDATE. Точную совместимость определяют режим и объект блокировки; матрицы восьми табличных и четырёх строковых режимов приведены ниже.</p></div>
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
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое dirty read, non-repeatable read, phantom read и аномалия сериализации?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Dirty read (грязное чтение): T1 изменила баланс, ещё не сделала COMMIT, T2 прочитала новое значение, после чего T1 откатилась — T2 использовала значение, которого никогда не было в зафиксированном состоянии. Non-repeatable read (неповторяемое чтение): T1 дважды читает ту же строку; между чтениями T2 меняет её и делает COMMIT, поэтому T1 видит два разных значения. Phantom read (фантом): T1 повторяет запрос по одному условию; между запросами T2 фиксирует строку, подходящую под условие, и состав результата меняется. Serialization anomaly (аномалия сериализации): успешно завершённые параллельные транзакции дают результат, которого не получить ни при одном последовательном порядке. Пример — write skew: два врача видят, что дежурят оба, и каждый снимает с дежурства себя; в итоге не дежурит никто. PostgreSQL не допускает грязных чтений даже при READ UNCOMMITTED.</p></div>
</details>
</div>
<div class="clarification-item" id="question-90-followup-6" data-parent-question="question-90">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как уровень изоляции влияет на аномалии?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">READ UNCOMMITTED по стандарту допускает грязное, неповторяемое и фантомное чтение; в PostgreSQL работает как READ COMMITTED, поэтому грязного чтения нет. READ COMMITTED (уровень PostgreSQL по умолчанию): каждый оператор видит свой снимок уже зафиксированных данных; два SELECT в одной транзакции могут увидеть разные значения строки и разный набор строк. REPEATABLE READ: снимок закреплён с первого запроса или изменения; повторное и фантомное чтение в PostgreSQL исключены, но возможна аномалия сериализации, например write skew. SERIALIZABLE: результат успешно завершённых транзакций должен соответствовать некоторому последовательному порядку; при опасном конфликте PostgreSQL отменяет одну транзакцию с serialization_failure, и приложение повторяет её целиком. Это гарантии видимости и допустимого результата, а не запрет на параллельное выполнение.</p></div>
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
<div class="clarification-item" id="question-90-followup-9" data-parent-question="question-90">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Какие восемь табличных режимов PostgreSQL совместимы между собой?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p>Режимы на одной таблице совместимы, если их нет в списке конфликтов ниже. Проверка относится к разным транзакциям; с собственными блокировками транзакция не конфликтует.</p>
<ul><li><code>ACCESS SHARE</code> (обычный <code>SELECT</code>) — только с <code>ACCESS EXCLUSIVE</code>.</li>
<li><code>ROW SHARE</code> (<code>SELECT FOR UPDATE/SHARE</code>) — с <code>EXCLUSIVE</code> и <code>ACCESS EXCLUSIVE</code>.</li>
<li><code>ROW EXCLUSIVE</code> (<code>INSERT/UPDATE/DELETE</code>) — с <code>SHARE</code>, <code>SHARE ROW EXCLUSIVE</code>, <code>EXCLUSIVE</code>, <code>ACCESS EXCLUSIVE</code>.</li>
<li><code>SHARE UPDATE EXCLUSIVE</code> (обычный <code>VACUUM</code>, <code>ANALYZE</code>, <code>CREATE INDEX CONCURRENTLY</code>) — с собой, <code>SHARE</code>, <code>SHARE ROW EXCLUSIVE</code>, <code>EXCLUSIVE</code>, <code>ACCESS EXCLUSIVE</code>.</li>
<li><code>SHARE</code> (обычный <code>CREATE INDEX</code>) — с <code>ROW EXCLUSIVE</code>, <code>SHARE UPDATE EXCLUSIVE</code>, <code>SHARE ROW EXCLUSIVE</code>, <code>EXCLUSIVE</code>, <code>ACCESS EXCLUSIVE</code>.</li>
<li><code>SHARE ROW EXCLUSIVE</code> (<code>CREATE TRIGGER</code>) — с <code>ROW EXCLUSIVE</code>, <code>SHARE UPDATE EXCLUSIVE</code>, <code>SHARE</code>, собой, <code>EXCLUSIVE</code>, <code>ACCESS EXCLUSIVE</code>.</li>
<li><code>EXCLUSIVE</code> (<code>REFRESH MATERIALIZED VIEW CONCURRENTLY</code>) — со всеми, кроме <code>ACCESS SHARE</code>.</li>
<li><code>ACCESS EXCLUSIVE</code> (<code>TRUNCATE</code>, <code>DROP TABLE</code>, <code>VACUUM FULL</code>) — со всеми, включая себя; это единственный режим, блокирующий обычный <code>SELECT</code>.</li></ul></div>
</details>
</div>
<div class="clarification-item" id="question-90-followup-10" data-parent-question="question-90">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как совместимы четыре режима блокировки строк PostgreSQL?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p>Конфликтуют только блокировки одной и той же строки, взятые разными транзакциями; для разных строк они совместимы.</p>
<ul><li><code>FOR KEY SHARE</code> конфликтует только с <code>FOR UPDATE</code>. Он защищает ключ от удаления или изменения, но допускает обновление неключевых полей.</li>
<li><code>FOR SHARE</code> конфликтует с <code>FOR NO KEY UPDATE</code> и <code>FOR UPDATE</code>; несколько транзакций могут держать <code>FOR SHARE</code> одновременно.</li>
<li><code>FOR NO KEY UPDATE</code> конфликтует с собой, <code>FOR SHARE</code> и <code>FOR UPDATE</code>, но совместим с <code>FOR KEY SHARE</code>. Его обычно берёт <code>UPDATE</code> без изменения ключевых столбцов.</li>
<li><code>FOR UPDATE</code> конфликтует со всеми четырьмя режимами, включая себя; его берёт <code>DELETE</code> и <code>UPDATE</code> ключевых столбцов.</li></ul>
<p>Обычный <code>SELECT</code> не запрашивает строковую блокировку и не ждёт её. <code>SELECT ... FOR UPDATE</code> или другие <code>FOR ...</code> сначала получают совместимую блокировку таблицы, затем выбранных строк.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-91">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>91.</strong> Какие аномалии могут быть при параллельном исполнении транзакций?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p style="margin: 6px 0; color: var(--text-secondary); line-height: 1.65;">Расскажи кратко о каждой аномалии: Dirty Read, Non-repeatable Read, Phantom Read, Serialization Anomaly.</p>
          <div class="complete-answer"><p>Грязное чтение видит данные, которые другая транзакция ещё может откатить. Неповторяемое чтение даёт разные значения одной строки при двух чтениях внутри транзакции. Фантомное чтение меняет состав строк при повторе запроса с тем же условием. Аномалия сериализации означает, что итог нескольких зафиксированных транзакций нельзя получить при их последовательном выполнении; пример — write skew, когда две транзакции принимают решение по одному снимку и изменяют разные строки, нарушая общее правило. Возможен также lost update — потеря изменения при перезаписи результата другой транзакции. Допустимость аномалий зависит от уровня изоляции и СУБД; в PostgreSQL SERIALIZABLE отменяет опасную транзакцию с ошибкой, после которой её нужно повторить целиком.</p></div>

  
  
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(8)</small></h3>
<div class="clarification-item" id="question-91-followup-1" data-parent-question="question-91">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое ACID?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">ACID — четыре разных свойства транзакции. Atomicity: все её изменения фиксируются вместе или вместе откатываются. Consistency: транзакция переводит данные из одного допустимого состояния в другое, если её логика и ограничения корректны. Isolation: результат параллельной работы ограничен выбранным уровнем изоляции. Durability: подтверждённый COMMIT сохраняется после сбоя в пределах настроенных гарантий БД. Ниже каждое свойство разобрано отдельно на примере перевода денег.</p></div>
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
<div class="clarification-item" id="question-91-followup-5" data-parent-question="question-91">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что гарантирует Atomicity (атомарность) в ACID?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p>Если перевод состоит из списания 100 с одного счёта и зачисления 100 на другой, после <code>COMMIT</code> сохраняются оба изменения. При <code>ROLLBACK</code>, ошибке или сбое до фиксации не сохраняется ни одно из них. Атомарность относится к изменениям в рамках транзакции БД; отправленное письмо или внешний платёж она сама не откатывает.</p></div>
</details>
</div>
<div class="clarification-item" id="question-91-followup-6" data-parent-question="question-91">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что означает Consistency (согласованность) в ACID?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p>Транзакция должна сохранять инварианты данных: например, перевод не должен создавать отрицательный остаток, если это запрещено правилом, и должен сохранить общую сумму двух счетов. PostgreSQL проверяет объявленные <code>CHECK</code>, <code>UNIQUE</code> и внешние ключи, но бизнес-правило, не выраженное ограничением или корректной логикой транзакции, сама СУБД не угадает. Допустимое состояние до транзакции должно остаться допустимым после её фиксации.</p></div>
</details>
</div>
<div class="clarification-item" id="question-91-followup-7" data-parent-question="question-91">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что означает Isolation (изоляция) в ACID?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p>Одновременные транзакции не должны мешать друг другу сверх того, что допускает выбранный уровень изоляции. При <code>READ COMMITTED</code> повторный <code>SELECT</code> остатка счёта может увидеть новое зафиксированное значение после чужого <code>COMMIT</code>; при <code>REPEATABLE READ</code> снимок остаётся стабильным, но возможен <em>write skew</em>. Только <code>SERIALIZABLE</code> требует, чтобы итог успешно завершённых транзакций соответствовал некоторому последовательному выполнению; конфликт может завершиться ошибкой и потребовать повтора всей транзакции. Изоляция не означает физического выполнения транзакций по одной.</p></div>
</details>
</div>
<div class="clarification-item" id="question-91-followup-8" data-parent-question="question-91">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что гарантирует Durability (долговечность) в ACID?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p>После подтверждённого <code>COMMIT</code> перевод должен сохраниться при перезапуске БД: PostgreSQL восстанавливает зафиксированные изменения по журналу WAL. Граница гарантии зависит от настроек фиксации и хранения: например, отключение <code>fsync</code> или асинхронная фиксация ослабляют её при аварии. Долговечность одной БД не означает, что изменение уже попало на асинхронную реплику или во внешнюю систему.</p></div>
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

window.InterviewProContent["databases/sql"] += window.InterviewProBuildCards("databases/sql", [
  {
    "id": 430,
    "title": "Когда использовать NULL и как он влияет на сравнения и агрегаты в SQL?",
    "answer": "**NULL** обозначает отсутствующее или неизвестное значение, а не ноль или пустую строку. Например, `completed_at IS NULL` может означать, что заказ ещё не завершён. Для обязательных данных задают NOT NULL; подставлять фиктивную дату вместо неизвестной обычно вредно для смысла данных.\n\nВ SQL есть трёхзначная логика: сравнение `value = NULL` даёт UNKNOWN. Проверяют через IS NULL / IS NOT NULL; WHERE оставляет только TRUE. В MySQL оператор `<=>` позволяет NULL-безопасное сравнение.\n\n`COUNT(*)` считает строки, `COUNT(column)` — непустые значения. SUM и AVG пропускают NULL; COALESCE возвращает первое не-NULL значение, но замена на ноль меняет смысл среднего. NULL внутри списка или подзапроса NOT IN способен дать неожиданный UNKNOWN; для проверки отсутствия совпадений часто удобнее NOT EXISTS.\n\nПроверка IS NULL сама по себе не запрещает использование индекса. Решение зависит от индекса, селективности и плана запроса.",
    "markdown": true
  }
]);

window.InterviewProContent["databases/sql"] += window.InterviewProBuildCards("databases/sql", [
  {
    "id": 485,
    "title": "Чем UNION отличается от UNION ALL? Как удаление дублей влияет на результат и стоимость запроса?",
    "answer": "**Ответ:** `UNION ALL` объединяет результаты, сохраняя повторяющиеся строки. `UNION` удаляет дубли по всем столбцам результата, что обычно требует дополнительного хеширования или сортировки.\n\nЧисло столбцов должно совпадать, а типы — быть совместимыми. Если повторы допустимы или исключены логикой, `UNION ALL` избегает ненужной работы. Порядок строк без итогового `ORDER BY` не гарантируется ни в одном варианте.",
    "markdown": true
  },
  {
    "id": 490,
    "title": "Как реализовать optimistic locking через поле версии? Чем конфликт версии отличается от ошибки сериализации и когда нужно повторять всю транзакцию?",
    "answer": "**Ответ:** Клиент читает версию и обновляет строку только при её совпадении:\n\n```sql\nUPDATE documents\nSET body = $1, version = version + 1\nWHERE id = $2 AND version = $3;\n```\n\nНоль изменённых строк означает отсутствие объекта либо конфликт версии. Приложение перечитывает данные и решает, допустимо ли повторить изменение; нельзя молча затереть чужую правку.\n\nОшибка сериализации означает, что БД не смогла обеспечить выбранную изоляцию. Обычно повторяют всю транзакцию с новым снимком и ограничением попыток, а не только последний UPDATE. Внешние побочные эффекты требуют отдельной защиты от повторов.",
    "markdown": true
  }
]);
