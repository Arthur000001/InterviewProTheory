window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["golang/concurrency"] = `<article class="question-card" id="question-129">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>129.</strong> Что такое утечка горутин (goroutine leak), как ее обнаружить с помощью pprof и как предотвратить в коде?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> Горутина запустилась, но зависла навечно (ждет чтения/записи в канал, который никто не закроет, или заблокировалась на мертвом мьютексе). Мусорщик (GC) не может удалить горутину и ее стек.</p>
<pre><code class="language-go">// Детект через pprof:
import _ "net/http/pprof"
// Смотреть: http://localhost:6060/debug/pprof/goroutine?debug=1</code></pre>
<p><strong>Предотвращение:</strong> всегда передавать <code>context.Context</code> с таймаутами и использовать буферизованные каналы для ответа, если читатель может выйти раньше.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-131">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>131.</strong> Чем небуферизованный канал отличается от буферизованного, и что произойдет при чтении/записи/закрытии nil канала или уже закрытого канала?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong></p>
<ul>
  <li><strong>Небуферизованный (cap=0):</strong> синхронный рандеву (отправитель ждет получателя).</li>
  <li><strong>Буферизованный (cap>0):</strong> отправитель не блокируется, пока в буфере есть место.</li>
</ul>
<table border="1" cellpadding="6" style="border-collapse: collapse; margin-top: 8px;">
  <tr><th>Операция</th><th>nil канал</th><th>Закрытый канал</th></tr>
  <tr><td>Запись <code>ch &lt;- x</code></td><td>Вечная блокировка</td><td><strong>ПАНИКА</strong></td></tr>
  <tr><td>Чтение <code>&lt;-ch</code></td><td>Вечная блокировка</td><td>Zero value, ok=false</td></tr>
  <tr><td>Закрытие <code>close(ch)</code></td><td><strong>ПАНИКА</strong></td><td><strong>ПАНИКА</strong></td></tr>
</table>
        </div>
</details>

</article>
<article class="question-card" id="question-133">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>133.</strong> В чем разница между sync.Mutex и sync.RWMutex? Почему мьютекс нельзя передавать по значению (копировать)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong></p>
<ul>
  <li><code>sync.Mutex</code> — эксклюзивная блокировка (один писатель).</li>
  <li><code>sync.RWMutex</code> — разделяемая блокировка: множество читателей (<code>RLock</code>) одновременно, либо ровно один писатель (<code>Lock</code>).</li>
</ul>
<p><strong>Копирование:</strong> Внутри мьютекса лежит семафор и счетчик блокировок. При копировании по значению копируется внутреннее состояние блокировки, что ведет к взаимным дедлокам или гонкам данных. <code>go vet</code> отлавливает это.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-135">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>135.</strong> Как реализовать паттерн Worker Pool на горутинах и каналах для параллельной обработки пачки задач с ограничением конкурентности?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p>Фиксированное число воркеров читает общую очередь задач, поэтому число одновременно выполняемых задач ограничено числом воркеров.</p>
          <p><strong>Код Worker Pool:</strong></p>
<pre><code class="language-go">func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
    defer wg.Done()
    for j := range jobs {
        results <- j * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)
    var wg sync.WaitGroup

    for w := 1; w <= 3; w++ { // 3 воркера
        wg.Add(1)
        go worker(w, jobs, results, &wg)
    }
    for j := 1; j <= 5; j++ { jobs <- j }
    close(jobs)
    wg.Wait()
    close(results)
}</code></pre>
        </div>
</details>

</article>
<article class="question-card" id="question-143">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>143.</strong> Чем горутины отличаются от потоков?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer"><p>Горутина — задача, планируемая рантаймом Go поверх системных потоков. Она стартует с небольшим растущим стеком и обычно дешевле потока; множество горутин могут выполняться на меньшем числе потоков. Планировщик G/M/P распределяет их по доступным процессорам, а блокирующие операции могут потребовать дополнительных потоков. Поток планирует ОС и имеет собственный системный стек и ресурсы.</p></div>

  <div style="margin: 12px 0; padding: 12px 16px; background: rgba(245, 158, 11, 0.08); border-left: 4px solid #f59e0b; border-radius: 6px;">
    <strong style="color: #f59e0b; display: block; margin-bottom: 8px; font-size: 0.95rem;">🟡 Базовый уровень:</strong>
    <div style="color: var(--text-secondary); line-height: 1.65;"><p style="margin: 6px 0; color: var(--text-secondary); line-height: 1.65;">Горутины гораздо более легковесны и требуют меньше памяти, поэтому их можно создать<br>больше. Горутины шедулятся рантаймом языка в юзерспейсе, в то время как потоки<br>шедулятся операционной системой в кернелспейсе. Из этого следует также и меньшее<br>количество переключений контекста в случае использования горутин.</p></div>
  </div>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(7)</small></h3>
<div class="clarification-item" id="question-143-followup-1" data-parent-question="question-143">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Сколько памяти занимает горутина при старте?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Стек новой горутины начинается с нескольких килобайт и растёт по мере необходимости; точный начальный размер зависит от версии и реализации Go. Дополнительно память требуется для структуры горутины и связанных ресурсов.</p></div>
</details>
</div>
<div class="clarification-item" id="question-143-followup-2" data-parent-question="question-143">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как Go переключает горутины без ядра ОС?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Планировщик Go размещает множество горутин на потоках ОС. При блокировке горутины рантайм запускает другую; точки безопасного прерывания позволяют отнять CPU у долго работающей горутины без отдельного потока на каждую из них.</p></div>
</details>
</div>
<div class="clarification-item" id="question-143-followup-3" data-parent-question="question-143">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что произойдёт, если горутина зациклится?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Обычный долгий CPU-цикл может быть прерван планировщиком, чтобы другие горутины получили время, но всё равно загрузит одно ядро. Цикл без работы и ожидания следует завершать по условию или контексту, а не полагаться на планировщик.</p></div>
</details>
</div>
<div class="clarification-item" id="question-143-followup-4" data-parent-question="question-143">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему горутина не равна системному потоку?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Горутина — единица работы планировщика Go с небольшим растущим стеком; поток ОС создаёт ядро и имеет собственные ресурсы и системный стек. Многие горутины могут исполняться на меньшем числе потоков ОС.</p></div>
</details>
</div>
<div class="clarification-item" id="question-143-followup-5" data-parent-question="question-143">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что можно сказать про стек горутины и стек потока?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Изначально у горутины небольшой растущий стек. В Go 1.22 установлен предел в 1 ГБ на 64-битных системах и 250 МБ на 32-битных (десятичные единицы). У потока ОС отдельный стек, которым управляет ОС.</p></div>
</details>
</div>
<div class="clarification-item" id="question-143-followup-6" data-parent-question="question-143">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Cколько можно создать горутин?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Количество горутин не ограничено, можно создавать столько на сколько хватит памяти</p></div>
</details>
</div>
<div class="clarification-item" id="question-143-followup-7" data-parent-question="question-143">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое GOMAXPROCS?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Это переменная ограничивающая количество потоков ОС используемых для исполнения
    горутин</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-145">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>145.</strong> Что такое mutex и зачем он нужен?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer"><p>Mutex даёт ровно одному исполнителю доступ к критической секции. Остальные ждут разблокировки, что предотвращает гонку при работе с общими данными. В Go <code>sync.Mutex</code> нельзя копировать после первого использования; разблокировать его должен код, который гарантированно захватил блокировку. <code>sync.RWMutex</code> допускает нескольких читателей или одного писателя, но не всегда быстрее обычного mutex: выбор зависит от длительности операций и конкуренции.</p></div>

  
  
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(1)</small></h3>
<div class="clarification-item" id="question-145-followup-1" data-parent-question="question-145">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Чем отличается RWMutex от Mutex?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">RWMutex нужен в том случае, если у нас есть
    потоки, которым нужен доступ на чтение ресурса, но не нужна запись. В этом случае
    читать может много потоков одновременно.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-146">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>146.</strong> Что такое каналы? Зачем нужны?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer"><p>Канал — типизированная очередь для обмена значениями между горутинами с синхронизацией. У небуферизованного канала отправка и получение встречаются друг с другом; буферизованный допускает отправку до заполнения ёмкости. Получение из закрытого канала возвращает оставшиеся элементы, затем нулевое значение и <code>ok=false</code>; отправка в закрытый канал вызывает panic. Операции с nil-каналом блокируются навсегда; закрывать канал обычно должен отправитель.</p></div>

  
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(12)</small></h3>
<div class="clarification-item" id="question-146-followup-1" data-parent-question="question-146">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что будет, если читать из закрытого канала?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Получение из закрытого канала сначала забирает оставшиеся буферизованные значения, затем сразу возвращает нулевое значение типа и ok=false. Запись в закрытый канал вызывает panic.</p></div>
</details>
</div>
<div class="clarification-item" id="question-146-followup-2" data-parent-question="question-146">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что произойдёт при записи в заполненный буфер?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Отправка в полный буферизованный канал ждёт, пока получатель освободит место, если только операция не находится в select с готовой альтернативой или default. Без получателя ожидание может быть бесконечным.</p></div>
</details>
</div>
<div class="clarification-item" id="question-146-followup-3" data-parent-question="question-146">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему операции с каналами блокируются?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Отправка должна дождаться места в буфере или получателя, а получение — значения или закрытия канала. Блокировка обеспечивает согласованную передачу без опроса; nil-канал блокирует обе операции навсегда.</p></div>
</details>
</div>
<div class="clarification-item" id="question-146-followup-4" data-parent-question="question-146">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как реализовать неблокирующую отправку/чтение?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Используйте select с веткой default: если отправка или получение не готовы, выполнится default. Это делает операцию неблокирующей, но при частом повторении без паузы можно получить busy loop.</p></div>
</details>
</div>
<div class="clarification-item" id="question-146-followup-5" data-parent-question="question-146">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Какие они бывают?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Каналы Go бывают небуферизированными: отправка ждёт получателя; и буферизированными: отправка проходит без получателя, пока есть место в буфере. Обе разновидности блокируют операции при соответствующих условиях, а закрытие канала задаёт завершение потока значений.</p></div>
</details>
</div>
<div class="clarification-item" id="question-146-followup-6" data-parent-question="question-146">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ К чему приведут операции чтения/записи над закрытым каналом?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Чтение закрытого канала сначала возвращает оставшиеся элементы буфера, затем нулевое значение типа и ok=false. Отправка в закрытый канал вызывает panic. Закрывать канал должен отправитель, когда новых значений не будет.</p></div>
</details>
</div>
<div class="clarification-item" id="question-146-followup-7" data-parent-question="question-146">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ К чему приведут операции чтения/записи над nil каналом</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Чтение из nil канала приведет к блокировке навсегда.
    Запись в nil канал приведет к блокировке навсегда.
    Закрытие такого канала приводит к panic.</p></div>
</details>
</div>
<div class="clarification-item" id="question-146-followup-8" data-parent-question="question-146">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Какой еще способ блокировки навсегда?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">select {
    } 
    
    
     (Если это не совсем очевидно, можно сначала спросить про select, а потом вернуться к
    этому вопросу)</p></div>
</details>
</div>
<div class="clarification-item" id="question-146-followup-9" data-parent-question="question-146">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое select и как он работает</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">select ждёт готовности одной из операций с каналами. Если готовы несколько веток, выбирается одна из них; default выполняется сразу, когда ни одна операция не готова. Через select обычно совмещают приём, отправку, таймаут и отмену через context.Done().</p></div>
</details>
</div>
<div class="clarification-item" id="question-146-followup-10" data-parent-question="question-146">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Другие примитивы синхронизации</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Кроме каналов, в Go используют sync.Mutex и RWMutex для защиты состояния, WaitGroup для ожидания горутин, Once для однократной инициализации, Cond для ожидания условия и атомарные операции для простого состояния. Примитив выбирают по инварианту, который нужно сохранить.</p></div>
</details>
</div>
<div class="clarification-item" id="question-146-followup-11" data-parent-question="question-146">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как устроен внутри?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Структура с метаданными по типу &quot;размер буффера&quot;, &quot;закрыт/открыт&quot;, &quot;связанные
    горутины&quot; и тд. Также в этой структуре есть мьютекс для безопасного доступа к каналу</p></div>
</details>
</div>
<div class="clarification-item" id="question-146-followup-12" data-parent-question="question-146">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Паттерны конкурентного программирования, использующие каналы</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Типичные схемы: pipeline из стадий обработки, fan-out для распределения задач между воркерами, fan-in для объединения результатов и ограниченный worker pool. Нужно определить владельца закрытия канала, обработку ошибок и остановку через context.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-151">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>151.</strong> Как select выбирает операции над каналами?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>При входе в select выражения каналов и отправляемые значения вычисляются один раз. Если готовы несколько case, выбирается один псевдослучайно; если ни один не готов, выполняется default либо горутина ждёт. Case может читать из канала или писать в него; канал nil никогда не готов.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(4)</small></h3>
<div class="clarification-item" id="question-151-followup-1" data-parent-question="question-151">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что происходит, если несколько каналов готовы?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Если готовы несколько веток select, Go выбирает одну готовую ветку псевдослучайно. Не рассчитывайте на приоритет по порядку записи case.</p></div>
</details>
</div>
<div class="clarification-item" id="question-151-followup-2" data-parent-question="question-151">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как работает default в select?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Ветка default выполняется, только если в момент выбора ни одна коммуникация select не готова. Поэтому select с default не блокируется; постоянный повтор без ожидания может загрузить CPU.</p></div>
</details>
</div>
<div class="clarification-item" id="question-151-followup-3" data-parent-question="question-151">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Можно ли использовать select в бесконечном цикле?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Да, часто select помещают в for для обработки канала и сигнала завершения. Предусмотрите выход по закрытию канала или context.Done(), иначе цикл может стать бесконечным или крутиться без полезной работы.</p></div>
</details>
</div>
<div class="clarification-item" id="question-151-followup-4" data-parent-question="question-151">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему select не гарантирует порядок выбора?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Порядок case в исходнике не задаёт порядок выполнения: из одновременно готовых операций выбирается одна псевдослучайно. Для строгой очередности нужен отдельный протокол или синхронизация.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-152">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>152.</strong> Зачем нужен context.Context и что в нём передавать?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Context несёт сигнал отмены, deadline и данные, относящиеся к запросу, через цепочку вызовов. Его передают первым аргументом и вызывают cancel у созданного дочернего контекста, чтобы освободить ресурсы. Большие объекты и обязательные параметры функции через WithValue не передают.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(4)</small></h3>
<div class="clarification-item" id="question-152-followup-1" data-parent-question="question-152">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Чем WithCancel отличается от WithTimeout?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">WithCancel создаёт контекст, который завершается явным вызовом cancel или отменой родителя. WithTimeout дополнительно автоматически отменяется после срока; возвращённый cancel всё равно следует вызвать для освобождения ресурсов.</p></div>
</details>
</div>
<div class="clarification-item" id="question-152-followup-2" data-parent-question="question-152">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что произойдёт, если не вызвать cancel()?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Дочерний контекст может удерживать таймер и ссылки до завершения родителя или истечения срока. Вызывайте cancel после работы: это освобождает ресурсы и сообщает ожидающим операциям об окончании.</p></div>
</details>
</div>
<div class="clarification-item" id="question-152-followup-3" data-parent-question="question-152">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как передать значения через context?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Передавайте данные запроса через context.WithValue с собственным типом ключа, а читатель извлекает их через Value и проверяет тип. Обязательные параметры функции лучше передавать обычными аргументами.</p></div>
</details>
</div>
<div class="clarification-item" id="question-152-followup-4" data-parent-question="question-152">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему нельзя хранить большие объекты в context?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Context распространяется по цепочке вызовов и хранит ссылки на значения до завершения связанных операций. Большие объекты увеличивают удерживаемую память и скрывают зависимости; передавайте только небольшие данные, относящиеся к запросу.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-155">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>155.</strong> Чем отличаются sync.Once и sync.Pool?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Once гарантирует, что переданная функция выполнится ровно один раз для данного Once; при повторных вызовах остальные горутины дождутся её завершения. Pool хранит временные переиспользуемые объекты и снижает часть аллокаций, но элементы могут исчезнуть при сборке мусора. Pool нельзя использовать как надёжное хранилище состояния.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(4)</small></h3>
<div class="clarification-item" id="question-155-followup-1" data-parent-question="question-155">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как работает sync.Once под капотом?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">sync.Once синхронизирует проверку состояния и запускает переданную функцию только один раз; параллельные вызовы ждут завершения первого. После выполнения сохраняется отметка, поэтому следующие вызовы возвращаются без повторного запуска функции.</p></div>
</details>
</div>
<div class="clarification-item" id="question-155-followup-2" data-parent-question="question-155">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему sync.Pool не гарантирует сохранность объектов?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Pool предназначен для временного переиспользования, а не хранения: сборщик мусора может очистить его содержимое. Код обязан корректно работать и при пустом Pool, создавая новый объект при необходимости.</p></div>
</details>
</div>
<div class="clarification-item" id="question-155-followup-3" data-parent-question="question-155">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Когда стоит использовать Pool?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Pool полезен для часто создаваемых временных объектов с заметной стоимостью выделения, например буферов под нагрузкой. Выгоду проверяют профилем; для постоянного состояния и строгого лимита объектов он не подходит.</p></div>
</details>
</div>
<div class="clarification-item" id="question-155-followup-4" data-parent-question="question-155">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что произойдёт с объектами из Pool при GC?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Во время GC объекты могут быть удалены из Pool, и следующий Get вернёт nil. Нельзя рассчитывать, что Put гарантирует последующий Get того же объекта.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-156">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>156.</strong> Когда выбирать sync.Mutex, а когда sync.RWMutex?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Mutex даёт исключительный доступ. RWMutex разрешает нескольким читателям работать одновременно, но писатель ждёт их и блокирует новых читателей. RWMutex полезен лишь при подходящем соотношении чтений и записей и достаточно длинных критических секциях; выбор проверяют профилированием.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(4)</small></h3>
<div class="clarification-item" id="question-156-followup-1" data-parent-question="question-156">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Когда RWMutex хуже обычного Mutex?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">RWMutex может проигрывать Mutex при частых записях, коротких критических секциях или высокой конкуренции: учёт читателей сам стоит времени, а писатель ждёт активных читателей. Выбор проверяют бенчмарком своей нагрузки.</p></div>
</details>
</div>
<div class="clarification-item" id="question-156-followup-2" data-parent-question="question-156">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Можно ли рекурсивно заблокировать Mutex?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Нет. sync.Mutex не отслеживает рекурсивного владельца: повторный Lock тем же потоком исполнения заблокируется и может привести к deadlock.</p></div>
</details>
</div>
<div class="clarification-item" id="question-156-followup-3" data-parent-question="question-156">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что произойдёт при Unlock без Lock?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Unlock незапертого sync.Mutex вызывает фатальную ошибку рантайма. Всегда связывайте Unlock с успешным Lock и чётко определяйте владение блокировкой.</p></div>
</details>
</div>
<div class="clarification-item" id="question-156-followup-4" data-parent-question="question-156">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему нельзя копировать мьютекс?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">После первого использования копия mutex получила бы отдельное состояние блокировки при тех же защищаемых данных, что ломает синхронизацию. Передавайте структуру с mutex по указателю и не копируйте её.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-157">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>157.</strong> Чем гонка данных отличается от deadlock?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Гонка данных возникает, когда конкурентные обращения к одной области памяти не упорядочены синхронизацией и хотя бы одно из них записывает. Deadlock — ситуация, когда участники навсегда ждут друг друга или недоступного события. Детерминированно неправильный порядок без гонки данных тоже может быть логической ошибкой конкурентности.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(4)</small></h3>
<div class="clarification-item" id="question-157-followup-1" data-parent-question="question-157">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как воспроизвести deadlock в Go?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Пример: main получает из небуферизованного канала, в который никто не отправит; либо две горутины захватывают мьютексы A и B в противоположном порядке и ждут друг друга. Для второго случая одна занятая внешняя горутина может не дать рантайму объявить общий deadlock.</p></div>
</details>
</div>
<div class="clarification-item" id="question-157-followup-2" data-parent-question="question-157">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что делает runtime при обнаружении deadlock?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Если все горутины заблокированы и продолжать выполнение невозможно, рантайм обычно завершает программу сообщением «all goroutines are asleep - deadlock!». Он не доказывает отсутствие частичных или зависящих от внешнего события взаимных блокировок.</p></div>
</details>
</div>
<div class="clarification-item" id="question-157-followup-3" data-parent-question="question-157">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как предотвратить race condition?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Общий изменяемый ресурс защищают mutex, атомарными операциями или передачей владения через канал; операции должны быть согласованы одним протоколом. Проверяйте конкурентные пути тестами с -race, но это не заменяет проектирование синхронизации.</p></div>
</details>
</div>
<div class="clarification-item" id="question-157-followup-4" data-parent-question="question-157">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое livelock и starvation?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Livelock — участники активно реагируют друг на друга, но не продвигаются. Starvation — один участник долго или бесконечно не получает ресурс, хотя другие продолжают работу.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-158">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>158.</strong> Что проверяет go test -race и чего детектор не гарантирует?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Детектор гонок инструментирует обращения к памяти и сообщает о гонках, проявившихся в выполненных тестах. Он не доказывает отсутствие гонок на непроверенных путях и не выявляет все логические ошибки, например deadlock. Запуск требует больше памяти и времени, поэтому особенно полезен в тестах и проверочных сборках.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(4)</small></h3>
<div class="clarification-item" id="question-158-followup-1" data-parent-question="question-158">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как работает race detector под капотом?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Сборка с -race инструментирует обращения к памяти и отслеживает порядок синхронизации во время выполнения. Детектор сообщает о двух конфликтующих обращениях без достаточного отношения happens-before.</p></div>
</details>
</div>
<div class="clarification-item" id="question-158-followup-2" data-parent-question="question-158">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Можно ли использовать его в продакшне?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Технически бинарник можно собрать с -race, но из-за существенных затрат CPU и памяти обычно используют тесты и проверочные стенды, а не обычный продакшен-трафик. Решение об ограниченном запуске принимают по ресурсам и рискам.</p></div>
</details>
</div>
<div class="clarification-item" id="question-158-followup-3" data-parent-question="question-158">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Какие типы гонок он не ловит?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Он видит лишь выполненные пути и не доказывает отсутствие гонок в непроверенном коде. Детектор памяти также не находит логические ошибки конкурентности вроде deadlock, нарушения порядка сообщений или неправильного алгоритма при корректной синхронизации.</p></div>
</details>
</div>
<div class="clarification-item" id="question-158-followup-4" data-parent-question="question-158">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как интерпретировать вывод race detector?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">В отчёте найдите две конфликтующие операции, их стеки и место создания горутин. Определите общий объект, проверьте, какая синхронизация должна их упорядочить, исправьте её и повторите тест под -race.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-160">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>160.</strong> Как канал Go хранит ожидающих отправителей и получателей?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>У канала есть очередь данных для буферизованного режима и очереди ожидающих отправителей и получателей. Когда операция не может завершиться, горутина паркуется; противоположная операция или освобождение места позволяет её разбудить. Детали структур рантайма меняются между версиями Go, поэтому в коде следует опираться на семантику канала.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-161">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>161.</strong> Как отличить нулевое значение из канала от чтения после закрытия?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Форма value, ok := &lt;-ch возвращает ok=false, когда закрытый канал исчерпан; value тогда равно нулевому значению типа. Если ok=true, нулевое значение было реально отправлено или прочитано из буфера. Для range по каналу завершение наступает после закрытия и опустошения буфера.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-164">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>164.</strong> Что происходит при чтении, записи и закрытии nil-канала?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Чтение и запись через nil-канал блокируются навсегда, если нет внешнего способа завершить ожидающую горутину. Попытка close(nil) вызывает panic. Канал, объявленный var ch chan T без make, равен nil; в select такой case не готов и может использоваться для отключения ветки.</p>
        </div>
</details>

</article>`;
