window.InterviewProContent["golang/errors"] = window.InterviewProBuildCards("golang/errors", [
  {
    "id": 261,
    "title": "Что такое error?",
    "answer": "Встроенный интерфейс `type error interface { Error() string }`. Ошибки — обычные значения, возвращаются последним результатом.",
    "markdown": true
  },
  {
    "id": 262,
    "title": "Sentinel errors, кастомные типы, обёртки — когда что?",
    "answer": "| Способ | Пример | Проверка |\n|---|---|---|\n| Sentinel | `var ErrNotFound = errors.New(\"not found\")` | `errors.Is(err, ErrNotFound)` |\n| Свой тип | `type ValidationError struct{ Field string }` | `errors.As(err, &ve)` / `errors.AsType[*ValidationError](err)` (Go 1.26) |\n| Обёртка | `fmt.Errorf(\"get user %d: %w\", id, err)` | цепочка `Unwrap` |\n| Непрозрачная | `fmt.Errorf(\"...: %v\", err)` | разрывает цепочку — осознанно скрываем детали |",
    "markdown": true
  },
  {
    "id": 263,
    "title": "Несколько ошибок сразу",
    "answer": "`errors.Join(err1, err2)` (Go 1.20) и `fmt.Errorf(\"%w; %w\", a, b)` — ошибка с `Unwrap() []error`. `errors.Is` проверяет все ветки.",
    "markdown": true
  },
  {
    "id": 264,
    "title": "Как оборачивать?",
    "answer": "Добавлять контекст **что делали**, без слов «failed to»/«error»: `fmt.Errorf(\"open config %q: %w\", path, err)`. Итоговое сообщение читается как цепочка: `load app: open config \"a.yaml\": no such file`.\nНе логировать и возвращать одновременно — ошибка будет залогирована N раз.",
    "markdown": true
  },
  {
    "id": 265,
    "title": "Что такое panic? Когда её использовать?",
    "answer": "Аварийное завершение: раскручивается стек, выполняются `defer`, затем процесс падает с трейсом. Использовать для **ошибок программиста** и невозможных состояний (нарушение инвариантов, `MustCompile` при инициализации). Для ожидаемых ошибок (сеть, ввод) — `error`.",
    "markdown": true
  },
  {
    "id": 266,
    "title": "Как работает recover?",
    "answer": "Возвращает значение паники, только если вызван **непосредственно в отложенной функции** в той же горутине:\n```go\nfunc safe(fn func()) (err error) {\n    defer func() {\n        if r := recover(); r != nil {\n            err = fmt.Errorf(\"panic: %v\\n%s\", r, debug.Stack())\n        }\n    }()\n    fn()\n    return nil\n}\n```",
    "markdown": true
  },
  {
    "id": 267,
    "title": "Поймает ли recover панику из другой горутины?",
    "answer": "**Нет.** Паника в любой горутине без recover роняет весь процесс. Поэтому в каждой долгоживущей горутине (воркеры, обработчики) нужен свой `defer recover`. `net/http` восстанавливает панику в хендлере сам (и логирует), но горутины, запущенные из хендлера, — нет.",
    "markdown": true
  },
  {
    "id": 268,
    "title": "Что нельзя поймать recover?",
    "answer": "`fatal error` рантайма: конкурентная запись в map, out of memory, stack overflow (`goroutine stack exceeds 1000000000-byte limit`), deadlock `all goroutines are asleep`.",
    "markdown": true
  },
  {
    "id": 269,
    "title": "panic(nil) — что будет?",
    "answer": "С Go 1.21 `panic(nil)` превращается в `*runtime.PanicNilError`, и `recover()` возвращает не-nil. Раньше `recover` возвращал `nil`, и паника была «невидимой».",
    "markdown": true
  },
  {
    "id": 270,
    "title": "Порядок выполнения при панике",
    "answer": "При панике отложенные вызовы выполняются в обратном порядке; recover внутри defer останавливает раскрутку.\n\n```go\nfunc main() {\n    defer fmt.Println(\"1\")\n    defer func() { recover(); fmt.Println(\"2\") }()\n    defer fmt.Println(\"3\")\n    panic(\"boom\")\n}\n// 3, 2, 1 — программа завершается нормально\n```",
    "markdown": true
  },
  {
    "id": 271,
    "title": "Ошибки в defer f.Close() — теряем?",
    "answer": "Для файлов на запись — да, и это баг: `Close` может вернуть ошибку сброса буфера. Правильно:\n```go\ndefer func() { err = errors.Join(err, f.Close()) }()\n```",
    "markdown": true
  }
]);
