window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["kubernetes/architecture"] = `<article class="question-card" id="question-63">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>63.</strong> Зачем нужен Kubelet?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> Главный агент на каждой рабочей ноде K8s. Он общается с kube-apiserver, отслеживает спецификации Pod'ов, назначенных на его узел, управляет их жизненным циклом через CRI (containerd), монтирует тома через CSI, следит за здоровьем контейнеров (Liveness/Readiness probes) и отправляет статус ноды обратно в Control Plane.</p>
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
`;

window.InterviewProContent["kubernetes/architecture"] += window.InterviewProBuildCards("kubernetes/architecture", [
  {
    "id": 467,
    "title": "Что такое Pod и чем он отличается от контейнера? Какие ресурсы разделяют контейнеры одного Pod и как они обращаются друг к другу?",
    "answer": "**Ответ:** Pod — минимальная единица размещения Kubernetes: один или несколько связанных контейнеров на одной ноде. Они разделяют сетевое пространство, IP и порты, поэтому обращаются друг к другу через `localhost`.\n\nОбщие данные передают через подключённые volumes; корневые файловые системы контейнеров остаются отдельными. Общее пространство процессов включается отдельно. Pod используют для тесно связанных компонентов, а независимые реплики приложения размещают в разных Pod. [Pods](https://kubernetes.io/docs/concepts/workloads/pods/).",
    "markdown": true
  },
  {
    "id": 468,
    "title": "Как связаны Deployment, ReplicaSet и Pod? Кто восстанавливает нужное число реплик после удаления Pod?",
    "answer": "**Ответ:** Deployment управляет ReplicaSet и обновлением шаблона приложения. ReplicaSet поддерживает нужное число Pod, соответствующих его selector. При удалении Pod именно контроллер ReplicaSet создаёт замену; новый Pod получает новый UID и может оказаться на другой ноде.\n\nKubelet перезапускает контейнеры внутри назначенного ему Pod согласно политике, но не отвечает за восстановление количества реплик Deployment. Для остановки приложения меняют желаемое число реплик либо удаляют управляющий объект.",
    "markdown": true
  },
  {
    "id": 469,
    "title": "Что происходит после создания Deployment через Kubernetes API? За что отвечают API server, scheduler и контроллеры?",
    "answer": "**Ответ:** API server аутентифицирует и авторизует запрос, выполняет проверки/admission и сохраняет объект в etcd. Deployment-controller создаёт ReplicaSet, его контроллер — Pod. Scheduler выбирает подходящую ноду для ещё не назначенного Pod и фиксирует назначение.\n\nKubelet на этой ноде через runtime запускает контейнеры, подключает необходимые ресурсы и сообщает статус. Компоненты согласуют состояние асинхронно: успешное создание Deployment ещё не означает готовность приложения.",
    "markdown": true
  },
  {
    "id": 470,
    "title": "Когда выбирать Deployment, StatefulSet или DaemonSet? Какие гарантии StatefulSet даёт относительно имён и хранилища, а какие задачи БД он не решает?",
    "answer": "**Ответ:** Deployment подходит взаимозаменяемым репликам stateless-приложения. StatefulSet даёт устойчивую идентичность реплик, упорядоченные операции согласно политике и отдельные PVC по шаблону. DaemonSet размещает Pod на каждой подходящей ноде, например агент логирования.\n\nStatefulSet не реализует репликацию БД, выбор лидера, backup и защиту от split brain. Эти задачи решает сама БД, оператор и эксплуатационные процедуры; устойчивое имя Pod не равно сохранности данных.",
    "markdown": true
  },
  {
    "id": 473,
    "title": "Как работают labels, selectors и namespaces? Почему namespace сам по себе не обеспечивает сетевую изоляцию?",
    "answer": "**Ответ:** Labels — метки объектов, selectors — условия выбора по меткам. По ним Service находит endpoints, а контроллеры — управляемые ресурсы. Namespace разделяет имена и область действия многих объектов, прав и квот; ноды и некоторые другие ресурсы остаются кластерными.\n\nNamespace сам не запрещает сетевые соединения между Pod. Для ограничения трафика нужны NetworkPolicy и поддерживающая их сетевая реализация; для доступа к API — RBAC.",
    "markdown": true
  },
  {
    "id": 474,
    "title": "Чем желаемое состояние объекта отличается от наблюдаемого? Что такое reconciliation и почему ручное удаление управляемого Pod не останавливает Deployment?",
    "answer": "**Ответ:** `spec` описывает желаемое состояние, `status` — наблюдаемое состояние, которое публикуют компоненты системы. Reconciliation — повторяющийся цикл сравнения и действий для устранения расхождения.\n\nЕсли в Deployment требуется три реплики, удаление одного Pod временно оставляет две. Контроллер создаст недостающую. Менять нужно источник желаемого состояния; при GitOps прямую правку объекта может дополнительно отменить контроллер доставки.",
    "markdown": true
  }
]);
