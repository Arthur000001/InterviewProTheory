window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["golang/runtime"] = `<article class="question-card" id="question-125">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>125.</strong> Планировщик какого семейства используется в go?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Ответ:</strong> <strong>Work-stealing M:N scheduler</strong> (планировщик с перехватом работы).</p>
<p>Архитектура <strong>G-M-P</strong>:</p>
<ul>
  <li><strong>G (Goroutine):</strong> горутина со своим стеком.</li>
  <li><strong>M (Machine):</strong> физический OS-поток ядра.</li>
  <li><strong>P (Processor):</strong> логический контекст/ресурс исполнения (число равно <code>GOMAXPROCS</code>). Если локальная очередь у P пуста, поток ворует половину горутин у соседа.</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-126">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>126.</strong> Сколько горутин может единовременно выполняться на логическом процессоре в go?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Ответ:</strong> <strong>Ровно одна горутина</strong> в один момент времени на одном P (Logical Processor / M поток ядра). Но благодаря кооперативной/преемптивной многозадачности переключение между тысячами горутин происходит за наносекунды.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-136">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>136.</strong> Как устроен детектор гонок (Race Detector) в Go (go test -race) и как он находит гонки данных во время выполнения?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> Основан на библиотеке <em>ThreadSanitizer</em> от Google. Компилятор вставляет инструментацию на каждое чтение и запись в память, отслеживая историю обращений и векторные часы синхронизации (happens-before). Если два потока обращаются к одной ячейке памяти без синхронизации и хотя бы одно обращение — запись, детектор кидает панику с полным стек-трейсом.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-137">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>137.</strong> Как устроен сборщик мусора (Garbage Collector) в Go (трехцветный триколорный алгоритм, фазы STW, влияние GOGC и GOMEMLIMIT)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> Конкурентный трехцветный Mark-Sweep с барьером записи (Write Barrier).</p>
<ul>
  <li><strong>Белые:</strong> кандидаты на удаление. <strong>Серые:</strong> найдены, но их потомки еще не просканированы. <strong>Черные:</strong> живые объекты.</li>
  <li><strong>STW (Stop The World):</strong> минимален (доли миллисекунды) для включения и выключения барьера записи.</li>
  <li><code>GOGC=100</code>: триггер сборки при удвоении живой кучи. <code>GOMEMLIMIT</code> (введен в Go 1.19): жесткая верхняя планка памяти для предотвращения K8s OOMKilled.</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-139">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>139.</strong> В чем разница между стеком и кучей (stack vs heap) в Go, и как компилятор принимает решение об Escape Analysis (go build -gcflags='-m')?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong></p>
<ul>
  <li><strong>Стек:</strong> быстрая память горутины (начальный размер 2KB, растет и сжимается). Выделение и очистка стоят 0 (сдвиг указателя стека).</li>
  <li><strong>Куча:</strong> общая память, очищается сборщиком мусора (GC), создает оверхед.</li>
  <li><strong>Escape Analysis:</strong> если переменная не покидает рамки функции — она остается на стеке. Если указатель на нее возвращается наружу, передается в интерфейс или размер неизвестен — она «убегает» в кучу (escapes to heap).</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-140">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>140.</strong> Что такое GOMAXPROCS? Зачем это нужно?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer"><p>GOMAXPROCS задаёт максимальное число потоков, одновременно исполняющих Go-код, через количество логических процессоров P в планировщике Go. Это не ограничение числа горутин или всех системных потоков: блокирующие системные вызовы могут использовать дополнительные потоки. Значение следует соотносить с доступными CPU и лимитами контейнера; менять его стоит после измерений.</p></div>

  
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(4)</small></h3>
<div class="clarification-item" id="question-140-followup-1" data-parent-question="question-140">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как GOMAXPROCS влияет на планировщик Go?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">GOMAXPROCS задаёт число P — контекстов планировщика, способных одновременно исполнять Go-код. Увеличение может дать больше параллелизма на доступных CPU, но не ускоряет задачи, ограниченные ожиданием или блокировками.</p></div>
</details>
</div>
<div class="clarification-item" id="question-140-followup-2" data-parent-question="question-140">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что произойдёт, если установить GOMAXPROCS больше числа ядер?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Программа не начнёт одновременно выполнять больше Go-кода, чем позволяет число доступных CPU. Лишние P могут добавить конкуренцию и переключения; значение имеет смысл подбирать по измерениям, учитывая контейнерную квоту.</p></div>
</details>
</div>
<div class="clarification-item" id="question-140-followup-3" data-parent-question="question-140">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как проверить текущее значение?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Вызовите runtime.GOMAXPROCS(0): при аргументе меньше 1 функция не меняет настройку и возвращает текущее значение. Также полезно проверить переменную среды GOMAXPROCS и CPU-квоту контейнера.</p></div>
</details>
</div>
<div class="clarification-item" id="question-140-followup-4" data-parent-question="question-140">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Может ли приложение с GOMAXPROCS=4 потреблять больше четырёх ядер CPU?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Да, например из-за дополнительных потоков рантайма и блокирующих системных вызовов; GOMAXPROCS ограничивает одновременно исполняемый Go-код.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-141">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>141.</strong> pprof. Что это такое и зачем нужно?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer"><p>pprof собирает профили CPU, кучи, выделений, блокировок и mutex contention. CPU-профиль снимается в течение интервала с выборкой стеков, а heap-профиль представляет снимок распределения памяти по аллокациям или живым объектам. Профиль можно анализировать через <code>go tool pprof</code>: top показывает дорогие функции, list связывает стоимость со строками, граф и flame graph показывают пути вызовов. Сначала сравнивают профили под воспроизводимой нагрузкой, затем проверяют эффект оптимизации повторным измерением.</p></div>

  
  
  
  
  
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(9)</small></h3>
<div class="clarification-item" id="question-141-followup-1" data-parent-question="question-141">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Какие типы профилей бывают (cpu, heap, goroutine, block)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">CPU-профиль показывает, где тратится процессорное время; heap/allocs — распределение памяти; goroutine — стеки горутин; block — ожидание блокирующих операций. Отдельно есть mutex-профиль и execution trace.</p></div>
</details>
</div>
<div class="clarification-item" id="question-141-followup-2" data-parent-question="question-141">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как собрать профиль в проде?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Подключите net/http/pprof к защищённому диагностическому порту или снимите профиль через runtime/pprof и сохраните файл. Ограничьте доступ и длительность CPU-профиля, затем анализируйте результат через go tool pprof; сравнивайте профили при сопоставимой нагрузке.</p></div>
</details>
</div>
<div class="clarification-item" id="question-141-followup-3" data-parent-question="question-141">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как читать flamegraph?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Ширина прямоугольника показывает долю отсчётов, содержащих функцию, а вертикальные слои — стек вызовов. Ищите широкие стеки и различайте собственное время функции от суммарного времени с потомками; затем проверяйте гипотезу на профиле и коде.</p></div>
</details>
</div>
<div class="clarification-item" id="question-141-followup-4" data-parent-question="question-141">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как найти утечку памяти через pprof?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Снимайте heap-профили после нескольких циклов нагрузки и GC, сравнивайте retained/inuse объекты и стеки выделения через pprof -diff_base. Устойчивый рост живого heap и одинаковые стеки удержания указывают, какие ссылки нужно проверить.</p></div>
</details>
</div>
<div class="clarification-item" id="question-141-followup-5" data-parent-question="question-141">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как можно снять профили?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Можно снимать профили, используя программный API, либо подключив
    пакет net/http/pprof .</p></div>
</details>
</div>
<div class="clarification-item" id="question-141-followup-6" data-parent-question="question-141">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое семплирующий профайлер?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Профайлер сохраняет не каждое событие, а каждое N-ное. В случае CPU-профайлера
    это значит, что стектрейсы.</p></div>
</details>
</div>
<div class="clarification-item" id="question-141-followup-7" data-parent-question="question-141">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Есть ли оверхед от использования pprof&#x27;a?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Для профилей heap, alloc, mutex, block - оверхед минимальный, по сути эти данные
    собираются всегда. CPU собирается только по требования и явно добавляет оверхед,
    конкретные значения нужно замерять для конкретного приложения.</p></div>
</details>
</div>
<div class="clarification-item" id="question-141-followup-8" data-parent-question="question-141">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое trace и чем он отличается от других профилей?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Trace предоставляет очень подробную информацию о выполнении приложений:
    
      создание / блокировка / разблокировка горутин
     syscalls
     работа GC
     размер heap&#x27;a, количество тредов и горутин
    
    
     Т.к. trace очень подробная штука, то он добавляет больше оверхеда, чем остальные
    профили.</p></div>
</details>
</div>
<div class="clarification-item" id="question-141-followup-9" data-parent-question="question-141">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Показать картинку с флеймграфом и попросить рассказать он там видит.</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Начните с того, что каждая колонка — часть стека, а её ширина отражает долю отсчётов. Назовите наиболее широкие пути и горячие функции; затем сопоставьте их с типом профиля и нагрузкой, не называя любой широкий прямоугольник «утечкой».</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-149">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>149.</strong> Как устроен планировщик Go: G, M, P и work stealing?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>G — горутина, M — поток ОС, P — ресурс планировщика для исполнения Go-кода. Число P задаётся GOMAXPROCS; горутины размещаются в локальных и глобальной очередях. Если локальная очередь пуста, P может забрать работу у другого P; блокирующий системный вызов позволяет отделить P от ожидающего M.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(4)</small></h3>
<div class="clarification-item" id="question-149-followup-1" data-parent-question="question-149">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что означает G, M и P?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">G — горутина; M — поток ОС; P — ресурс планировщика, необходимый M для исполнения Go-кода. Горутины ожидают выполнения в очередях, а P ограничивают степень параллелизма Go-кода.</p></div>
</details>
</div>
<div class="clarification-item" id="question-149-followup-2" data-parent-question="question-149">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему количество P ограничено GOMAXPROCS?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Число P и есть установленный GOMAXPROCS. Дополнительные горутины не требуют отдельного P: они ждут в очередях и по очереди исполняются на доступных P.</p></div>
</details>
</div>
<div class="clarification-item" id="question-149-followup-3" data-parent-question="question-149">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как планировщик балансирует нагрузку между потоками?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">У P есть локальные очереди готовых горутин, также существует глобальная очередь. Планировщик распределяет работу, а свободный P может забрать часть задач у занятого; блокирующие вызовы не должны останавливать все горутины.</p></div>
</details>
</div>
<div class="clarification-item" id="question-149-followup-4" data-parent-question="question-149">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое work stealing?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Work stealing — когда свободный P забирает часть готовых горутин из очереди другого P. Это помогает выровнять нагрузку без единственной общей очереди для каждой операции.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-154">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>154.</strong> Как Go GC находит и освобождает недоступные объекты?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Сборщик Go выполняет конкурентную маркировку от корней и последующую очистку неотмеченных объектов. Трёхцветная схема и барьеры записи помогают сохранять корректность при изменениях графа ссылок. Короткие остановки мира всё же бывают; их длительность нельзя обещать фиксированным числом для всех программ.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(4)</small></h3>
<div class="clarification-item" id="question-154-followup-1" data-parent-question="question-154">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое “stop the world” и как Go его минимизирует?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Stop the world — пауза выполнения пользовательского Go-кода для отдельных фаз GC. Go выполняет основную маркировку конкурентно и использует короткие паузы для согласования, но длительность зависит от программы и нагрузки.</p></div>
</details>
</div>
<div class="clarification-item" id="question-154-followup-2" data-parent-question="question-154">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое write barrier?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Write barrier — действие рантайма при записи ссылки во время конкурентной маркировки. Оно помогает сборщику не пропустить достижимый объект, когда приложение меняет граф ссылок одновременно с GC.</p></div>
</details>
</div>
<div class="clarification-item" id="question-154-followup-3" data-parent-question="question-154">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как влияют частые аллокации на GC?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Частые выделения увеличивают скорость роста heap и объём работы сборщика: больше сканирования, барьеров и сборок. Сначала ищите реальные горячие места профилем, затем уменьшайте ненужные аллокации.</p></div>
</details>
</div>
<div class="clarification-item" id="question-154-followup-4" data-parent-question="question-154">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как смотреть статистику GC (debug.FreeOSMemory, runtime.ReadMemStats)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">runtime.ReadMemStats(&amp;m) заполняет счётчики heap и GC; для текущих метрик также есть runtime/metrics и GODEBUG=gctrace=1. debug.FreeOSMemory принудительно запускает GC и пытается вернуть память ОС — это не функция просмотра статистики.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-159">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>159.</strong> Что делает runtime.Gosched()?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Gosched уступает текущую возможность исполнения планировщику, чтобы могли работать другие горутины; затем вызывающая горутина продолжит работу. Это не сон и не средство синхронизации. Обычно корректный алгоритм должен опираться на каналы, мьютексы или контекст, а не на ручную уступку времени.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(4)</small></h3>
<div class="clarification-item" id="question-159-followup-1" data-parent-question="question-159">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Когда полезно явно вызывать Gosched()?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Gosched полезен редко: он добровольно уступает выполнение другим горутинам, например в специальном кооперативном цикле. Обычно правильнее ждать канал, таймер или контекст и не строить корректность на вызове Gosched.</p></div>
</details>
</div>
<div class="clarification-item" id="question-159-followup-2" data-parent-question="question-159">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Чем отличается от sleep?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Gosched уступает текущую возможность исполнения и затем продолжает горутину, не задавая длительность ожидания. Sleep блокирует выполнение этой горутины как минимум на указанный интервал; ни то ни другое не заменяет синхронизацию.</p></div>
</details>
</div>
<div class="clarification-item" id="question-159-followup-3" data-parent-question="question-159">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что произойдёт, если вызывать Gosched() в tight loop?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Горутина будет постоянно возвращаться в очередь и снова получать CPU, создавая busy loop. Вместо этого используйте блокирующее ожидание события или ограничение частоты.</p></div>
</details>
</div>
<div class="clarification-item" id="question-159-followup-4" data-parent-question="question-159">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как проверить, что планировщик действительно переключается?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Используйте runtime/trace или профили и проверяйте наблюдаемое чередование работы горутин под нагрузкой. Порядок вывода fmt.Println не является надёжным доказательством конкретных решений планировщика.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-162">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>162.</strong> Почему выделение на стеке обычно дешевле выделения в куче?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Стек горутины обслуживает краткоживущие данные и растёт по необходимости; выделение там обычно не требует отдельного управления каждым объектом. Объекты, переживающие вызов или требующие размещения в куче по escape analysis, создают нагрузку на аллокатор и GC. Освобождение стекового кадра не означает обязательного обнуления всех байтов памяти.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-166">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>166.</strong> Что происходит с памятью стека после возврата из функции Go?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Стековый кадр перестаёт быть активным, и его место может использоваться следующими вызовами: очистка каждого байта при возврате не требуется. Стек горутины может расти и уменьшаться под управлением runtime; при завершении горутины память стека освобождается или сохраняется для повторного использования. Переменные, которые должны пережить возврат, компилятор размещает с учётом escape analysis.</p>
        </div>
</details>

</article>`;
