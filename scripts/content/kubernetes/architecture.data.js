window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["kubernetes/architecture"] = `<article class="question-card" id="question-61">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>61.</strong> Анатомия развертывания: что происходит по шагам в кластере с момента 'kubectl apply -f deployment.yaml' до готовности пода отвечать на трафик?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Полный цикл жизни объекта:</strong></p>
<ol>
  <li><strong>kube-apiserver:</strong> Authentication (сертификат/токен) -> Authorization (RBAC) -> Mutating Webhook -> Валидация схемы -> Validating Webhook -> Сохранение в <strong>etcd</strong>.</li>
  <li><strong>Deployment Controller:</strong> видит изменение через Informer, создает объект <strong>ReplicaSet</strong>.</li>
  <li><strong>ReplicaSet Controller:</strong> создает объекты <strong>Pod</strong> с пустым полем <code>nodeName</code> (статус Pending).</li>
  <li><strong>kube-scheduler:</strong> фильтрует подходящие ноды (Taints, NodeAffinity, Resources) -> скорит ноды -> биндит под (записывает имя ноды в etcd).</li>
  <li><strong>kubelet на ноде:</strong> замечает под -> вызывает CRI (containerd) -> вызывает CNI (Cilium) для сети -> вызывает CSI для томов -> запускает контейнеры.</li>
  <li><strong>Probes:</strong> проходят Startup/Readiness проверки -> Pod попадает в Endpoints/EndpointSlice сервиса -> трафик пошел.</li>
</ol>
        </div>
</details>

</article>
<article class="question-card" id="question-63">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>63.</strong> Зачем нужен Kubelet?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> Главный агент на каждой рабочей ноде K8s. Он общается с kube-apiserver, отслеживает спецификации Pod'ов, назначенных на его узел, управляет их жизненным циклом через CRI (containerd), монтирует тома через CSI, следит за здоровьем контейнеров (Liveness/Readiness probes) и отправляет статус ноды обратно в Control Plane.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-64">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>64.</strong> Какие механизмы позволяют управлять размещением pod по узлам?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Механизмы:</strong></p>
<ul>
  <li><code>nodeSelector</code> — простейшая привязка по лейблам ноды.</li>
  <li><code>nodeAffinity / nodeAntiAffinity</code> — гибкие правила (Hard: <code>requiredDuringScheduling...</code>, Soft: <code>preferredDuringScheduling...</code>).</li>
  <li><code>podAntiAffinity</code> — запрет запуска реплик одного сервиса на одной ноде/зоне.</li>
  <li><code>Taints & Tolerations</code> — отталкивание подов (например, выделенные ноды для GPU).</li>
  <li><code>topologySpreadConstraints</code> — равномерное распределение по датацентрам/зонам.</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-65">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>65.</strong> Какой компонент kubernetes хранит состояние ресурсов кластера?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Ответ:</strong> <strong>etcd</strong> — распределенное, транзакционное, строго консистентное key-value хранилище на базе алгоритма консенсуса Raft. Ни один компонент K8s не общается с etcd напрямую, кроме <code>kube-apiserver</code>.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-66">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>66.</strong> Какой ресурс kubernetes нужен, чтобы экземпляры pod запустились на всех нодах кластера?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Ответ:</strong> <strong>DaemonSet</strong>. Гарантирует, что ровно один экземпляр пода запускается на каждом узле (или на узлах, удовлетворяющих селекторам). Применяется для CNI-агентов (Cilium, Calico), сборщиков логов (Promtail, Fluentbit) и мониторинга (node-exporter).</p>
        </div>
</details>

</article>
<article class="question-card" id="question-67">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>67.</strong> Какой механизм используется в kubernetes для написания своих собственных scheduler’ов?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Ответ:</strong></p>
<ol>
  <li><strong>Scheduler Framework (рекомендуемый):</strong> плагины на Go, компилируемые в планировщик, которые встраиваются в точки расширения (QueueSort, Filter, PreFilter, Score, Reserve, Permit, PreBind, Bind).</li>
  <li>Запуск второго бинарника <code>kube-scheduler</code> с флагом <code>--scheduler-name=my-scheduler</code> и указанием поля <code>spec.schedulerName: my-scheduler</code> в Pod.</li>
</ol>
        </div>
</details>

</article>
<article class="question-card" id="question-68">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>68.</strong> В каком порядке выполняются admission hooks и почему?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Порядок:</strong></p>
<ol>
  <li>Сначала <strong>Mutating Admission Webhooks</strong> (могут изменять, подставлять сайдкары, лейблы, дефолтные лимиты).</li>
  <li>Затем валидация схемы в API server.</li>
  <li>В конце <strong>Validating Admission Webhooks</strong> (проверяют финальный результат и дают отказ или разрешение).</li>
</ol>
<p><strong>Почему:</strong> Мутирующие хуки должны отработать первыми, чтобы валидирующие хуки проверяли уже окончательное, полностью сформированное состояние объекта.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-71">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>71.</strong> Как устроен etcd в Kubernetes? Что такое кворум и что произойдет с кластером из 3 master-нод, если откажут 1 нода или 2 ноды?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> etcd использует консенсус Raft. Формула кворума: $Q = \\lfloor N/2 \\rfloor + 1$. Для 3 нод кворум равен 2 ноды.</p>
<ul>
  <li><strong>Отказ 1 ноды (осталось 2 из 3):</strong> кворум есть ($2 \\ge 2$). Кластер работает в штатном режиме на чтение и запись.</li>
  <li><strong>Отказ 2 нод (осталась 1 из 3):</strong> кворум потерян ($1 &lt; 2$). Кластер переходит в Read-Only режим. Новые поды и изменения применить невозможно до восстановления второй ноды.</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-74">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>74.</strong> Что такое Kubernetes Operator pattern? Из каких компонентов он состоит (CRD, Reconcile loop, Informers, WorkQueue)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> Паттерн автоматизации операторской работы с помощью программного агента. Состоит из:</p>
<ol>
  <li><strong>CRD (Custom Resource Definition):</strong> схема конфигурации нашего сервиса в K8s.</li>
  <li><strong>Informer:</strong> локальный кэш, слушающий события Watch от apiserver.</li>
  <li><strong>WorkQueue:</strong> очередь задач на обработку с дедупликацией и ретраями.</li>
  <li><strong>Reconcile Loop:</strong> цикл согласования, сравнивающий реальное состояние (Actual State) с желаемым (Desired State) и устраняющий расхождения.</li>
</ol>
        </div>
</details>

</article>
<article class="question-card" id="question-80">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>80.</strong> В чем разница между традиционным Ingress-контроллером и Kubernetes Gateway API?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> Ingress — единый монолитный ресурс с ограниченной семантикой (приходилось писать миллион вендорных аннотаций <code>nginx.ingress.kubernetes.io/...</code>).</p>
<p>Gateway API — современная замена с разделением ролей: инфраструктурщик настраивает <code>GatewayClass</code> и <code>Gateway</code>, а разработчик управляет независимыми ресурсами маршрутизации (<code>HTTPRoute</code>, <code>GRPCRoute</code>, <code>TCPRoute</code>) с нативной поддержкой канареечного деления весов трафика.</p>
        </div>
</details>

</article>`;
