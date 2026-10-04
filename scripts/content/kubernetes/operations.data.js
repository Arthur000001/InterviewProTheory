window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["kubernetes/operations"] = `<article class="question-card" id="question-62">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>62.</strong> Почему namespace может висеть в статусе Terminating?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Причины:</strong></p>
<ol>
  <li>В неймспейсе остались ресурсы с неудаляемыми <strong>Finalizers</strong> (например, PV/PVC, кастомные CRD, блокирующие удаление).</li>
  <li>Недоступен Custom Metrics API сервис или агрегированный API-сервер (APIService).</li>
</ol>
<pre><code class="language-bash"># Найти застрявшие ресурсы:
$ kubectl api-resources --verbs=list --namespaced -o name | xargs -n 1 kubectl get --show-kind --ignore-not-found -n &lt;ns&gt;</code></pre>
        </div>
</details>

</article>
<article class="question-card" id="question-72">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>72.</strong> Как происходит Graceful Shutdown пода при обновлении Deployment (RollingUpdate)? Какова роль preStop hook, SIGTERM и задержки удаления из Endpoints?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть процесса:</strong></p>
<ol>
  <li>Удаление пода из Endpoints происходит <strong>асинхронно</strong> и занимает пару секунд (пока iptables/eBPF обновятся на всех нодах).</li>
  <li>Если приложение сразу упадет по SIGTERM, клиенты получат 502/TCP Reset.</li>
  <li>Поэтому необходим <code>preStop hook: sleep 5..10</code>. Пока он спит, трафик перестает течь на под. Затем шлется <code>SIGTERM</code>, приложение закрывает соединения и завершается чисто.</li>
</ol>
        </div>
</details>

</article>
<article class="question-card" id="question-79">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>79.</strong> Что такое Finalizers в Kubernetes и как они могут заблокировать удаление ресурсов?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> Список строк в метаданных ресурса (<code>metadata.finalizers</code>), сообщающий K8s: «не удаляй объект из etcd, пока соответствующий контроллер не выполнит очистку внешних ресурсов» (например, отмонтирование EBS-диска в AWS).</p>
<p>Если контроллер упал или завис, объект навечно зависает со статусом <code>DeletionTimestamp</code>. Принудительное удаление: очистить массив finalizers через patch.</p>
        </div>
</details>

</article>`;
