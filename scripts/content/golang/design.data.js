window.InterviewProContent["golang/design"] = window.InterviewProBuildCards("golang/design", [
  {
    "id": 340,
    "title": "Структура проекта",
    "answer": "Популярная (неофициальная) схема:\n```\ncmd/app/main.go        # точка входа, сборка зависимостей (wiring)\ninternal/              # код, недоступный извне модуля\n  domain/              # сущности и бизнес-правила\n  service/ (usecase)   # сценарии\n  repository/ (storage)# работа с БД\n  transport/http, grpc # хендлеры\npkg/                   # публичные библиотеки (если нужны)\nmigrations/, api/ (proto, openapi)\n```\nНе тащите `pkg/` и глубокую вложенность в маленький сервис. «Clean architecture» в Go — это прежде всего **направление зависимостей внутрь** и интерфейсы на стороне потребителя.",
    "markdown": true
  },
  {
    "id": 341,
    "title": "SOLID в Go",
    "answer": "- **S** — маленькие пакеты с одной ответственностью.\n- **O** — расширение через интерфейсы и композицию.\n- **L** — любая реализация интерфейса взаимозаменяема.\n- **I** — маленькие интерфейсы (`io.Reader`, `io.Writer`) → `io.ReadWriter` композицией.\n- **D** — сервис зависит от интерфейса `UserRepo`, объявленного **в пакете сервиса**, а не от `*PostgresRepo`.",
    "markdown": true
  },
  {
    "id": 342,
    "title": "Dependency Injection",
    "answer": "В Go обычно ручная сборка в `main` (конструкторы `NewService(repo, logger)`). Для больших проектов — `google/wire` (кодогенерация) или `uber-go/fx` (рантайм).",
    "markdown": true
  },
  {
    "id": 343,
    "title": "Паттерны, которые спрашивают в Go-контексте",
    "answer": "| Паттерн | В Go |\n|---|---|\n| Singleton | `sync.OnceValue` |\n| Factory | функция `NewX(...)` |\n| Functional Options | `NewServer(addr, WithTimeout(5*time.Second))` |\n| Decorator / Middleware | `func(http.Handler) http.Handler` |\n| Adapter | `http.HandlerFunc` — функция как интерфейс |\n| Strategy | интерфейс или функция-параметр |\n| Observer | каналы / [pub-sub](#pubsub-брокер-в-памяти) |\n| Circuit Breaker | `sony/gobreaker` |\n| Retry с backoff + jitter | экспоненциальная задержка + случайность |",
    "markdown": true
  },
  {
    "id": 344,
    "title": "Микросервисы: что обязательно знать",
    "answer": "- Идемпотентность (idempotency key), ретраи только для идемпотентных операций.\n- Таймауты и дедлайны по всей цепочке, circuit breaker, bulkhead.\n- Распределённые транзакции: **Saga** (оркестрация/хореография) вместо 2PC; [Outbox](#17-outbox-pattern).\n- Observability: логи (`slog`), метрики (Prometheus: RED/USE), трейсы (OpenTelemetry).\n- Health checks: liveness vs readiness.\n- Конфигурация через env (12-factor).",
    "markdown": true
  },
  {
    "id": 345,
    "title": "Прометеус-метрики: какие типы?",
    "answer": "Counter (только растёт), Gauge (вверх-вниз), Histogram (бакеты, агрегируется между инстансами → p99 через `histogram_quantile`), Summary (квантили на клиенте, не агрегируется). Не кладите user ID в лейблы — взрыв кардинальности.",
    "markdown": true
  }
]);
