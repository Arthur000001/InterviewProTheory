window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["architecture/services"] = `<article class="question-card" id="question-168">
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
`;
