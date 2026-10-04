window.InterviewProContent["golang/design"] = window.InterviewProBuildCards("golang/design", [
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
    "id": 345,
    "title": "Прометеус-метрики: какие типы?",
    "answer": "Counter (только растёт), Gauge (вверх-вниз), Histogram (бакеты, агрегируется между инстансами → p99 через `histogram_quantile`), Summary (квантили на клиенте, не агрегируется). Не кладите user ID в лейблы — взрыв кардинальности.",
    "markdown": true
  }
]);
