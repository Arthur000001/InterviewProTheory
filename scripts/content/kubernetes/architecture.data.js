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
