window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["architecture/services"] = `<article class="question-card" id="question-167">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>167.</strong> В чем разница между REST и RPC подходами?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer"><p>REST обычно строит API вокруг ресурсов и стандартной семантики HTTP: URI, методы, коды ответа, кеширование и безсессионные запросы. RPC описывает вызываемые операции и их аргументы; транспортом может быть HTTP, gRPC или другой протокол. REST удобен для ресурсной модели и публичного HTTP API, RPC — для строго типизированных внутренних вызовов и потоковой передачи. В обоих случаях важны версионирование, идемпотентность, таймауты и обработка ошибок.</p></div>

  <div style="margin: 12px 0; padding: 12px 16px; background: rgba(245, 158, 11, 0.08); border-left: 4px solid #f59e0b; border-radius: 6px;">
    <strong style="color: #f59e0b; display: block; margin-bottom: 8px; font-size: 0.95rem;">🟡 Базовый уровень:</strong>
    <div style="color: var(--text-secondary); line-height: 1.65;"><p style="margin: 6px 0; color: var(--text-secondary); line-height: 1.65;">REST строится вокруг ресурсов и операций (GET, PUT, DELETE и т.д.)<br>RPC - вызов методов сервиса</p></div>
  </div>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(8)</small></h3>
<div class="clarification-item" id="question-167-followup-1" data-parent-question="question-167">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что делает REST stateless и зачем это нужно?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Stateless в REST означает, что каждый запрос содержит данные, необходимые серверу для его обработки; серверу не требуется помнить контекст предыдущего запроса этого клиента. Это облегчает кеширование, балансировку и восстановление после отказа. Аутентификация и данные приложения при этом могут храниться, но не должны зависеть от памяти одного обработчика.</p></div>
</details>
</div>
<div class="clarification-item" id="question-167-followup-2" data-parent-question="question-167">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему RPC (gRPC) быстрее?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">gRPC часто снижает накладные расходы благодаря бинарному Protobuf, HTTP/2 и постоянным соединениям с мультиплексированием. Но скорость зависит от размера сообщений, сети, серверной работы и сравниваемого REST-протокола; сам RPC не гарантирует выигрыш. Решение проверяют измерением типичной нагрузки.</p></div>
</details>
</div>
<div class="clarification-item" id="question-167-followup-3" data-parent-question="question-167">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Когда лучше выбрать REST, а когда RPC?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">REST удобен для публичного HTTP API, простого доступа из браузера, кеширования и работы с ресурсами. RPC/gRPC подходит для строго типизированного взаимодействия сервисов, стриминга и генерации клиентов по контракту. Сравнивают требования к клиентам, эволюции схемы, наблюдаемости и инфраструктуре.</p></div>
</details>
</div>
<div class="clarification-item" id="question-167-followup-4" data-parent-question="question-167">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Какие типы сериализации данных используются?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Для API часто используют текстовый JSON; он читаем, но объёмнее и требует разбора строк. Protobuf и MessagePack дают компактное бинарное представление; Protobuf также задаёт схему и правила совместимости. Сериализация выбирается по контракту, размеру, скорости и поддержке клиентов.</p></div>
</details>
</div>
<div class="clarification-item" id="question-167-followup-5" data-parent-question="question-167">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Обязательно ли делать REST поверх HTTP?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">REST — архитектурный стиль и не привязан логически только к HTTP, но HTTP предоставляет методы, URI, заголовки и кеширование, поэтому практически REST API обычно строят на HTTP. Если используется другой транспорт, его операции всё равно должны поддерживать ограничения REST, а не только называться REST.</p></div>
</details>
</div>
<div class="clarification-item" id="question-167-followup-6" data-parent-question="question-167">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Обязательно ли делать RPC поверх HTTP?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Нет. RPC описывает вызов удалённой операции и может работать поверх HTTP/2, обычного TCP или другого транспорта. Протокол должен определить кодирование запроса, границы сообщений, ответы, ошибки, таймауты и идентификаторы вызовов.</p></div>
</details>
</div>
<div class="clarification-item" id="question-167-followup-7" data-parent-question="question-167">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Расскажи как RPC запрос можно переложить на HTTP-запрос?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Метод RPC можно адресовать через путь, например POST /Calculator/Add, передать аргументы в теле JSON или Protobuf и вернуть результат в теле ответа. Код HTTP и тело должны однозначно передавать ошибки, а клиент должен знать контракт метода и таймаут.</p></div>
</details>
</div>
<div class="clarification-item" id="question-167-followup-8" data-parent-question="question-167">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ А как это сделать используя только TCP?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Поверх TCP нужно самостоятельно определить границы сообщений, например префикс длины, затем формат запроса и ответа, идентификатор запроса, таймауты и обработку разрыва соединения. TCP передаёт поток байт и не знает о сообщениях приложения. Для защищённого канала дополнительно нужен TLS и проверка сторон.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-168">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>168.</strong> Что представляет собой протокол HTTP? Из каких основных частей состоят HTTP-запрос и ответ?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer"><p>HTTP — протокол запросов и ответов прикладного уровня. Запрос содержит метод, целевой URI и версию протокола, заголовки и при необходимости тело; ответ содержит статус, заголовки и тело. Методы GET, POST, PUT, PATCH и DELETE имеют разные семантики, а коды 2xx/3xx/4xx/5xx обозначают классы результатов. Заголовки управляют типом содержимого, кешированием, авторизацией и cookie; в HTTP/2 и HTTP/3 представление на проводе бинарное, хотя модель сообщений сохраняется.</p></div>

  
  
  
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(3)</small></h3>
<div class="clarification-item" id="question-168-followup-1" data-parent-question="question-168">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Какие есть основные методы HTTP?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Часто используют GET для чтения, HEAD для одних заголовков, POST для обработки или создания, PUT для полной замены, PATCH для частичного изменения и DELETE для удаления. Семантика безопасности и идемпотентности методов важнее названия конкретного endpoint.</p></div>
</details>
</div>
<div class="clarification-item" id="question-168-followup-2" data-parent-question="question-168">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Примеры HTTP хедеров?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Content-Type описывает формат тела, Accept — ожидаемый формат ответа, Authorization — данные авторизации, Cache-Control — правила кеширования, User-Agent — клиент, Content-Length — длину тела. Cookie переносит данные, сохранённые клиентом для конкретного сайта.</p></div>
</details>
</div>
<div class="clarification-item" id="question-168-followup-3" data-parent-question="question-168">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Назовите классы кодов состояний HTTP</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">1xx (informational), 2xx (success), 3xx (redirect), 4xx (client error), 5xx (server error)</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-170">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>170.</strong> Какие вопросы обсудить при использовании Kafka между сервисами?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Следует объяснить ключ сообщения и партиционирование, порядок внутри партиции, consumer groups, управление offset и повторную обработку. Гарантии доставки зависят от настроек продюсера, брокера и потребителя; слово exactly-once не заменяет проверку внешних побочных эффектов. Ответ о личном опыте должен описывать только реально выполненную работу.</p>
        </div>
</details>

</article>`;
