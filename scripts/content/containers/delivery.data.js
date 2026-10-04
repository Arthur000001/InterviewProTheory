window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["containers/delivery"] = `<article class="question-card" id="question-50">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>50.</strong> Путь от Git Push до продакшена (Zero Downtime GitOps): как устроен полный цикл сборки, тестирования, безопасной доставки через werf и раскатки в Kubernetes?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть пайплайна:</strong></p>
<ol>
  <li><strong>Git Push:</strong> разработчик коммитит в Git. CI запускает линтеры и тесты с детектором гонок (<code>go test -race</code>).</li>
  <li><strong>werf Build:</strong> multi-stage сборка с кэшированием слоев в Docker Registry; упаковка бинарника в <code>distroless/scratch</code> (размер ~20MB, без шелла и уязвимостей).</li>
  <li><strong>GitOps Sync:</strong> манифесты Helm/werf синхронизируются в кластер; секреты шифруются через SOPS или забираются из Vault через External Secrets Operator.</li>
  <li><strong>Zero Downtime Deploy:</strong> RollingUpdate стартует новый под -> проходит Startup/Readiness пробы -> подключается к Endpoints -> старый под получает SIGTERM и корректно дорабатывает запросы благодаря <code>preStop: sleep 10</code>.</li>
</ol>
        </div>
</details>

</article>
<article class="question-card" id="question-59">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>59.</strong> В чем отличие стратегий деплоя Blue-Green, Canary и RollingUpdate? Какие риски и преимущества у каждой?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Сравнение:</strong></p>
<ul>
  <li><strong>RollingUpdate:</strong> плавная замена старых подов на новые по одному. Плюсы: не требует удвоения ресурсов. Минусы: старая и новая версии работают одновременно.</li>
  <li><strong>Blue-Green:</strong> поднимается полная параллельная среда Green (v2). Тестируется, затем роутер переключает 100% трафика. Плюсы: мгновенный откат. Минусы: x2 расход ресурсов.</li>
  <li><strong>Canary:</strong> на новую версию пускают малый процент трафика (например, 5% пользователей). Следят за ошибками, затем раскатывают на всех.</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-60">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>60.</strong> Что такое Immutable Infrastructure (неизменяемая инфраструктура) и почему запрещено вносить ручные правки на серверах через SSH?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> Серверы и контейнеры никогда не модифицируются «на лету» руками. Любое изменение вносится в код (IaC/Git), тестируется и выкатывается новой сборкой/образом с нуля. Ручные правки через SSH порождают дрейф конфигураций (configuration drift) и делают систему невоспроизводимой при аварии.</p>
        </div>
</details>

</article>`;
