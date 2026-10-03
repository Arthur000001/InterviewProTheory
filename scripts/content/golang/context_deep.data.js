window.InterviewProContent["golang/context_deep"] = window.InterviewProBuildCards("golang/context_deep", [
  {
    "id": 308,
    "title": "Интерфейс",
    "answer": "Context передаёт дедлайн, сигнал и результат отмены, а также значения, связанные с операцией.\n\n```go\ntype Context interface {\n    Deadline() (deadline time.Time, ok bool)\n    Done() <-chan struct{}\n    Err() error          // nil, Canceled или DeadlineExceeded\n    Value(key any) any\n}\n```",
    "markdown": true
  },
  {
    "id": 309,
    "title": "Конструкторы — все, что нужно знать",
    "answer": "| Функция | Версия | Назначение |\n|---|---|---|\n| `Background()` / `TODO()` | 1.7 | корень / «ещё не решили» |\n| `WithCancel` | 1.7 | ручная отмена |\n| `WithTimeout` / `WithDeadline` | 1.7 | по времени |\n| `WithValue` | 1.7 | значение |\n| `WithCancelCause` + `Cause(ctx)` | 1.20 | отмена с причиной |\n| `WithTimeoutCause` / `WithDeadlineCause` | 1.21 | таймаут с причиной |\n| `AfterFunc(ctx, f)` | 1.21 | вызвать `f` после отмены |\n| `WithoutCancel(ctx)` | 1.21 | значения сохраняются, отмена — нет (фоновая работа после ответа) |\n| `signal.NotifyContext` | 1.16 | отмена по сигналу ОС; с 1.26 причина — сигнал |\n| `t.Context()` / `b.Context()` | 1.24 | контекст теста, отменяется перед Cleanup |",
    "markdown": true
  },
  {
    "id": 310,
    "title": "Почему обязательно вызывать cancel()?",
    "answer": "Иначе дочерний контекст (и его таймер) живёт до отмены родителя → утечка. `go vet` предупреждает (`lostcancel`). Идиома: `ctx, cancel := context.WithTimeout(...); defer cancel()`.",
    "markdown": true
  },
  {
    "id": 311,
    "title": "Правила использования",
    "answer": "- Первый параметр функции: `func Do(ctx context.Context, ...)`.\n- **Не хранить в структурах** (исключение — структуры, представляющие одну операцию).\n- Не передавать `nil` — используйте `context.TODO()`.\n- Ключи `WithValue` — **свой неэкспортируемый тип**, чтобы не было коллизий:\n```go\ntype ctxKey struct{}\nctx = context.WithValue(ctx, ctxKey{}, userID)\n```\n- В `Value` — только request-scoped данные, **не** параметры функций и не зависимости (логгер/БД — спорно; лучше явно).",
    "markdown": true
  },
  {
    "id": 312,
    "title": "Как работает Value и почему он медленный?",
    "answer": "Каждый `WithValue` — новый узел связного списка; поиск идёт от листа к корню, `O(глубина)`. Не кладите туда десятки значений.",
    "markdown": true
  },
  {
    "id": 313,
    "title": "Как отмена доходит до HTTP-клиента и БД?",
    "answer": "`http.NewRequestWithContext(ctx, ...)`, `db.QueryContext(ctx, ...)`, `grpc` — принимают ctx и прерывают операцию. В `net/http` сервере `r.Context()` отменяется при разрыве клиентского соединения или завершении `ServeHTTP`.",
    "markdown": true
  },
  {
    "id": 315,
    "title": "Как проверить отмену в горячем цикле?",
    "answer": "Периодически проверять ошибку контекста внутри цикла и прекращать обработку при отмене. Частоту проверки выбирают по стоимости итерации и допустимой задержке остановки; при долгих операциях проверяют после каждого шага. Также можно использовать неблокирующую проверку сигнала отмены.",
    "markdown": true
  }
]);
