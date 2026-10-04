window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["databases/redis"] = `<article class="question-card" id="question-88">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>88.</strong> Как устроен Redis под капотом (single-threaded event loop, RDB snapshot vs AOF log)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong></p>
<ul>
  <li><strong>Однопоточный event loop:</strong> команды выполняются последовательно через epoll без блокировок мьютексами, что дает колоссальную скорость на простых операциях.</li>
  <li><strong>RDB:</strong> бинарный снапшот всей памяти на диск через <code>fork()</code> CoW через заданные интервалы времени.</li>
  <li><strong>AOF:</strong> журнал всех операций записи (Append-Only File). Обеспечивает минимальную потерю данных при краше.</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-173">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>173.</strong> Для каких задач подходит Redis?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Redis хранит структуры данных преимущественно в памяти и поддерживает строки, списки, множества, хеши и потоки. Его применяют для кеша, счётчиков, краткоживущих сессий и очередей; требования к сохранности определяют выбор RDB или AOF. Задержка зависит от сети, команды и нагрузки, обещать наносекунды нельзя.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(3)</small></h3>
<div class="clarification-item" id="question-173-followup-1" data-parent-question="question-173">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Чем Redis отличается от Memcached?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Redis поддерживает различные структуры данных, атомарные команды, Lua-скрипты и настраиваемую персистентность; его используют не только как кеш. Memcached сосредоточен на распределённом кеше простых значений в памяти. Сравнивать нужно конкретные операции, политику вытеснения, требования к сохранности и нагрузку.</p></div>
</details>
</div>
<div class="clarification-item" id="question-173-followup-2" data-parent-question="question-173">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что произойдёт при переполнении памяти?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Поведение задаёт maxmemory-policy: Redis может отказать в записи из-за нехватки памяти либо вытеснять ключи согласно выбранной политике. Некоторые операции и служебные данные всё равно могут потреблять память сверх установленного порога. Нужно настроить лимит, политику, TTL и мониторинг памяти и вытеснений.</p></div>
</details>
</div>
<div class="clarification-item" id="question-173-followup-3" data-parent-question="question-173">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как Redis обеспечивает персистентность данных?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Redis может сохранять снимки RDB, журнал команд AOF или использовать оба механизма. RDB удобен для компактных снимков, но допускает потерю изменений после последнего снимка; AOF с выбранной политикой fsync сокращает окно потери ценой дисковых операций. Репликация сама по себе не заменяет сохранение данных и резервные копии.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-174">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>174.</strong> Когда кеш помогает и как измерить его пользу?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Кеш сокращает обращения к более дорогому источнику, если данные часто читаются и допустима политика устаревания. Измеряют hit ratio, задержку, нагрузку на источник и цену промахов. Кеш может ухудшить систему, если данные редко повторяются или инвалидировать их сложнее, чем получить заново.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(2)</small></h3>
<div class="clarification-item" id="question-174-followup-1" data-parent-question="question-174">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как избежать устаревших данных в кеше (invalidation)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Задают допустимую давность данных и TTL, а при изменении источника удаляют или обновляют соответствующие ключи. Чтобы избежать гонки между загрузкой и инвалидацией, используют версии, порядок записи или события изменения. При неизвестной связи данных и ключей помогает короткий TTL, но ценой дополнительных промахов.</p></div>
</details>
</div>
<div class="clarification-item" id="question-174-followup-2" data-parent-question="question-174">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Когда кеш может ухудшить производительность?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Кеш ухудшает работу при низкой доле попаданий, дорогой сериализации, частом вытеснении, сетевой задержке больше выигрыша или массовом обновлении одних и тех же ключей. Он также добавляет сложность согласованности и может перегрузить источник при одновременных промахах. Решение оценивают по задержке и нагрузке, а не наличию кеша.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-175">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>175.</strong> Как избежать рассинхронизации кеша и базы данных?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>В cache-aside приложение читает из кеша и при промахе загружает данные из БД; после записи в БД обычно инвалидирует ключ. У write-through и write-behind другие компромиссы по задержке и риску потери данных. TTL ограничивает длительность устаревания, но сам по себе не обеспечивает строгую консистентность.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(2)</small></h3>
<div class="clarification-item" id="question-175-followup-1" data-parent-question="question-175">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как выбрать подход между write-through, write-behind и cache-aside?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Cache-aside загружает значение при промахе и при записи обычно инвалидирует ключ: просто внедрить, но возможны устаревшие данные. Write-through синхронно пишет через кеш в источник и держит часто читаемые записи свежими ценой задержки записи. Write-behind откладывает запись в источник и ускоряет её, но требует надёжной очереди и принимает риск потери ещё не записанных данных.</p></div>
</details>
</div>
<div class="clarification-item" id="question-175-followup-2" data-parent-question="question-175">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что произойдёт при сбое записи в БД после успешного обновления кеша?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Если кеш обновлён, а запись в БД не прошла, кеш начинает показывать значение, которого нет в источнике истины. Для write-through сначала добиваются подтверждённой записи в БД, затем обновляют или инвалидируют кеш; при ошибке запись клиенту считается неуспешной. Для write-behind нужны журнал, повторные попытки и ясная гарантия доставки.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-176">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>176.</strong> Почему Redis быстро обслуживает много соединений?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Redis хранит рабочие данные в памяти и обрабатывает команды через событийную модель, избегая отдельного потока на каждый запрос. Сетевой ввод-вывод и фоновые операции могут использовать дополнительные потоки или процессы, поэтому описание как полностью однопоточного сервера неточно. Долгая команда всё равно задерживает другие команды.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(3)</small></h3>
<div class="clarification-item" id="question-176-followup-1" data-parent-question="question-176">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему Redis однопоточный, но быстрый?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Большинство команд Redis обрабатывается последовательно в основном цикле событий, что упрощает работу с данными без множества блокировок; быстрые операции над памятью дают низкую задержку. Redis не является буквально однопоточным во всех компонентах и версиях: есть фоновые задачи и возможны потоки ввода-вывода. Долгая команда всё равно может задержать другие запросы.</p></div>
</details>
</div>
<div class="clarification-item" id="question-176-followup-2" data-parent-question="question-176">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как он обрабатывает тысячи соединений одновременно?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Redis использует неблокирующий сетевой ввод-вывод и цикл событий, который отслеживает готовность многих сокетов. Он читает запросы, выполняет команды и отправляет ответы по мере готовности соединений. Это позволяет обслуживать множество клиентов без отдельного рабочего потока на каждое соединение, но тяжёлые команды блокируют обработку.</p></div>
</details>
</div>
<div class="clarification-item" id="question-176-followup-3" data-parent-question="question-176">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что происходит при fork для snapshot (RDB)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Для RDB Redis создаёт дочерний процесс через fork; ребёнок записывает снимок, а родитель продолжает принимать команды. Общие страницы памяти копируются при записи, поэтому активные изменения повышают расход памяти. fork и запись снимка также создают кратковременную задержку и нагрузку на диск.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-177">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>177.</strong> Как безопасно задать ключ блокировки в Redis?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>SET key token NX PX ttl атомарно создаёт ключ, только если его ещё нет, и одновременно задаёт срок жизни. При освобождении сравнивают token с сохранённым значением, чтобы не удалить чужую блокировку после истечения TTL. Для критичных распределённых гарантий одной такой блокировки может быть недостаточно.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(2)</small></h3>
<div class="clarification-item" id="question-177-followup-1" data-parent-question="question-177">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как на базе SETNX реализовать распределённый lock?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Атомарно установить ключ можно командой SET lock-key случайный-токен NX PX срок-мс: только первый клиент получит блокировку. При освобождении нужно сравнить сохранённый токен со своим и удалить ключ атомарно, например Lua-скриптом, чтобы не удалить блокировку нового владельца после истечения срока. Сам SETNX без срока и безопасного снятия недостаточен.</p></div>
</details>
</div>
<div class="clarification-item" id="question-177-followup-2" data-parent-question="question-177">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему важно использовать EXPIRE при таких блокировках?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Срок жизни освобождает блокировку, если владелец умер до удаления ключа; без него ресурс может остаться заблокированным навсегда. Срок лучше задавать атомарно вместе с захватом через SET ... NX PX, иначе между SETNX и EXPIRE возможен сбой. При долгой работе нужен контролируемый механизм продления и защита от прежнего владельца.</p></div>
</details>
</div>
</div>
</article>
`;
