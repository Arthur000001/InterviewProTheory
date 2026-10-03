window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["reliability/observability"] = `<article class="question-card" id="question-118">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>118.</strong> В чем разница между Pull-моделью (Prometheus) и Push-моделью сбора метрик? Каковы плюсы и минусы каждой?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Сравнение:</strong></p>
<ul>
  <li><strong>Pull (Prometheus):</strong> сервер мониторинга сам опрашивает эндпоинты <code>/metrics</code>. Плюсы: встроенный контроль живости сервиса (Target Down), централизованный контроль частоты сбора.</li>
  <li><strong>Push (Telegraf, StatsD):</strong> приложения шлют метрики сами. Плюсы: удобно для короткоживущих batch-джобов (через Pushgateway) и событийных метрик.</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-119">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>119.</strong> Что такое проблема High Cardinality (высокой кардинальности) меток в Prometheus и как она способна вызвать OOM на сервере мониторинга?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> Каждая уникальная комбинация лейблов создает отдельный time-series в TSDB Prometheus.</p>
<p>Если запихнуть в лейбл <code>user_id</code>, <code>uuid</code> или <code>email</code> — количество временных рядов вырастет до миллионов. Хранилище исчерпает оперативную память и упадет по OOM.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-120">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>120.</strong> В чем разница между логами (Loki/Elasticsearch/ClickHouse), метриками (Prometheus/VictoriaMetrics) и трейсами (OpenTelemetry/Jaeger)? Когда нужны трейсы?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Столпы Observability:</strong></p>
<ul>
  <li><strong>Метрики:</strong> числовые агрегаты во времени. Отвечают на вопрос «Что сломалось и когда?».</li>
  <li><strong>Логи:</strong> дискретные текстовые записи событий. Отвечают на вопрос «Почему сломалось конкретное место?».</li>
  <li><strong>Трейсы:</strong> путь одного запроса сквозь десятки микросервисов с замером задержки на каждом спане. Незаменимы для поиска узких мест (latency bottlenecks) в микросервисной архитектуре.</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-122">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>122.</strong> Как устроена архитектура Prometheus Operator и что такое Custom Resources ServiceMonitor и PodMonitor?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> Оператор управляет конфигурацией Prometheus декларативно. Вместо ручной правки конфига <code>prometheus.yml</code>:</p>
<ul>
  <li><strong>ServiceMonitor:</strong> CRD, указывающий оператору собирать метрики с подов, привязанных к определенному Service (по селектору лейблов и порту).</li>
  <li><strong>PodMonitor:</strong> используется, когда у подов нет Service. Оператор автоматически перегенерирует конфиг Prometheus без перезапуска.</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-169">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>169.</strong> Какие существуют инструменты для мониторинга и отладки микросервисов?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer"><p>Для наблюдения за микросервисами используют метрики, логи и распределённые трассировки. Метрики показывают частоту, задержки, ошибки и насыщение; логи дают контекст отдельных событий; трассировка связывает вызовы одного запроса между сервисами. Профилирование CPU и памяти помогает локализовать внутренние затраты, а корреляционные идентификаторы связывают сигналы. Алерты строят по симптомам для пользователя и SLO, затем проверяют гипотезы по деталям и профилям.</p></div>

  
  
  
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(7)</small></h3>
<div class="clarification-item" id="question-169-followup-1" data-parent-question="question-169">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Какие метрики считаются базовыми (RED, USE)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">RED для сервиса: Rate — поток запросов, Errors — доля ошибок, Duration — распределение задержки. USE для ресурса: Utilization — занятость, Saturation — очередь или ожидание, Errors — ошибки ресурса. Метрики смотрят по важным операциям и узким местам, включая p95/p99 задержки.</p></div>
</details>
</div>
<div class="clarification-item" id="question-169-followup-2" data-parent-question="question-169">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Чем отличается мониторинг от алертинга?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Мониторинг собирает и показывает состояние системы во времени: метрики, логи и трассы. Алертинг применяет к этим данным условия и уведомляет ответственного при проблеме, требующей действия. Полезный алерт привязан к пользовательскому эффекту и содержит контекст для диагностики.</p></div>
</details>
</div>
<div class="clarification-item" id="question-169-followup-3" data-parent-question="question-169">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое distributed tracing?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Distributed tracing связывает операции одного запроса между сервисами общим trace ID и отдельными span ID. Каждый span фиксирует время и атрибуты операции, а связи показывают путь и задержки вызовов. Это помогает найти медленный или ошибочный участок, если контекст трассировки передаётся через все границы.</p></div>
</details>
</div>
<div class="clarification-item" id="question-169-followup-4" data-parent-question="question-169">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Пример инструментов для сбора и отображения метрик?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Prometheus собирает и хранит метрики, Grafana строит панели по ним; для оповещений часто используют Alertmanager. Выбор инструментов вторичен: сначала определяют нужные показатели, например частоту ошибок и задержку запросов.</p></div>
</details>
</div>
<div class="clarification-item" id="question-169-followup-5" data-parent-question="question-169">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Какая тулза используется для профилирования в go?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Go предоставляет pprof: профили CPU, памяти, блокировок и мьютексов можно получить через runtime/pprof или net/http/pprof и исследовать командой go tool pprof. Профиль нужно снимать на представительной нагрузке.</p></div>
</details>
</div>
<div class="clarification-item" id="question-169-followup-6" data-parent-question="question-169">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Зачем микросервису на go нужен хендлер /debug/vars?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Пакет expvar публикует диагностические переменные через /debug/vars в JSON: счётчики приложения, статистику памяти и другие зарегистрированные значения. Такой endpoint полезен для отладки, но доступ к нему нужно ограничивать из-за служебной информации.</p></div>
</details>
</div>
<div class="clarification-item" id="question-169-followup-7" data-parent-question="question-169">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как посмотреть логи микросервиса живущего в kubernetes?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Команда kubectl logs pod-name -c container-name показывает stdout/stderr контейнера; флаг --previous помогает увидеть логи предыдущего запуска после рестарта, -f следит за потоком. Для Deployment можно указать ресурс или найти его pod по метке.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-171">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>171.</strong> Как работают распределённые трассировки, например Jaeger?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Каждый запрос получает trace ID, а операции внутри сервисов — span ID и связь с родительским span. Контекст передают между сервисами через заголовки или сообщения. По трассе можно увидеть путь запроса и задержки отдельных этапов; метрики и логи дополняют эту картину. Jaeger собирает и показывает трассы, а инструментирование приложения создаёт spans.</p>
        </div>
</details>

</article>`;
