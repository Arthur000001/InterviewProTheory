window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["linux/memory"] = `<article class="question-card" id="question-11">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>11.</strong> Как работает OOM Killer в Linux и на основе чего ядро выбирает, какой процесс принудительно завершить (oom_score, oom_score_adj)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> При нехватке физической памяти ядро начисляет процессам <code>oom_score</code> (от 0 до 1000) пропорционально доле занимаемой RAM. Убивается процесс с наивысшим баллом.</p>
<p>Приоритет регулируется через <code>/proc/&lt;PID&gt;/oom_score_adj</code> (-1000 — иммунитет от OOM, +1000 — убить первым). В K8s Guaranteed поды имеют adj -997, а BestEffort 1000.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-18">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>18.</strong> Как устроена виртуальная память в Linux (Virtual Memory, RSS, Swap, Page Faults)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong></p>
<ul>
  <li><strong>VIRT:</strong> виртуальный адресный диапазон, запрошенный приложением.</li>
  <li><strong>RSS:</strong> фактическая память, реально выделенная в физической RAM.</li>
  <li><strong>Page Fault:</strong> прерывание при обращении к странице памяти. <em>Minor</em> — выделение физического фрейма без I/O; <em>Major</em> — чтение страницы со Swap или диска.</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-19">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>19.</strong> Что такое страница памяти?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer"><p>Страница — единица отображения виртуальной памяти на физическую или файл. Таблицы страниц хранят соответствие адресов и права доступа; TLB кеширует трансляции. При отсутствии отображения возникает page fault: ядро подгружает или создаёт страницу либо отклоняет доступ. Размер страницы влияет на накладные расходы таблиц и внутреннюю фрагментацию.</p></div>

  
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(5)</small></h3>
<div class="clarification-item" id="question-19-followup-1" data-parent-question="question-19">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что происходит при page fault?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">При обращении к виртуальной странице, которой нет в текущем отображении памяти, процессор вызывает page fault. Ядро проверяет адрес и права: подгружает страницу или создаёт её при допустимом доступе, а при недопустимом посылает процессу сигнал, обычно SIGSEGV.</p></div>
</details>
</div>
<div class="clarification-item" id="question-19-followup-2" data-parent-question="question-19">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как ОС выбирает, какие страницы выгружать?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Ядро выбирает страницы с учётом активности и давления на память: старается вытеснять давно не использованные страницы и сохранять горячие. Анонимные данные при необходимости попадают в swap, файловые страницы можно перечитать из файла.</p></div>
</details>
</div>
<div class="clarification-item" id="question-19-followup-3" data-parent-question="question-19">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему важен размер страницы?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Размер страницы влияет на число записей в таблицах страниц и TLB, стоимость page fault и внутренние потери памяти. Большие страницы уменьшают накладные расходы на трансляцию, но могут расходовать лишнюю память и усложнять выделение.</p></div>
</details>
</div>
<div class="clarification-item" id="question-19-followup-4" data-parent-question="question-19">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Если страницы мапятся на физическую память, как поиск адреса работает быстро?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Процессор кеширует преобразования виртуальных адресов в физические в TLB; попадание в кеш избегает повторного обхода таблиц страниц.</p></div>
</details>
</div>
<div class="clarification-item" id="question-19-followup-5" data-parent-question="question-19">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое hugepages?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Это страницы памяти большего размера; они покрывают больше памяти одной записью TLB и могут снизить число промахов.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-24">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>24.</strong> На голом сервере запущен сервис с утечкой памяти. Что произойдет, когда память закончится?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p style="margin: 6px 0; color: var(--text-secondary); line-height: 1.65;">Речь не про kubernetes и ограничения контейнеров (cgroups/OOM), а про Linux на «голом железе».</p>
          <div class="complete-answer"><p>Утечка постепенно исчерпает доступную память. При наличии swap ядро может выгружать анонимные страницы на диск, но производительность резко снизится. Когда выделить память уже нельзя, Linux запускает OOM killer и выбирает процесс по оценке потребления и oom_score_adj; им не обязательно окажется именно текущий сервис. В контейнере может раньше сработать лимит памяти cgroup и завершиться процесс контейнера.</p></div>

  
  
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(4)</small></h3>
<div class="clarification-item" id="question-24-followup-1" data-parent-question="question-24">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что делает OOM Killer?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">При нехватке памяти ядро выбирает процесс для завершения по оценке oom_score с учётом потребления и oom_score_adj. Это освобождает память, но не устраняет причину утечки; событие видно в журнале ядра.</p></div>
</details>
</div>
<div class="clarification-item" id="question-24-followup-2" data-parent-question="question-24">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как диагностировать утечки памяти в Linux?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Сравнивайте RSS и другие показатели процесса во времени через /proc/&lt;pid&gt;/status, smaps, top или pmap. Затем снимайте профиль выделений подходящим профайлером приложения и проверяйте, какие объекты продолжают расти после нагрузки и сборки мусора.</p></div>
</details>
</div>
<div class="clarification-item" id="question-24-followup-3" data-parent-question="question-24">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему swap не всегда спасает?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Swap ограничен по объёму и значительно медленнее RAM; активные страницы могут вызвать интенсивную подкачку и резкое падение производительности. Некоторые страницы нельзя выгрузить, а при дальнейшем росте памяти всё равно возможен OOM.</p></div>
</details>
</div>
<div class="clarification-item" id="question-24-followup-4" data-parent-question="question-24">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ На какую память опирается система при выборе процесса для OOM Killer?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Оценивается фактическое использование памяти и oom_score, а не только размер виртуального адресного пространства.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-28">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>28.</strong> Что такое TLB и когда помогают HugePages?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>TLB кеширует преобразования виртуальных адресов в физические. При промахе процессор читает таблицы страниц, что дороже попадания в TLB. Большие страницы покрывают больше памяти одной записью и могут уменьшить число промахов, но усложняют управление памятью и не ускоряют всякую нагрузку.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(3)</small></h3>
<div class="clarification-item" id="question-28-followup-1" data-parent-question="question-28">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что происходит при TLB miss?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">При TLB miss процессор не находит готовую трансляцию адреса и читает таблицы страниц в памяти; найденное отображение затем может попасть в TLB. Если отображения нет или доступ запрещён, возникает page fault.</p></div>
</details>
</div>
<div class="clarification-item" id="question-28-followup-2" data-parent-question="question-28">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Зачем нужны hugepages и когда они реально полезны?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Hugepages увеличивают объём памяти, покрываемый одной записью TLB, и могут помочь большим рабочим наборам, например базам данных. Польза зависит от частоты TLB miss; выделение больших страниц и расход памяти имеют собственную цену.</p></div>
</details>
</div>
<div class="clarification-item" id="question-28-followup-3" data-parent-question="question-28">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему TLB ограничен по размеру?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">TLB — быстрый аппаратный кеш, поэтому его ёмкость ограничена площадью, энергопотреблением и временем поиска. Более крупный TLB не бесплатен; процессоры используют уровни кеша и разные размеры страниц как компромисс.</p></div>
</details>
</div>
</div>
</article>`;
