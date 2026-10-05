window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["network/kubernetes"] = `<article class="question-card" id="question-38">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>38.</strong> В чем разница между реализациями сетевого прокси в Kubernetes: iptables vs IPVS vs eBPF (Cilium)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Сравнение:</strong></p>
<ul>
  <li><strong>iptables:</strong> линейный перебор цепочек правил. При десятках тысяч сервисов ядро тратит до 30% CPU на обновление и проверку правил ($O(N)$).</li>
  <li><strong>IPVS:</strong> использует хэш-таблицы ($O(1)$), держит миллионы соединений, поддерживает балансировку (rr, lc, wlc).</li>
  <li><strong>eBPF (Cilium):</strong> байпасит подсистему conntrack и iptables вообще. Программы eBPF отрабатывают прямо на сокетах (sockops) или в драйвере сетевой карты (XDP), обеспечивая околонулевой оверхед.</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-39">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>39.</strong> В кластере K8s внезапно подскочили задержки DNS-запросов. В чем суть проблемы ndots:5 в /etc/resolv.conf?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> По умолчанию в K8s поды имеют параметр <code>options ndots:5</code>. Если в имени меньше 5 точек, libc сначала перебирает все search-домены кластера:</p>
<pre><code class="language-text">api.stripe.com -> api.stripe.com.default.svc.cluster.local -> 
api.stripe.com.svc.cluster.local -> api.stripe.com.cluster.local -> api.stripe.com</code></pre>
<p>В итоге на каждый внешний запрос CoreDNS получает 4 лишних запроса. Решение: ставить точку на конце имени (<code>api.stripe.com.</code>), снижать <code>ndots:2</code> или использовать NodeLocal DNSCache.</p>
        </div>
</details>

</article>`;

window.InterviewProContent["network/kubernetes"] += window.InterviewProBuildCards("network/kubernetes", [
  {
    "id": 475,
    "title": "Зачем нужен Service и как он выбирает Pod через selector и EndpointSlice? Чем отличаются port, targetPort и nodePort?",
    "answer": "**Ответ:** Service предоставляет стабильную точку обращения к меняющемуся набору Pod. Для Service с selector контроллер формирует EndpointSlice с адресами и состоянием endpoints; сетевой dataplane направляет трафик к подходящим адресам.\n\n`port` — порт Service, `targetPort` — порт приложения в Pod, `nodePort` — выделенный порт на нодах для соответствующего типа Service. `targetPort` может ссылаться на именованный порт контейнера. Selector не проверяет, действительно ли приложение слушает нужный порт. [Service](https://kubernetes.io/docs/concepts/services-networking/service/).",
    "markdown": true
  },
  {
    "id": 476,
    "title": "Когда использовать ClusterIP, NodePort, LoadBalancer или headless Service? Как сервис обнаруживается через DNS?",
    "answer": "**Ответ:** ClusterIP даёт виртуальный адрес внутри кластера. NodePort публикует сервис через порт ноды. LoadBalancer запрашивает внешнюю балансировку у доступной реализации. Headless (`clusterIP: None`) не выделяет виртуальный IP и позволяет обнаруживать отдельные endpoints.\n\nDNS-имя обычно имеет вид `service.namespace.svc.<cluster-domain>`: для обычного Service оно указывает на ClusterIP, для headless — на адреса endpoints по правилам публикации. Внешний балансировщик требует поддержки окружения, а не возникает только от записи `type`. [Service](https://kubernetes.io/docs/concepts/services-networking/service/).",
    "markdown": true
  },
  {
    "id": 477,
    "title": "Чем Service отличается от Ingress и Gateway API? Зачем нужны соответствующие контроллеры и где завершается TLS?",
    "answer": "**Ответ:** Service в основном предоставляет доступ к набору endpoints на транспортном уровне. Ingress описывает HTTP(S)-маршрутизацию по host/path. Gateway API разделяет инфраструктурный gateway и маршруты, поддерживая более выразимые политики и роли.\n\nДля реализации правил нужен контроллер: сами API-объекты трафик не проксируют. TLS может завершаться на внешнем балансировщике/gateway либо проходить до backend — это определяется настройкой и поддержкой реализации. После TLS termination соединение к приложению настраивают отдельно.",
    "markdown": true
  },
  {
    "id": 479,
    "title": "Как проверить путь запроса от внешнего клиента до Go-приложения, если Pod работает, но Service не отвечает? Как влияют неверный selector, порт и привязка приложения к 127.0.0.1?",
    "answer": "**Ответ:** Проверяют цепочку: внешний балансировщик → маршрут Ingress/Gateway → Service → EndpointSlice → IP и порт Pod → приложение. Сначала проверяют наличие готовых endpoints, selector и `targetPort`, затем доступность Pod из другого Pod и сетевые политики.\n\n```bash\nkubectl get svc,endpointslices,pods -n app\nkubectl describe svc api -n app\nkubectl logs deployment/api -n app\n```\n\nGo-сервер на `127.0.0.1:8080` принимает соединения только внутри сетевого пространства Pod. Для обращения через Pod IP обычно слушают `:8080`. Running не означает Ready.",
    "markdown": true
  },
  {
    "id": 480,
    "title": "Как работают NetworkPolicy для входящего и исходящего трафика? Как разрешить только обращения к БД и DNS и от чего зависит применение политики?",
    "answer": "**Ответ:** NetworkPolicy выбирает Pod и разрешает ingress/egress по источникам, назначениям и портам. Если Pod изолирован для направления, разрешения нескольких политик складываются; для соединения должны быть разрешены исходящий трафик источника и входящий трафик получателя, если они изолированы.\n\nОбычно начинают с default deny и разрешают БД по нужным selectors/порту, а DNS — к реальному resolver по UDP/TCP 53. Политики исполняет поддерживающая их сетевая реализация. Стандартная NetworkPolicy не фильтрует произвольные URL или HTTP-пути. [NetworkPolicy](https://kubernetes.io/docs/concepts/services-networking/network-policies/).",
    "markdown": true
  }
]);
