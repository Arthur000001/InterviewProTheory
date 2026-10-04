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

window.InterviewProContent["kubernetes/operations"] += window.InterviewProBuildCards("kubernetes/operations", [
  {
    "id": 471,
    "title": "Чем Job отличается от CronJob? Как работают повторы, ограничение времени выполнения и concurrencyPolicy?",
    "answer": "**Ответ:** Job запускает работу до заданного успешного завершения; CronJob создаёт Job по расписанию. `backoffLimit` ограничивает повторы, `activeDeadlineSeconds` — время работы Job; `parallelism` и `completions` задают параллелизм и число успешных выполнений.\n\nУ CronJob `concurrencyPolicy` задаёт `Allow`, `Forbid` или `Replace` для его собственных запусков. Возможны повторные и пропущенные запуски, поэтому побочные эффекты делают идемпотентными. Ограничение конкуренции одного CronJob не является глобальной блокировкой. [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/).",
    "markdown": true
  },
  {
    "id": 472,
    "title": "Для чего нужны init containers и sidecar-контейнеры? Как их жизненный цикл связан с основным приложением?",
    "answer": "**Ответ:** Обычные init containers последовательно выполняют подготовку и должны успешно завершиться до запуска основных контейнеров. Sidecar работает рядом с приложением: прокси, агент или сборщик данных.\n\nВстроенный sidecar задают в `initContainers` с `restartPolicy: Always`: после его старта могут запускаться следующие контейнеры, а при завершении Pod он останавливается после основных. Такой sidecar не мешает завершению Job. Исторический sidecar в обычном `containers` не обладает всеми этими гарантиями. [Sidecar containers](https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers/).",
    "markdown": true
  },
  {
    "id": 478,
    "title": "Чем ConfigMap отличается от Secret? Как передавать их через переменные окружения и файлы, и когда приложение увидит обновление?",
    "answer": "**Ответ:** ConfigMap хранит несекретную конфигурацию, Secret — чувствительные значения. Base64 в Secret — кодирование, не шифрование: нужны RBAC и настройка защиты хранения.\n\nПеременные окружения получают значения при запуске контейнера; для обновления нужен его перезапуск. Проецируемые файлы обычно обновляются с задержкой, но приложение должно перечитать их; монтирование через `subPath` автоматическое обновление не получает. Ротация файла сама по себе не обновляет уже созданный клиент БД. [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/).",
    "markdown": true
  },
  {
    "id": 481,
    "title": "Как связаны PV, PVC, StorageClass и CSI? Чем постоянное хранилище отличается от emptyDir и что происходит с данными после удаления Pod или PVC?",
    "answer": "**Ответ:** PVC — запрос приложения на хранилище, PV — ресурс тома, StorageClass — класс и параметры выделения, CSI — интерфейс драйвера для работы с системой хранения. PVC связывается с PV, часто созданным динамически.\n\n`emptyDir` существует в рамках Pod и переживает перезапуск контейнера, но удаляется вместе с Pod. Постоянный том может пережить Pod; удаление PVC запускает дальнейший жизненный цикл согласно reclaim policy (`Retain`/`Delete`) и защите используемых ресурсов. Для StatefulSet учитывают также политику удержания PVC. [Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/).",
    "markdown": true
  },
  {
    "id": 482,
    "title": "Зачем Pod нужен ServiceAccount? Чем Role/RoleBinding отличаются от ClusterRole/ClusterRoleBinding и как ограничить доступ приложения к Kubernetes API?",
    "answer": "**Ответ:** ServiceAccount задаёт identity workload при обращении к Kubernetes API. Role описывает разрешения в namespace; ClusterRole может описывать кластерные разрешения и переиспользоваться в namespace. RoleBinding выдаёт права в своём namespace, ClusterRoleBinding — на уровне кластера.\n\nПриложению выделяют отдельный ServiceAccount и только нужные verbs/resources; избегают wildcard и `cluster-admin`. Если доступ к API не нужен, отключают автоматическое монтирование токена. Наличие ServiceAccount не даёт прав на бизнес-объекты приложения.",
    "markdown": true
  }
]);
