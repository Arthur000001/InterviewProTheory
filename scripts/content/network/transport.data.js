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
`;
