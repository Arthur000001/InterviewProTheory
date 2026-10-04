window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["linux/processes"] = `<article class="question-card" id="question-5">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>5.</strong> Какими способами можно посмотреть файлы, открытые процессом?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Способы:</strong></p>
<ol>
  <li>Через procfs: <code>ls -l /proc/&lt;PID&gt;/fd/</code></li>
  <li>Через утилиту: <code>lsof -p &lt;PID&gt;</code></li>
</ol>
<pre><code class="language-bash">$ ls -l /proc/1420/fd/
lrwx------ 1 app app 64 Sep 27 0: stdin -> /dev/null
lrwx------ 1 app app 64 Sep 27 1: stdout -> /var/log/app.log
lrwx------ 1 app app 64 Sep 27 3: socket -> socket:[412985]</code></pre>
        </div>
</details>

</article>
<article class="question-card" id="question-20">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>20.</strong> Что такое сисколл?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer"><p>Системный вызов — контролируемый переход из пользовательского режима в ядро для операции, требующей его полномочий: чтения файла, работы с сокетом или создания процесса. Программа передаёт номер и аргументы согласно ABI, процессор переключает режим, ядро проверяет аргументы и возвращает результат. Цена вызова зависит от самой операции, ожидания ввода-вывода и копирования данных.</p></div>

  
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(6)</small></h3>
<div class="clarification-item" id="question-20-followup-1" data-parent-question="question-20">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему системные вызовы медленнее обычных функций?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Системный вызов пересекает границу между пользовательским кодом и ядром: требуется переход привилегий, проверка аргументов и часто копирование данных или ожидание устройства. Обычный вызов функции остаётся в том же режиме; фактическая разница зависит от операции.</p></div>
</details>
</div>
<div class="clarification-item" id="question-20-followup-2" data-parent-question="question-20">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как syscall передаёт параметры ядру?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Приложение кладёт номер вызова и аргументы в регистры по соглашению ABI и выполняет специальную инструкцию перехода в ядро. Ядро проверяет параметры, выполняет операцию и возвращает результат через регистры или память.</p></div>
</details>
</div>
<div class="clarification-item" id="question-20-followup-3" data-parent-question="question-20">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Какие типы системных вызовов самые дорогие по времени?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Нет универсального «самого дорогого» вызова: стоимость зависит от того, блокируется ли поток и сколько данных обрабатывается. Дисковый или сетевой ввод-вывод, fsync и ожидание событий обычно дороже простого получения PID; измерять нужно конкретную нагрузку.</p></div>
</details>
</div>
<div class="clarification-item" id="question-20-followup-4" data-parent-question="question-20">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что делает сисколл epoll()?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Позволяет отслеживать готовность файловых дескрипторов к операциям ввода-вывода.</p></div>
</details>
</div>
<div class="clarification-item" id="question-20-followup-5" data-parent-question="question-20">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что делает сисколл fork()?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">fork создаёт дочерний процесс как копию вызывающего: у процессов разные PID и пространства памяти с механизмом copy-on-write. В родителе вызов возвращает PID ребёнка, в ребёнке — 0; ошибка возвращает -1.</p></div>
</details>
</div>
<div class="clarification-item" id="question-20-followup-6" data-parent-question="question-20">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что происходит во время вызова системного вызова?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Процессор переходит из пользовательского режима в режим ядра, ядро выполняет операцию и возвращает управление.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-25">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>25.</strong> Чем отличается процесс от системного потока?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer"><p>Процесс имеет собственное адресное пространство и ресурсы; потоки одного процесса обычно разделяют память и открытые дескрипторы, но имеют отдельные стеки и контекст исполнения. В Linux и процессы, и потоки представлены задачами ядра; различие задаётся тем, какие ресурсы разделяются при создании. Процессы тоже могут обмениваться данными через mmap, shared memory, сокеты или каналы.</p></div>

  
  
  
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(4)</small></h3>
<div class="clarification-item" id="question-25-followup-1" data-parent-question="question-25">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как работает fork()?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">fork создаёт дочерний процесс с отдельным адресным пространством и копией состояния родителя. Страницы памяти обычно разделяются до первой записи по механизму copy-on-write; вызов возвращает разные значения в родителе и ребёнке.</p></div>
</details>
</div>
<div class="clarification-item" id="question-25-followup-2" data-parent-question="question-25">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему создание потока дешевле, чем процесса?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Потоки одного процесса разделяют адресное пространство и многие ресурсы, поэтому обычно требуют меньше работы и памяти. Процессу нужна отдельная адресная среда и больше изоляции; реальные затраты зависят от ОС и способа создания.</p></div>
</details>
</div>
<div class="clarification-item" id="question-25-followup-3" data-parent-question="question-25">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое shared memory?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Shared memory — область памяти, отображённая в адресные пространства нескольких процессов. Она позволяет обмениваться данными без пересылки каждого байта через ядро, но доступ нужно синхронизировать.</p></div>
</details>
</div>
<div class="clarification-item" id="question-25-followup-4" data-parent-question="question-25">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как процессы обмениваются информацией?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Процессы используют IPC: каналы и пайпы для потоков байт, Unix- или сетевые сокеты для сообщений, разделяемую память для быстрого обмена и сигналы для уведомлений. Выбор зависит от объёма данных и нужной синхронизации.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-27">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>27.</strong> Как убить процесс linux&#x27;e?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer"><p>Найдите PID через ps, pgrep или top и отправьте SIGTERM командой <code>kill PID</code>, чтобы дать процессу завершиться штатно. Если он не реагирует, проверьте состояние и причину; SIGKILL (<code>kill -9 PID</code>) — крайний вариант, не дающий выполнить очистку. SIGKILL не перехватывается, но задача в непрерываемом ожидании ядра может исчезнуть лишь после завершения операции.</p></div>

  
  
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(5)</small></h3>
<div class="clarification-item" id="question-27-followup-1" data-parent-question="question-27">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Чем SIGTERM отличается от SIGKILL?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">SIGTERM просит процесс завершиться и может быть обработан для аккуратной остановки. SIGKILL обрабатывает ядро: процесс не может перехватить или игнорировать этот сигнал, поэтому очистка на уровне приложения не выполняется.</p></div>
</details>
</div>
<div class="clarification-item" id="question-27-followup-2" data-parent-question="question-27">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что произойдёт, если убить процесс с дочерними?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Отправка сигнала родителю сама по себе не завершает дочерние процессы. После смерти родителя они обычно переподчиняются другому процессу; чтобы остановить всё дерево, используют группу процессов или менеджер сервиса.</p></div>
</details>
</div>
<div class="clarification-item" id="question-27-followup-3" data-parent-question="question-27">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как узнать, кто держит файл или порт?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Для файла используйте lsof &lt;путь&gt; или fuser &lt;путь&gt;; для порта — ss -ltnp, ss -lunp или lsof -i :&lt;порт&gt;. При проверке чужих процессов могут понадобиться права администратора.</p></div>
</details>
</div>
<div class="clarification-item" id="question-27-followup-4" data-parent-question="question-27">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что делать, если я вызываю kill и процесс продолжает работает?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Проверьте PID, права и состояние процесса: SIGTERM можно перехватить или игнорировать, а непрерываемый сон в ядре задерживает завершение. После времени на корректную остановку можно отправить SIGKILL; зомби уже завершился и ждёт wait от родителя.</p></div>
</details>
</div>
<div class="clarification-item" id="question-27-followup-5" data-parent-question="question-27">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое -9 ?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">В команде kill опция -9 означает сигнал SIGKILL. Ядро принудительно завершает процесс; обработчик и код очистки приложения не запускаются. Обычно сначала посылают SIGTERM и дают процессу возможность остановиться корректно.</p></div>
</details>
</div>
</div>
</article>`;
