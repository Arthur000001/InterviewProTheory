window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["network/http"] = `<article class="question-card" id="question-40">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>40.</strong> В чем разница между кодами ошибок 502 Bad Gateway и 504 Gateway Timeout на Ingress/Nginx? Как их диагностировать?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong></p>
<ul>
  <li><strong>502 Bad Gateway:</strong> бэкенд мгновенно отбил соединение (Connection refused, падение по OOM, процесс упал или закрыл сокет до ответа). Смотреть логи и restart count подов.</li>
  <li><strong>504 Gateway Timeout:</strong> бэкенд принял соединение, но не ответил за отведенное время (таймаут <code>proxy_read_timeout</code>). Причина: долгий SQL-запрос, дедлок, зависание внешнего API.</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-44">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>44.</strong> В чем разница между proxy / reverse-proxy?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer"><p>Прямой proxy принимает запрос от клиента и обращается к внешнему ресурсу от его имени; его используют для политики доступа, кеша или выхода в сеть. Reverse proxy расположен перед серверами приложения и принимает входящие запросы, выбирая backend; он может завершать TLS, балансировать нагрузку и кешировать ответы. Различие в том, чьи интересы и какую сторону соединения представляет посредник.</p></div>

  <div style="margin: 12px 0; padding: 12px 16px; background: rgba(245, 158, 11, 0.08); border-left: 4px solid #f59e0b; border-radius: 6px;">
    <strong style="color: #f59e0b; display: block; margin-bottom: 8px; font-size: 0.95rem;">🟡 Базовый уровень:</strong>
    <div style="color: var(--text-secondary); line-height: 1.65;"><p style="margin: 6px 0; color: var(--text-secondary); line-height: 1.65;">В случае proxy клиент знает, что запрос/соединение пойдет через proxy в точку<br>назначения. Если используется reverse proxy, то клиент ничего не знает о его<br>существовании и не знает кем конкретно будет обработан его запрос.</p></div>
  </div>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(4)</small></h3>
<div class="clarification-item" id="question-44-followup-1" data-parent-question="question-44">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Чем отличается прямой proxy от reverse proxy?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Прямой proxy принимает запрос клиента к внешнему ресурсу и действует от имени клиента. Reverse proxy стоит перед сервером, принимает клиентский трафик на себя и направляет его к внутренним серверам.</p></div>
</details>
</div>
<div class="clarification-item" id="question-44-followup-2" data-parent-question="question-44">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Какие задачи решает Nginx в роли reverse proxy?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Nginx как reverse proxy может завершать TLS, маршрутизировать и балансировать запросы, кешировать ответы, ограничивать трафик и скрывать внутренние адреса сервисов. Какие функции включать, зависит от схемы приложения.</p></div>
</details>
</div>
<div class="clarification-item" id="question-44-followup-3" data-parent-question="question-44">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как реализовать балансировку через reverse proxy?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Задайте группу upstream-серверов и направьте location через proxy_pass; выберите политику распределения и настройте health checks или обработку отказов. Для корректной передачи клиентского адреса и протокола установите нужные X-Forwarded-* заголовки.</p></div>
</details>
</div>
<div class="clarification-item" id="question-44-followup-4" data-parent-question="question-44">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое load balancing и sticky sessions?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Load balancing распределяет запросы между несколькими экземплярами для ёмкости и отказоустойчивости. Sticky sessions закрепляют клиента за экземпляром, например по cookie; это упрощает локальное состояние, но осложняет равномерность и отказоустойчивость, поэтому состояние лучше хранить отдельно, если возможно.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-46">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>46.</strong> Чем HTTP/3 и QUIC отличаются от HTTP/2 поверх TCP?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>HTTP/3 переносит HTTP-семантику по QUIC поверх UDP. QUIC предоставляет надёжные независимые потоки и TLS 1.3; потеря пакета задерживает затронутый поток, а не все потоки TCP-соединения. Это может сократить задержки, но результат зависит от сети и реализации.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-47">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>47.</strong> Когда статические файлы стоит отдавать с отдельного домена?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Отдельный домен может отделить политику кеширования и не отправлять прикладные cookie с запросами за статикой. Но дополнительное соединение и DNS-запрос тоже стоят времени; HTTP/2 и HTTP/3 уменьшают прежнюю выгоду от разнесения доменов. Решение проверяют на реальном трафике, а не принимают автоматически.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-48">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>48.</strong> Чем HTTP/1.1 отличается от HTTP/2?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>HTTP/1.1 использует текстовое представление сообщений и может повторно использовать соединение; pipelining применялся ограниченно. HTTP/2 вводит бинарные кадры, мультиплексирование потоков в одном TCP-соединении и HPACK для заголовков. Семантика методов и кодов ответа сохраняется.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-49">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>49.</strong> Что означают HTTP-ответы 100 Continue и 301 Moved Permanently?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>100 Continue — промежуточный ответ: клиент может продолжить отправку тела запроса после проверки заголовков сервером. 301 Moved Permanently сообщает о постоянном переносе ресурса; новый адрес обычно передаётся в Location. Для метода и тела при перенаправлении есть нюансы поведения клиентов, поэтому нельзя считать 301 простым повтором любого запроса.</p>
        </div>
</details>

</article>`;
