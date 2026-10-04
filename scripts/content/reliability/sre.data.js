window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["reliability/sre"] = `<article class="question-card" id="question-2">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>2.</strong> Что такое SLA, SLO и SLI? Как понять, что сервис деградирует до того, как клиенты пожалуются?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong></p>
<ul>
  <li><strong>SLI (Indicator):</strong> точная метрика (например, доля HTTP-запросов со статусом &lt; 500).</li>
  <li><strong>SLO (Objective):</strong> внутренний таргет команды (например, 99.9% за месяц).</li>
  <li><strong>SLA (Agreement):</strong> контракт с клиентом с финансовыми штрафами за простой.</li>
</ul>
<p><strong>Предотвращение:</strong> Мониторят <em>Error Budget Burn Rate</em> (скорость сжигания бюджета ошибок). Если за 1 час сгорело 5% месячного бюджета — алерт стреляет задолго до нарушения SLA.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-121">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>121.</strong> Что такое правило четырех золотых сигналов (Four Golden Signals) в Google SRE (Latency, Traffic, Errors, Saturation)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>4 золотых сигнала:</strong></p>
<ol>
  <li><strong>Latency (Задержка):</strong> время ответа сервиса (отдельно для успешных и ошибочных запросов).</li>
  <li><strong>Traffic (Трафик):</strong> объем нагрузки (RPS, network bandwidth).</li>
  <li><strong>Errors (Ошибки):</strong> количество и доля сбоев (5xx HTTP, ошибки парсинга).</li>
  <li><strong>Saturation (Насыщение):</strong> степень утилизации самого узкого ресурса (CPU, RAM, коннекты к БД).</li>
</ol>
        </div>
</details>

</article>`;
