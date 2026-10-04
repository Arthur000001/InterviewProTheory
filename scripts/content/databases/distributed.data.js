window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["databases/distributed"] = `<article class="question-card" id="question-89">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>89.</strong> Чем синхронная репликация отличается от асинхронной и полусинхронной, и в чем компромисс между производительностью и надежностью (RPO/RTO)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong></p>
<ul>
  <li><strong>Асинхронная:</strong> Master подтверждает клиенту коммит сразу, не дожидаясь реплики. Быстро, но при аварии возможна потеря данных (RPO > 0).</li>
  <li><strong>Синхронная:</strong> Master ждет записи на реплику перед подтверждением клиенту. Медленнее (задержка сети), но нулевая потеря данных (RPO = 0).</li>
</ul>
        </div>
</details>

</article>`;

window.InterviewProContent["databases/distributed"] += window.InterviewProBuildCards("databases/distributed", [
  {
    "id": 497,
    "title": "Чем физическая репликация отличается от логической? Как replication lag влияет на чтение после записи, а replication slots — на удержание WAL?",
    "answer": "**Ответ:** Физическая репликация передаёт WAL для воспроизведения изменений кластера на уровне хранения. Логическая передаёт изменения опубликованных таблиц в терминах данных; она позволяет избирательность, но требует управления совместимостью схем и не переносит автоматически все объекты, например DDL.\n\nПри отставании реплики чтение после записи может вернуть старые данные: критическое чтение направляют на primary либо ждут применения нужной позиции. Replication slot удерживает необходимые записи WAL; забытый или медленный потребитель способен заполнить диск, поэтому контролируют lag и удерживаемый объём.",
    "markdown": true
  }
]);
