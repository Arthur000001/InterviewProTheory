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
<article class="question-card" id="question-69">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>69.</strong> Как проверить права пользователя на действия в кластере, несмотря на RoleBinding?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Ответ:</strong> С помощью команды <strong><code>kubectl auth can-i</code></strong> (использует API-ресурс <code>SelfSubjectAccessReview</code>).</p>
<pre><code class="language-bash">$ kubectl auth can-i create deployments --namespace=prod
# Проверка прав другого пользователя/сервисаккаунта от лица админа:
$ kubectl auth can-i delete pods --as=developer --namespace=dev</code></pre>
        </div>
</details>

</article>
<article class="question-card" id="question-70">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>70.</strong> В чем разница между StartupProbe, LivenessProbe и ReadinessProbe? Что произойдет, если зафейлится Readiness, а что — если Liveness?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Разница:</strong></p>
<ul>
  <li><strong>StartupProbe:</strong> дает время тяжелым сервисам прогреться. Пока она не прошла, Liveness и Readiness не опрашиваются.</li>
  <li><strong>ReadinessProbe:</strong> проверяет готовность принимать трафик. При падении <strong>под исключается из Endpoints</strong> (трафик не идет), но контейнер <strong>НЕ перезапускается</strong>.</li>
  <li><strong>LivenessProbe:</strong> проверяет живость процесса. При падении kubelet <strong>принудительно перезапускает контейнер</strong>.</li>
</ul>
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
<article class="question-card" id="question-73">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>73.</strong> Под завис в статусе CrashLoopBackOff, OOMKilled или Pending. Как по шагам диагностировать причину для каждого статуса?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Диагностика:</strong></p>
<ul>
  <li><strong>Pending:</strong> <code>kubectl describe pod &lt;name&gt;</code> -> блок Events. Смотреть причину от Scheduler (нехватка CPU/RAM, Taints, нет свободного PVC).</li>
  <li><strong>CrashLoopBackOff:</strong> <code>kubectl logs &lt;name&gt; --previous</code> (покажет лог перед падением) и <code>describe pod</code> (код выхода Exit Code).</li>
  <li><strong>OOMKilled:</strong> в <code>kubectl describe pod</code> статус <code>Last State: Terminated, Reason: OOMKilled, Exit Code: 137</code>. Процесс превысил память <code>limits.memory</code>.</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-75">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>75.</strong> В чем разница между Resource Requests и Limits в Kubernetes, и как они транслируются в cgroups (cpu.shares, cfs_quota, memory.limit)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Трансляция в cgroups:</strong></p>
<ul>
  <li><code>requests.cpu</code> -> <code>cpu.shares</code> (вес процесса при конкуренции за CPU). Планировщик использует requests для поиска ноды.</li>
  <li><code>limits.cpu</code> -> <code>cpu.cfs_quota_us</code> / <code>cpu.max</code> (жесткое ограничение процессорного времени, приводит к троттлингу).</li>
  <li><code>requests.memory</code> -> гарантия памяти при планировании.</li>
  <li><code>limits.memory</code> -> <code>memory.limit_in_bytes</code> / <code>memory.max</code>. При превышении ядро сразу вызывает OOM Killer.</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-76">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>76.</strong> Нода Kubernetes перешла в статус NotReady. Каков пошаговый алгоритм диагностики на самой ноде и через kube-apiserver?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Алгоритм:</strong></p>
<ol>
  <li>Снаружи: <code>kubectl describe node &lt;node-name&gt;</code> (проверить флаги DiskPressure, MemoryPressure, PIDPressure, условия Ready).</li>
  <li>На самой ноде: проверить демон kubelet: <code>systemctl status kubelet</code> и логи <code>journalctl -u kubelet -e --no-pager</code>.</li>
  <li>Проверить рантайм: <code>systemctl status containerd</code>.</li>
  <li>Проверить свободное место на диске (<code>df -h</code>, <code>df -i</code>) и память (<code>free -m</code>).</li>
</ol>
        </div>
</details>

</article>
<article class="question-card" id="question-77">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>77.</strong> Как безопасно управлять секретами в Kubernetes при использовании GitOps (Vault, External Secrets Operator, SOPS, Sealed Secrets)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Подходы:</strong> В Git нельзя коммитить открытый base64. Используют:</p>
<ul>
  <li><strong>External Secrets Operator (ESO):</strong> K8s-оператор, забирающий секреты из HashiCorp Vault / AWS Secrets Manager и создающий Secret в кластере.</li>
  <li><strong>Mozilla SOPS:</strong> шифрует значения в yaml PGP-ключом или через KMS (AWS/GCP/Yandex). Зашифрованный файл безопасно лежит в Git.</li>
  <li><strong>Sealed Secrets (Bitnami):</strong> шифрование асимметричным ключом кластера.</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-78">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>78.</strong> Как работают Horizontal Pod Autoscaler (HPA) и Vertical Pod Autoscaler (VPA), и почему их опасно использовать одновременно по метрике CPU/Memory?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> HPA меняет количество реплик по нагрузке. VPA меняет Requests/Limits существующего пода (перезапуская его).</p>
<p><strong>Опасность:</strong> Если оба настроены на одну метрику (CPU), возникнет гонка: при всплеске нагрузки HPA добавит подов, а VPA параллельно начнет их рестартовать с большими ресурсами, вызвав шторм рестартов и деградацию сервиса.</p>
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
