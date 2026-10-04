window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["linux/kernel"] = `<article class="question-card" id="question-21">
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
`;
