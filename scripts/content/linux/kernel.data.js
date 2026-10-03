window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["linux/kernel"] = `<article class="question-card" id="question-4">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>4.</strong> Что такое контейнер глазами ядра Linux? Существует ли контейнер как объект ядра и как взаимодействуют namespaces, cgroups, pivot_root и capabilities?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> В ядре Linux нет структуры <code>struct container</code>. Контейнер — это обычный процесс (<code>task_struct</code>), ограниченный четырьмя столпами ядра:</p>
<ol>
  <li><strong>Namespaces (видимость):</strong> PID, NET, MNT, IPC, UTS, USER, CGROUP.</li>
  <li><strong>Cgroups (квоты):</strong> ограничение CPU (CFS quota), памяти (OOM при превышении), дискового ввода-вывода.</li>
  <li><strong>pivot_root / chroot:</strong> подмена корневой файловой системы на образ (rootfs).</li>
  <li><strong>Capabilities / Seccomp:</strong> урезание привилегий root (drop CAP_SYS_ADMIN, запрет опасных syscalls).</li>
</ol>
<pre><code class="language-bash">$ ls -l /proc/$$/ns
# Показывает идентификаторы неймспейсов текущего процесса</code></pre>
        </div>
</details>

</article>
<article class="question-card" id="question-9">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>9.</strong> Что такое Load Average? О чем говорит ситуация, когда LA высокий, а утилизация CPU низкая?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> Load Average — это среднее число процессов в состояниях <strong>R</strong> (Running/Runnable) и <strong>D</strong> (Uninterruptible Sleep / ожидание I/O) за 1, 5 и 15 минут.</p>
<p>Если CPU загружен на 5%, а LA огромный — система уперлась в <strong>дисковый ввод-вывод (I/O Wait)</strong> или зависла на сетевой файловой системе.</p>
<pre><code class="language-bash">$ top
# Обратите внимание на поле %wa (iowait) и столбец STAT со значением D</code></pre>
        </div>
</details>

</article>
<article class="question-card" id="question-10">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>10.</strong> df -h показывает 50% свободного места, но при попытке создать файл возникает ошибка 'No space left on device'. В чем причина и как проверить?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Причина:</strong> Закончились <strong>inodes (индексные дескрипторы)</strong> из-за огромного количества микрофайлов (кэши, мелкие сессии, spool).</p>
<pre><code class="language-bash">$ df -i /
Filesystem      Inodes   IUsed   IFree IUse% Mounted on
/dev/sda1      1000000 1000000       0  100% /
# Лечение: найти каталог-виновник
$ find /var/spool -xdev -type f | cut -d "/" -f 3 | sort | uniq -c | sort -n</code></pre>
        </div>
</details>

</article>
<article class="question-card" id="question-15">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>15.</strong> Что делать при переполнении таблицы nf_conntrack в логах ядра ('nf_conntrack: table full, dropping packet')?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> Дропаются сетевые пакеты, так как таблица отслеживания состояний NAT переполнена.</p>
<pre><code class="language-bash"># Текущее состояние и лимит
$ sysctl net.netfilter.nf_conntrack_count
$ sysctl net.netfilter.nf_conntrack_max
# Быстрое решение:
$ sysctl -w net.netfilter.nf_conntrack_max=1048576</code></pre>
<p>В K8s решается переходом с iptables на IPVS или eBPF (Cilium), где conntrack байпасится.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-16">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>16.</strong> Что такое cgroups v1 vs v2, и какие проблемы с лимитами памяти/CPU возникали в старых версиях контейнеров на cgroups v1?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> В v1 подсистемы (cpu, memory, blkio) были независимыми деревьями, из-за чего буферизованная запись (page cache) не учитывалась в лимитах памяти контейнера, а троттлинг CPU работал грубо. В v2 единая древовидная структура, точный учет памяти (anon + file) и поддержка PSI (Pressure Stall Information).</p>
        </div>
</details>

</article>
<article class="question-card" id="question-21">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>21.</strong> Какие знаешь примитивы синхронизации в ОС?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer"><p>Mutex обеспечивает исключительный доступ; semaphore ограничивает число одновременных участников; condition variable позволяет ждать изменения условия. Spinlock активно ждёт и подходит только для очень коротких критических секций; futex сочетает быстрый путь в пользовательском пространстве с ожиданием через ядро при конкуренции. Для межпроцессного взаимодействия возможны файловые блокировки и разделяемая память с синхронизацией.</p></div>

  
  
  
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(3)</small></h3>
<div class="clarification-item" id="question-21-followup-1" data-parent-question="question-21">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Чем отличается mutex от semaphore?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Mutex даёт взаимное исключение одному владельцу критической секции. Semaphore хранит счётчик разрешений и допускает заданное число одновременных участников; его сигнализация не обязательно привязана к владельцу.</p></div>
</details>
</div>
<div class="clarification-item" id="question-21-followup-2" data-parent-question="question-21">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что быстрее: futex или spinlock?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">При очень коротком ожидании spinlock может быть быстрее, потому что не усыпляет поток. При длительном ожидании futex позволяет заснуть и не тратить CPU; выбирать нужно по длительности критической секции и конкуренции.</p></div>
</details>
</div>
<div class="clarification-item" id="question-21-followup-3" data-parent-question="question-21">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое busy waiting?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Busy waiting — цикл, который многократно проверяет условие, не блокируя поток. Это снижает задержку при кратком ожидании, но всё время расходует процессорное время.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-22">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>22.</strong> Что такое user space и kernel space? Зачем нужно такое разделение?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer"><p>Пользовательский код выполняется с ограниченными привилегиями и не может напрямую управлять устройствами или памятью ядра. Ядро выполняет привилегированные операции и изолирует процессы друг от друга. Переход в ядро происходит через системный вызов, исключение или прерывание. Разделение защищает систему от ошибок и злонамеренного кода приложений.</p></div>

  
  
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(3)</small></h3>
<div class="clarification-item" id="question-22-followup-1" data-parent-question="question-22">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как осуществляется переход между ними?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Из user space в kernel space переходят по системному вызову, прерыванию или исключению; процессор переключает режим и передаёт управление обработчику ядра. Обратный переход восстанавливает пользовательский контекст.</p></div>
</details>
</div>
<div class="clarification-item" id="question-22-followup-2" data-parent-question="question-22">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему важно минимизировать количество переключений?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Переход требует сохранения и восстановления контекста, работы ядра и иногда влияет на кеши процессора. Лишние переходы увеличивают задержку и загрузку CPU, поэтому операции часто объединяют в пакеты.</p></div>
</details>
</div>
<div class="clarification-item" id="question-22-followup-3" data-parent-question="question-22">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что произойдёт, если процесс попытается обратиться к kernel space напрямую?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Пользовательский процесс не может просто читать или исполнять защищённые страницы ядра: аппаратная проверка прав вызовет исключение доступа. Для разрешённых операций он должен обратиться к ядру через системный вызов.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-26">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>26.</strong> Команда top показывает, что процесс потребляет 146% CPU. Что это означает?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p style="margin: 6px 0; color: var(--text-secondary); line-height: 1.65;">Это реальная ситуация? Если да, то почему так происходит и нужно ли с этим что-то делать?</p>
          <div class="complete-answer"><p>146% CPU в top обычно означает, что потоки процесса суммарно заняли около 1,46 логического процессора за интервал измерения. Значение выше 100% нормально для многопоточного процесса. Оценивать проблему нужно по числу доступных CPU, лимитам cgroup, задержкам и ожидаемой нагрузке; само число не доказывает перегрузку.</p></div>

  
  
  
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(3)</small></h3>
<div class="clarification-item" id="question-26-followup-1" data-parent-question="question-26">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как Linux считает использование CPU?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Ядро учитывает время работы CPU по состояниям; для процесса суммирует пользовательское и системное время его потоков. Процент загрузки получают как изменение этого времени за интервал, делённое на длительность интервала и нормировку утилиты.</p></div>
</details>
</div>
<div class="clarification-item" id="question-26-followup-2" data-parent-question="question-26">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему у многопоточного процесса суммируется загрузка?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Разные потоки процесса могут одновременно работать на разных ядрах. Утилита, где 100% означает одно полностью занятое ядро, покажет суммарно больше 100% для такого процесса.</p></div>
</details>
</div>
<div class="clarification-item" id="question-26-followup-3" data-parent-question="question-26">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое load average?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Load average — усреднённое за 1, 5 и 15 минут число задач, которые выполняются или ожидают CPU; в Linux учитываются также задачи в непрерываемом ожидании, часто ввода-вывода. Сравнивайте показатель с числом доступных CPU и состоянием I/O.</p></div>
</details>
</div>
</div>
</article>`;
