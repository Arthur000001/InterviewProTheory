window.InterviewProContent["golang/build_security"] = window.InterviewProBuildCards("golang/build_security", [
  {
    "id": 367,
    "title": "Как Go выбирает версии зависимостей (MVS)?",
    "answer": "**Minimal Version Selection:** для каждого модуля берётся **максимальная из минимально требуемых** версий в графе — не «самая свежая». Сборка детерминирована без lock-файла; `go.sum` хранит только хэши для проверки целостности (через `sum.golang.org`).\n- Мажорная версия ≥ 2 — **другой путь модуля**: `example.com/lib/v2`.\n- `retract` в `go.mod` — пометить свою версию как битую.\n- `replace` — подменить модуль (локальная отладка); работает **только в главном модуле**.\n- Приватные модули: `GOPRIVATE=gitlab.company.ru/*` (не ходить в прокси и sumdb), `GOPROXY`, `GOFLAGS=-mod=vendor`.\n- `tool`-директива в `go.mod` (Go 1.24) — версионируемые инструменты разработки (`go get -tool`, `go tool stringer`) вместо `tools.go`.",
    "markdown": true
  },
  {
    "id": 368,
    "title": "Как собрать минимальный воспроизводимый бинарник для прода?",
    "answer": "```bash\nCGO_ENABLED=0 GOOS=linux GOARCH=amd64 \\\n  go build -trimpath -ldflags=\"-s -w -X main.version=$(git describe --tags)\" -o app ./cmd/app\n```\n`-trimpath` — убрать локальные пути (воспроизводимость), `-s -w` — без таблицы символов и DWARF (меньше размер, но хуже отладка), `-X` — подставить версию. Информация о сборке и VCS доступна в рантайме через `debug.ReadBuildInfo()` и `go version -m ./app`. Образ — `FROM scratch` или `distroless/static` (не забудьте CA-сертификаты и `tzdata`, либо `import _ \"time/tzdata\"`).",
    "markdown": true
  },
  {
    "id": 369,
    "title": "Как защищать Go-сервис?",
    "answer": "- `math/rand` (и `math/rand/v2`) — **не** для токенов и паролей; только `crypto/rand` (с Go 1.24 `crypto/rand.Text()` для случайных строк).\n- Сравнение секретов — `subtle.ConstantTimeCompare`, иначе timing attack.\n- SQL — только плейсхолдеры (`$1`), никогда `fmt.Sprintf`.\n- `html/template` экранирует контекстно, `text/template` — нет (XSS).\n- `os/exec.Command(name, args...)` не вызывает shell — не собирайте `sh -c` из пользовательского ввода.\n- Path traversal: `os.Root` (Go 1.24) ограничивает файловые операции каталогом; `filepath.IsLocal`.\n- `http.Server` без таймаутов → Slowloris; `io.LimitReader`/`http.MaxBytesReader` против огромных тел запросов.\n- Уязвимости зависимостей — `govulncheck ./...` (анализирует реально вызываемый код, а не просто список модулей).\n- Пароли — `bcrypt`/`argon2id` из `golang.org/x/crypto`.",
    "markdown": true
  },
  {
    "id": 370,
    "title": "Как отлаживать упавший или зависший процесс в проде?",
    "answer": "- `GOTRACEBACK=all` (стеки всех горутин при панике), `=crash` — ещё и core dump; `debug.SetTraceback` из кода.\n- Зависший процесс: `kill -QUIT <pid>` (SIGQUIT) — рантайм печатает стеки всех горутин и выходит. Без остановки — `/debug/pprof/goroutine?debug=2`.\n- **Delve**: `dlv attach <pid>`, `dlv core ./app core.123`, `dlv debug`; для оптимизированного кода — собирать с `-gcflags=all=\"-N -l\"`.\n- `fatal error` (concurrent map writes, deadlock, out of memory) не ловится `recover` — смотрите стек из лога.\n- `GODEBUG=gctrace=1,schedtrace=1000,scheddetail=1` — живая телеметрия GC и планировщика в stderr.",
    "markdown": true
  },
{
  "id": 431,
  "title": "Как настроить доступ к приватным Go-модулям через GOPRIVATE и GOPROXY?",
  "answer": "GOPROXY задаёт источники скачивания модулей и порядок fallback. GOPRIVATE перечисляет шаблоны приватных путей и по умолчанию исключает их из публичного proxy и базы контрольных сумм; для тонкой настройки есть GONOPROXY и GONOSUMDB. Доступ к приватному Git-репозиторию задают отдельно через разрешённый механизм аутентификации; секреты не включают в go.mod и URL, попадающие в логи.",
  "followups": [
    [
      "Почему go.sum не заменяет проверку приватного источника?",
      "Для приватного пути публичная база контрольных сумм обычно отключена; целостность и доверие обеспечивают доступ к каноническому репозиторию, закреплённые версии и контроль цепочки поставки."
    ]
  ]
}
]);
