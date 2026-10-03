window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["containers/docker"] = `<article class="question-card" id="question-51">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>51.</strong> Какие практики для уменьшения размера docker-образа существуют?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Лучшие практики:</strong></p>
<ol>
  <li><strong>Multi-stage сборка:</strong> компиляция в тяжелом образе, запуск в пустом <code>scratch</code> или <code>distroless</code>.</li>
  <li>Объединение команд <code>RUN</code> для уменьшения слоев.</li>
  <li>Удаление кэша пакетных менеджеров (<code>--no-cache</code> в alpine, <code>rm -rf /var/lib/apt/lists/*</code> в debian).</li>
  <li>Использование <code>.dockerignore</code> (исключать .git, vendor, node_modules).</li>
</ol>
<pre><code class="language-dockerfile">FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o server .

FROM gcr.io/distroless/static-debian12
COPY --from=builder /app/server /server
USER nonroot:nonroot
ENTRYPOINT ["/server"]</code></pre>
        </div>
</details>

</article>
<article class="question-card" id="question-52">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>52.</strong> Что такое контейнер под капотом Linux? Какие механизмы ядра (namespaces, cgroups, chroot/pivot_root) обеспечивают изоляцию?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> Контейнер — это изолированный процесс, созданный вызовом <code>clone()</code> с флагами неймспейсов (CLONE_NEWPID, CLONE_NEWNET и т.д.). Его изоляция держится на:</p>
<ul>
  <li><strong>Namespaces:</strong> дают процесс-специфичный вид на системные ресурсы.</li>
  <li><strong>Cgroups:</strong> ограничивают аллокацию железа (квоты CPU/RAM).</li>
  <li><strong>pivot_root:</strong> переключает процесс на новую файловую систему.</li>
  <li><strong>AppArmor / Seccomp:</strong> блокируют несанкционированные системные вызовы.</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-53">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>53.</strong> В чем проблема PID 1 в контейнере? Почему сигналы (SIGTERM) могут игнорироваться и почему возникают процессы-зомби?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть проблемы:</strong></p>
<ol>
  <li><strong>Игнорирование сигналов:</strong> в Linux ядро не применяет дефолтные обработчики сигналов к процессу с PID 1. Если приложение явно не подписалось на <code>SIGTERM</code>, оно его проигнорирует, и K8s убьет его через 30 сек жестким <code>SIGKILL</code>.</li>
  <li><strong>Зомби-процессы:</strong> PID 1 обязан собирать статус завершения дочерних процессов (reaping). Если приложение этого не делает, зомби накапливаются.</li>
</ol>
<p><strong>Решение:</strong> использовать легковесный init (<code>tini</code>, <code>dumb-init</code>) или директиву Docker <code>--init</code>.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-54">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>54.</strong> Чем отличаются инструкции ENTRYPOINT и CMD в Dockerfile, и в чем разница между exec-формой и shell-формой?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong></p>
<ul>
  <li><code>ENTRYPOINT</code> — фиксированная бинарная команда контейнера.</li>
  <li><code>CMD</code> — аргументы по умолчанию для ENTRYPOINT (легко переопределяются при запуске).</li>
  <li><strong>Exec-форма:</strong> <code>["./app", "arg1"]</code> — запускает бинарник напрямую как PID 1 (сигналы доходят!).</li>
  <li><strong>Shell-форма:</strong> <code>./app arg1</code> — запускает под капотом <code>/bin/sh -c "./app"</code>. PID 1 становится sh, который часто не транслирует SIGTERM приложению.</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-55">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>55.</strong> Чем отличаются Container Runtime Interface (CRI), containerd, CRI-O и OCI runc?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Иерархия:</strong></p>
<ul>
  <li><strong>CRI:</strong> gRPC-интерфейс между Kubelet и рантаймом контейнеров.</li>
  <li><strong>containerd / CRI-O:</strong> высокоуровневые демоны-рантаймы. Они реализуют CRI, скачивают образы, готовят rootfs и вызывают низкоуровневый рантайм.</li>
  <li><strong>runc (OCI):</strong> низкоуровневый CLI-инструмент, который непосредственно создает cgroups/namespaces в ядре и стартует процесс.</li>
</ul>
        </div>
</details>

</article>
<article class="question-card" id="question-56">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>56.</strong> Какие практики безопасности Dockerfile и контейнеров обязательны для production (non-root, read-only rootfs, drop capabilities)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Чеклист:</strong></p>
<ol>
  <li><code>USER 10001:10001</code> — никогда не работать от root внутри контейнера.</li>
  <li><code>readOnlyRootFilesystem: true</code> в K8s securityContext (запрет изменения бинарников взломщиком).</li>
  <li><code>capabilities: drop: ["ALL"]</code> — убрать все привилегии ядра.</li>
  <li>Запрет эскалации привилегий: <code>allowPrivilegeEscalation: false</code>.</li>
  <li>Сканирование образов на CVE в CI (Trivy, Grype).</li>
</ol>
        </div>
</details>

</article>
<article class="question-card" id="question-57">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>57.</strong> Как устроен кэш слоев в Docker и как оптимизировать Dockerfile для ускорения CI/CD сборки в разы?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> Каждый шаг Dockerfile создает слой. Если файлы в слое не изменились, берется кэш. Инвалидация одного слоя сбрасывает кэш всех последующих.</p>
<p><strong>Оптимизация:</strong> сначала копировать манифесты зависимостей (<code>go.mod</code>, <code>package.json</code>) и скачивать пакеты, и только потом копировать исходный код (<code>COPY . .</code>).</p>
        </div>
</details>

</article>`;
