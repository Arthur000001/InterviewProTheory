window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["network/transport"] = `<article class="question-card" id="question-30">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>30.</strong> Чем отличается UDP от TCP?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong></p>
<ul>
  <li><strong>TCP:</strong> надежный, с установлением соединения (3-way handshake SYN-SYN/ACK-ACK), гарантирует порядок доставки, повтор потерянных пакетов, контроль перегрузки (congestion control).</li>
  <li><strong>UDP:</strong> ненадежный, без установки соединения, шлет дейтаграммы «как есть» без гарантии доставки и порядка, с минимальным оверхедом и задержкой (DNS, VoIP, QUIC/HTTP3).</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-31">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>31.</strong> Как узнать MAC-адрес у публичного DNS-сервера 8.8.8.8?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Ответ с подвохом:</strong> <strong>Никак напрямую.</strong></p>
<p>MAC-адрес работает только на канальном уровне (L2) в пределах локального широковещательного сегмента. Пакет к 8.8.8.8 уйдет на MAC-адрес вашего <strong>Default Gateway (шлюза по умолчанию)</strong>, который определяется по ARP: <code>ip neigh show</code> или <code>arp -n</code>.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-32">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>32.</strong> Как на одном порту запустить два приложения?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Варианты:</strong></p>
<ol>
  <li>Слушать на <strong>разных IP-адресах</strong> (например, <code>127.0.0.1:80</code> и <code>192.168.1.10:80</code>).</li>
  <li>Один слушает <strong>TCP</strong>, а второй <strong>UDP</strong> на том же порту (стеки независимы).</li>
  <li>В Linux использовать опцию сокета <strong><code>SO_REUSEPORT</code></strong> (ядро будет балансировать входящие соединения между процессами).</li>
</ol>
        </div>
</details>

</article>
<article class="question-card" id="question-33">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>33.</strong> Что может поменяться в IP-пакете при прохождении маршрутизатора без NAT?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Меняется:</strong></p>
<ul>
  <li>Поле <strong>TTL (Time to Live)</strong> — уменьшается на 1 на каждом хопе (защита от зацикливания).</li>
  <li><strong>Checksum (контрольная сумма заголовка)</strong> — пересчитывается из-за изменения TTL.</li>
  <li>На канальном уровне (L2) <strong>полностью меняются MAC-адреса</strong> источника и назначения.</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-34">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>34.</strong> Что будет с UDP-пакетом, если он больше, чем MTU?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong></p>
<ul>
  <li>Если флаг <strong>DF (Don't Fragment) = 0</strong>: пакет будет фрагментирован маршрутизатором/хостом на фрагменты размером с MTU. При потере одного фрагмента теряется весь UDP-пакет.</li>
  <li>Если флаг <strong>DF = 1</strong>: маршрутизатор сбросит пакет и вернет ICMP-ответ <em>Fragmentation Needed</em> (Type 3, Code 4).</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-36">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>36.</strong> В чем разница между состояниями TCP сокетов TIME_WAIT и CLOSE_WAIT? О какой ошибке в коде приложения говорит накопление CLOSE_WAIT?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong></p>
<ul>
  <li><strong>TIME_WAIT:</strong> сокет закрыла локальная сторона (Active Close). Ждет 2*MSL (обычно 60 сек), чтобы убедиться, что удаленная сторона получила финальный ACK. Нормальное состояние.</li>
  <li><strong>CLOSE_WAIT:</strong> удаленная сторона закрыла соединение (пришел FIN), а наше приложение <strong>не вызвало <code>close(socket)</code></strong>. Накопление CLOSE_WAIT — это <strong>100% баг в коде</strong> (утечка сокетов / дескрипторов).</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-37">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>37.</strong> Что такое MTU Blackhole и почему в оверлейных сетях Kubernetes (VXLAN, Geneve, Calico, Cilium) часто снижают MTU (например, до 1450)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> Оверлейные протоколы (VXLAN, Geneve) добавляют свой заголовок (до 50 байт). Если физический MTU равен 1500, то внутренний MTU должен быть не более 1450. Если приложение шлет пакеты 1500 с флагом DF=1, а ICMP «Fragmentation Needed» заблокирован фаерволом — пакеты молча дропаются. Это и есть <strong>MTU Blackhole</strong>.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-41">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>41.</strong> Что такое TCP Keep-Alive и SO_REUSEPORT, для чего они применяются в высоконагруженных сетевых сервисах?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong></p>
<ul>
  <li><strong>TCP Keep-Alive:</strong> периодическая отправка пустых пакетов для проверки живого состояния соединения и предотвращения сброса NAT-таблиц промежуточными файрволами.</li>
  <li><strong>SO_REUSEPORT:</strong> позволяет нескольким процессам/потокам слушать один и тот же TCP/UDP порт. Ядро берет на себя балансировку входящих соединений по ядрам CPU без блокировок.</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-42">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>42.</strong> Как работает протокол BGP и MetalLB / Cilium BGP Control Plane для анонсирования адресов сервисов LoadBalancer в локальной сети?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> Ноды кластера устанавливают BGP-сессию с физическими Top-of-Rack коммутаторами сети датацентра (BGP Peers). При создании Service <code>type: LoadBalancer</code> CNI (Cilium/MetalLB) анонсирует внешний IP сервиса как маршрут через IP нод кластера. Коммутатор распределяет трафик с помощью ECMP (Equal-Cost Multi-Path).</p>
        </div>
</details>

</article>
<article class="question-card" id="question-43">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>43.</strong> Чем различаются протоколы TCP и UDP?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer"><p>TCP устанавливает соединение и предоставляет упорядоченный поток байтов с повторной передачей, управлением потоком и перегрузкой. UDP передаёт отдельные датаграммы без гарантии доставки, порядка или отсутствия дублей; нужные гарантии приложение реализует само. UDP поддерживает broadcast и multicast, а реальная задержка зависит от протокола приложения и сети. TCP-сервер выполняет bind/listen/accept, клиент — connect, после чего стороны обмениваются данными.</p></div>

  
  
  
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(6)</small></h3>
<div class="clarification-item" id="question-43-followup-1" data-parent-question="question-43">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему UDP быстрее?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">UDP не устанавливает соединение и не выполняет подтверждение или повторную передачу на транспортном уровне, поэтому его накладные расходы и задержка могут быть ниже. Это не гарантия большей скорости приложения: надёжность и контроль перегрузки при необходимости реализуют выше.</p></div>
</details>
</div>
<div class="clarification-item" id="question-43-followup-2" data-parent-question="question-43">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое handshake в TCP?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">TCP обычно начинает соединение обменом SYN, SYN-ACK, ACK. Стороны согласуют начальные номера последовательности и параметры соединения, после чего можно передавать данные.</p></div>
</details>
</div>
<div class="clarification-item" id="question-43-followup-3" data-parent-question="question-43">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что происходит при потере пакета?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">TCP обнаруживает потерю по подтверждениям и таймерам и повторно передаёт недоставленные данные; порядок байтов сохраняется. UDP сам не восстанавливает пакет — приложение либо допускает потерю, либо реализует собственное восстановление.</p></div>
</details>
</div>
<div class="clarification-item" id="question-43-followup-4" data-parent-question="question-43">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Зачем нужен UDP, если он не гарантирует доставку?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">UDP нужен там, где важны низкая задержка, простое сообщение без соединения или собственный протокол поверх UDP: DNS, медиапотоки, игровые пакеты, QUIC. Отсутствие встроенных подтверждений даёт свободу, но не делает UDP автоматически быстрее во всех условиях.</p></div>
</details>
</div>
<div class="clarification-item" id="question-43-followup-5" data-parent-question="question-43">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Зачем нужен TCP, если он добавляет накладные расходы?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">TCP выбирают, когда нужен упорядоченный надёжный поток байтов с контролем перегрузки и повторной передачей. Накладные расходы оправданы для большинства веб-запросов, файлов и транзакций; задержка зависит от сети и приложения.</p></div>
</details>
</div>
<div class="clarification-item" id="question-43-followup-6" data-parent-question="question-43">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Где применяется udp??</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">UDP выбирают там, где важны низкая задержка или собственное управление потерями: DNS, голос и видео в реальном времени, игры и некоторые транспортные протоколы. UDP не подтверждает доставку и не гарантирует порядок; нужные гарантии добавляет приложение.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-45">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>45.</strong> Как BitTorrent доставляет данные поверх UDP, если UDP не гарантирует доставку?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>BitTorrent может работать через TCP или через uTP поверх UDP. В uTP надёжность реализована выше UDP: получатель подтверждает пакеты, потерянные данные отправляются повторно, а блоки файла проверяются по хешам. Сам UDP ни порядок, ни доставку не обеспечивает.</p>
        </div>
</details>

</article>`;
