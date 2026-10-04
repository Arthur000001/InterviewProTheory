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
<article class="question-card" id="question-57">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>57.</strong> Как устроен кэш слоев в Docker и как оптимизировать Dockerfile для ускорения CI/CD сборки в разы?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> Каждый шаг Dockerfile создает слой. Если файлы в слое не изменились, берется кэш. Инвалидация одного слоя сбрасывает кэш всех последующих.</p>
<p><strong>Оптимизация:</strong> сначала копировать манифесты зависимостей (<code>go.mod</code>, <code>package.json</code>) и скачивать пакеты, и только потом копировать исходный код (<code>COPY . .</code>).</p>
        </div>
</details>

</article>`;
