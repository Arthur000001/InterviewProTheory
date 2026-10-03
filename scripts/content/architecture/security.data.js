window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["architecture/security"] = `<article class="question-card" id="question-182">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>182.</strong> Как хранить пароли так, чтобы усложнить перебор?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Для каждого пароля используют уникальную случайную соль и специальную медленную функцию, например Argon2id, scrypt или bcrypt, с параметрами по возможностям системы. Соль можно хранить рядом с хешем; её задача — сделать одинаковые пароли разными и исключить готовые таблицы. Обычный быстрый hash(password + salt) недостаточен.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(2)</small></h3>
<div class="clarification-item" id="question-182-followup-1" data-parent-question="question-182">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему нельзя хранить соль отдельно от пароля?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Соль можно хранить рядом с хешем пароля: она не обязана быть секретной. Важно создавать уникальную случайную соль для каждого пароля и хранить параметры алгоритма, чтобы проверка могла повторить вычисление. Секретным должен оставаться сам пароль; дополнительный pepper, если используется, хранят отдельно.</p></div>
</details>
</div>
<div class="clarification-item" id="question-182-followup-2" data-parent-question="question-182">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Чем отличаются bcrypt, scrypt и argon2?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">bcrypt использует адаптивную стоимость вычисления и ограничивает длину входа; scrypt специально требует существенной памяти и вычислений; Argon2id также настраивает память, время и параллелизм и сочетает защиту от разных способов перебора. Во всех случаях нужны уникальная соль и подбор параметров по допустимой задержке сервиса.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-183">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>183.</strong> Когда нужно сравнение за постоянное время?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>При сравнении секретов, например токенов или MAC, время ответа не должно зависеть от позиции первого несовпадающего байта. В Go для подходящих байтовых последовательностей используют crypto/subtle.ConstantTimeCompare. Нужно также продумать проверку длины и другие ветви обработки, иначе общий ответ всё равно может утекать по времени.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(2)</small></h3>
<div class="clarification-item" id="question-183-followup-1" data-parent-question="question-183">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему обычное сравнение может быть небезопасным?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Обычное сравнение может завершаться на первом несовпавшем байте, поэтому время выполнения зависит от длины общего префикса. При доступном злоумышленнику точном измерении это создаёт побочный канал для секретов, например MAC или токена. Для секретных значений используют сравнение с постоянным временем и не раскрывают детали ошибок.</p></div>
</details>
</div>
<div class="clarification-item" id="question-183-followup-2" data-parent-question="question-183">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как ConstantTimeCompare предотвращает тайминговые атаки?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">crypto/subtle.ConstantTimeCompare сравнивает байты одинаковой длины без раннего выхода при первом несовпадении и возвращает 1 при равенстве. При различной длине функция возвращает 0 сразу, поэтому выбор длины и остальная логика проверки тоже должны учитывать утечки времени. Одна функция не делает весь протокол автоматически безопасным.</p></div>
</details>
</div>
</div>
</article>`;
