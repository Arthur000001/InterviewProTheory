window.InterviewProContent["golang/build_security"] = window.InterviewProBuildCards("golang/build_security", [
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
]);
