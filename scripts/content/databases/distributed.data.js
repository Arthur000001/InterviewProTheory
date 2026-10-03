window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["databases/distributed"] = `<article class="question-card" id="question-81">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>81.</strong> Что такое Quorum и какие есть алгоритмы консенсуса?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> Кворум — минимальное число голосов узлов распределенной системы для принятия валидного решения без риска Split-Brain ($N/2 + 1$).</p>
<ul>
  <li><strong>Raft:</strong> понятный алгоритм с выделенным лидером (используется в etcd, Consul).</li>
  <li><strong>Paxos:</strong> классический фундамент консенсуса (сложнее в реализации).</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-84">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>84.</strong> Как устроен CSI (Container Storage Interface) в Kubernetes? Чем отличаются режимы доступа ReadWriteOnce (RWO) и ReadWriteMany (RWX)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> CSI — открытый стандарт плагинов блочного и файлового хранилища.</p>
<ul>
  <li><strong>RWO (ReadWriteOnce):</strong> том может быть смонтирован на чтение и запись <strong>только к одной ноде кластера</strong> (типично для облачных дисков AWS EBS, GCP PD, Ceph RBD).</li>
  <li><strong>RWX (ReadWriteMany):</strong> том монтируется одновременно на чтение и запись <strong>множеству нод</strong> (сетевые ФС: NFS, CephFS, GlusterFS).</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-85">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>85.</strong> Что такое проблема Split-Brain в распределенных системах и кластерах баз данных, и как от нее защититься?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> Сетевое разделение (Network Partition), при котором обе изолированные половины кластера считают себя живыми и выбирают двух независимых лидеров (Master). Это ведет к неконсистентности и потере данных.</p>
<p><strong>Защита:</strong> строгий кворум (строго нечетное число узлов, запись разрешена только большинству $N/2 + 1$) и механизм Fencing / STONITH (Shoot The Other Node In The Head).</p>
        </div>
</details>

</article>
<article class="question-card" id="question-89">
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
