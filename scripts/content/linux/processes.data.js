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
<article class="question-card" id="question-6">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>6.</strong> В какой директории лежат файловые дескрипторы запущенного процесса?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Ответ:</strong> В каталоге <code>/proc/&lt;PID&gt;/fd/</code> виртуальной файловой системы procfs. Имена симлинков — это номера дескрипторов (0 — stdin, 1 — stdout, 2 — stderr, 3+ — сокеты, файлы, epoll, таймеры).</p>
        </div>
</details>

</article>
<article class="question-card" id="question-7">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>7.</strong> Можно ли в приложении перехватывать сигнал SIGKILL?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Ответ:</strong> <strong>Нет, нельзя.</strong> Сигналы <code>SIGKILL</code> (9) и <code>SIGSTOP</code> (19) перехватить или проигнорировать невозможно — они обрабатываются ядром безусловно. Приложение обязано обрабатывать <code>SIGTERM</code> (15) для graceful shutdown.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-8">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>8.</strong> Процессы в каком статусе нельзя завершить сигналом SIGKILL?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Главный подвох вопроса:</strong> Интервьюер ждет не просто перечисления букв (D и Z), а понимания <em>архитектуры ядра</em> — <strong>ПОЧЕМУ</strong> ядро физически не может или запрещает их убивать.</p>

<ol>
  <li>
    <p><strong>Статус D (Uninterruptible Sleep / <code>TASK_UNINTERRUPTIBLE</code>):</strong></p>
    <ul>
      <li><strong>ПОЧЕМУ нельзя:</strong> Процесс выполняет системный вызов внутри ядра и ждет ответа от «железа» (дисковый ввод-вывод, сбойный контроллер, зависший сетевой диск NFS). В этом состоянии <strong>ядро Linux намеренно отключает проверку любых сигналов</strong> (даже SIGKILL).</li>
      <li><strong>Зачем ядро так делает?</strong> Ради целостности данных. Если убить процесс посреди передачи блока драйверу диска или обновления метаданных файловой системы, память ядра и ФС останутся в разорванном, неконсистентном состоянии, что приведет к Kernel Panic или порче диска.</li>
      <li><strong>Что происходит с сигналом:</strong> <code>SIGKILL</code> не теряется, а встает в очередь (pending). Он выполнится только тогда, когда устройство ответит и процесс вернется из пространства ядра в userspace. Если NFS/диск зависли намертво — процесс в <code>D</code>-статусе не прибить никак, кроме перезагрузки хоста.</li>
    </ul>
  </li>
  <li>
    <p><strong>Статус Z (Zombie / <code>EXIT_ZOMBIE</code>):</strong></p>
    <ul>
      <li><strong>ПОЧЕМУ нельзя:</strong> <strong>Потому что процесс УЖЕ МЁРТВ.</strong> У него отобрали всю оперативную память (RAM), закрыли все сокеты и файловые дескрипторы, его код больше не исполняется CPU. Посылать <code>SIGKILL</code> зомби — это как стрелять в труп: убивать буквально некого.</li>
      <li><strong>Зачем он висит в системе?</strong> В ядре хранится лишь крошечная запись в таблице процессов (<code>task_struct</code>), где зафиксирован PID и код завершения (Exit Code). Ядро держит ее для того, чтобы родительский процесс (PPID) мог забрать статус через системный вызов <code>wait()</code> / <code>waitpid()</code>.</li>
      <li><strong>Как его уничтожить:</strong> Нужно послать <code>kill -9 &lt;PPID&gt;</code> <em>родителю</em> зомби. Тогда родитель умрет, осиротевшего зомби усыновит PID 1 (systemd/tini), который вызовет <code>waitpid()</code> и запись исчезнет.</li>
    </ul>
  </li>
  <li>
    <p><strong>Бонус для собеседования (PID 1 / Init):</strong> Процесс с PID 1 нельзя прибить через <code>kill -9 1</code> из userspace. Ядро блокирует доставку SIGKILL для PID 1, так как его гибель приведет к падению всей операционной системы (<em>Kernel Panic: Attempted to kill init!</em>).</p>
  </li>
</ol>

<pre><code class="language-bash"># Как найти процессы в статусах D и Z:
$ ps aux | awk '$8 ~ /[DZ]/'

# Найти зомби и его родителя (PPID во 3-й колонке), чтобы убить родителя:
$ ps -ef | grep defunct
app   15420  14110  0 12:00 ?  00:00:00 [my-app] &lt;defunct&gt;
$ kill -9 14110  # Убиваем PPID (14110), и зомби исчезнет</code></pre>
        </div>
</details>

</article>
<article class="question-card" id="question-12">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>12.</strong> Что происходит при удалении открытого процессами файла через rm? Освободится ли место на диске сразу?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> Место <strong>не освободится</strong>. Команда <code>rm</code> удаляет запись из директории (счетчик ссылок inode уменьшается), но пока дескриптор открыт в процессе, блоки на диске заняты.</p>
<pre><code class="language-bash">$ lsof +L1   # Показывает открытые, но удаленные файлы
$ > /proc/1234/fd/3  # Способ очистить место без перезапуска процесса (занулить дескриптор)</code></pre>
        </div>
</details>

</article>
<article class="question-card" id="question-13">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>13.</strong> В чем разница между жесткими (hard links) и символическими (symlinks) ссылками на уровне файловой системы и inode?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong></p>
<ul>
  <li><strong>Hard link:</strong> еще одно имя для <em>того же самого</em> inode. Удаление оригинала не ломает хардлинк. Нельзя создавать на каталоги и между разными файловыми системами.</li>
  <li><strong>Symlink:</strong> отдельный файл со своим inode, хранящий текстовый путь к цели. При удалении оригинала становится битой ссылкой.</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-14">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>14.</strong> Как работают системные вызовы fork и execve, и что такое оптимизация Copy-on-Write (CoW)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong></p>
<ul>
  <li><code>fork()</code> — дублирует процесс (родительский и дочерний).</li>
  <li><code>execve()</code> — перезаписывает адресное пространство процесса новой исполняемой программой.</li>
  <li><strong>Copy-on-Write (CoW):</strong> при <code>fork()</code> память физически не копируется; страницы помечаются Read-Only и копируются ядром только тогда, когда один из процессов пытается в них <em>записать</em>.</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-17">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>17.</strong> Что такое зомби (defunct) процессы и сироты (orphan), чем они опасны и как их корректно утилизировать?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong></p>
<ul>
  <li><strong>Сирота:</strong> родитель умер, процесс усыновляет PID 1 (systemd/tini).</li>
  <li><strong>Зомби:</strong> процесс завершился, но родитель не вызвал <code>waitpid()</code>. Зомби занимает запись в таблице PID. Если кончится <code>pid_max</code>, система перестанет создавать новые процессы.</li>
</ul>
<p><strong>Лечение:</strong> завершить родительский процесс зомби (<code>kill -9 &lt;PPID&gt;</code>).</p>
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
<article class="question-card" id="question-23">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>23.</strong> Что такое файловый дескриптор?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer"><p>Файловый дескриптор — небольшое целое число, которым процесс ссылается на запись в собственной таблице открытых ресурсов. Через дескрипторы работают файлы, каналы, сокеты и устройства. Таблица указывает на открытое описание файла с текущим смещением и флагами; закрытие дескриптора освобождает ссылку, а не обязательно сам объект.</p></div>

  
  
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(4)</small></h3>
<div class="clarification-item" id="question-23-followup-1" data-parent-question="question-23">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что произойдёт при утечке дескрипторов?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Незакрытые дескрипторы занимают записи таблицы процесса и ресурсы ядра. При достижении лимита новые open, accept или socket начнут возвращать ошибку EMFILE; сервис может перестать принимать соединения.</p></div>
</details>
</div>
<div class="clarification-item" id="question-23-followup-2" data-parent-question="question-23">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему у процесса ограничено количество открытых файлов?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Лимиты защищают ядро и другие процессы от исчерпания памяти и служебных структур. У процесса есть мягкий и жёсткий предел RLIMIT_NOFILE, которые можно посмотреть через ulimit или prlimit.</p></div>
</details>
</div>
<div class="clarification-item" id="question-23-followup-3" data-parent-question="question-23">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как посмотреть открытые дескрипторы процесса?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Посмотрите каталог /proc/&lt;pid&gt;/fd или выполните lsof -p &lt;pid&gt;; для сокетов полезны ss -p и lsof -i. Число открытых дескрипторов можно сравнить с лимитом через /proc/&lt;pid&gt;/limits.</p></div>
</details>
</div>
<div class="clarification-item" id="question-23-followup-4" data-parent-question="question-23">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое stdin, stdout и stderr и какие номера у их дескрипторов?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Это стандартные потоки ввода, вывода и ошибок; обычно им соответствуют дескрипторы 0, 1 и 2.</p></div>
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
