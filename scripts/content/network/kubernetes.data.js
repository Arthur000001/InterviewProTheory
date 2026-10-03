window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["network/kubernetes"] = `<article class="question-card" id="question-29">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>29.</strong> Жизнь сетевого пакета в Kubernetes (Life of a Packet): как проходит запрос от внешнего клиента через DNS, Ingress, Service ClusterIP, iptables/eBPF до сетевого неймспейса пода и обратно?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть сквозного пути пакета:</strong></p>
<ol>
  <li><strong>Вход:</strong> Клиент шлет запрос на внешний IP (LoadBalancer/BGP). Трафик приходит на ноду.</li>
  <li><strong>Ingress Controller:</strong> Nginx/Envoy терминирует TLS, смотрит Host/Path и резолвит имя бэкенда через CoreDNS.</li>
  <li><strong>Service (ClusterIP):</strong> У ClusterIP нет сетевого интерфейса. Ядро (iptables DNAT или Cilium eBPF) на выходе перехватывает пакет и подменяет IP назначения на реальный Pod IP из Endpoints.</li>
  <li><strong>Межнодовая доставка:</strong> Пакет инкапсулируется в VXLAN/Geneve (оверлей со сниженным MTU) либо летит напрямую по BGP-маршруту.</li>
  <li><strong>Под:</strong> Пакет попадает через <code>veth-пару</code> в сетевой namespace пода, читается рантаймом Go через epoll и обрабатывается горутиной.</li>
</ol>
        </div>
</details>

</article>
<article class="question-card" id="question-35">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>35.</strong> Что происходит по шагам, когда сервис внутри Kubernetes делает запрос к other-service.default.svc.cluster.local?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Шаги:</strong></p>
<ol>
  <li>Клиент запрашивает DNS у CoreDNS (10.96.0.10) и получает виртуальный ClusterIP (например, 10.96.15.20).</li>
  <li>Клиент отправляет TCP SYN на этот IP.</li>
  <li>Сетевой стек ноды перехватывает пакет (iptables DNAT или eBPF в Cilium) и подменяет ClusterIP на IP конкретного пода (например, 10.244.2.14).</li>
  <li>Пакет уходит в интерфейс CNI и доставляется целевому поду.</li>
</ol>
        </div>
</details>

</article>
<article class="question-card" id="question-38">
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
