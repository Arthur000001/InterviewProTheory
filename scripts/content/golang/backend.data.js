window.InterviewProContent["golang/backend"] = window.InterviewProBuildCards("golang/backend", [
  {
    "id": 326,
    "title": "Как устроен net/http сервер?",
    "answer": "`ListenAndServe` → `Accept` в цикле → **горутина на каждое соединение** → чтение запроса → `Handler.ServeHTTP(w, r)`. Роутинг — `http.ServeMux`.",
    "markdown": true
  },
  {
    "id": 327,
    "title": "Что умеет ServeMux с Go 1.22?",
    "answer": "Методы и wildcard-параметры — во многих проектах больше не нужен chi/gorilla:\n```go\nmux := http.NewServeMux()\nmux.HandleFunc(\"GET /users/{id}\", func(w http.ResponseWriter, r *http.Request) {\n    id := r.PathValue(\"id\")\n    ...\n})\nmux.HandleFunc(\"POST /users/\", createUser)\nmux.HandleFunc(\"GET /files/{path...}\", serveFile)\n```",
    "markdown": true
  },
  {
    "id": 328,
    "title": "Middleware",
    "answer": "```go\nfunc Logging(next http.Handler) http.Handler {\n    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n        start := time.Now()\n        next.ServeHTTP(w, r)\n        slog.Info(\"req\", \"method\", r.Method, \"path\", r.URL.Path, \"dur\", time.Since(start))\n    })\n}\n```\nПорядок: recover → request ID → логирование → метрики → auth → rate limit → handler.",
    "markdown": true
  },
  {
    "id": 329,
    "title": "Таймауты сервера и клиента",
    "answer": "- Сервер: `ReadHeaderTimeout`, `ReadTimeout`, `WriteTimeout`, `IdleTimeout`. Без них — Slowloris.\n- Клиент: `http.DefaultClient` **без таймаута** → зависшие запросы навсегда. Задавайте `Client{Timeout: ...}` или контекст.\n- Обязательно `defer resp.Body.Close()` и дочитывать тело (`io.Copy(io.Discard, resp.Body)`), иначе соединение не вернётся в пул keep-alive.\n- `Transport.MaxIdleConnsPerHost` по умолчанию 2 — узкое место при высоком RPS к одному хосту.",
    "markdown": true
  },
  {
    "id": 330,
    "title": "Graceful shutdown",
    "answer": "См. задачу [gracefulshutdown](#graceful-shutdown-http-сервера).",
    "markdown": true
  },
  {
    "id": 331,
    "title": "Логирование",
    "answer": "`log/slog` (Go 1.21) — структурированный логгер в стандартной библиотеке; `slog.NewMultiHandler` (Go 1.26). Раньше — zap, zerolog.",
    "markdown": true
  },
  {
    "id": 332,
    "title": "JSON",
    "answer": "`encoding/json` — через рефлексию, медленный. Опции тегов: `omitempty`, `omitzero` (1.24), `string`, `-`. **Go 1.27:** `encoding/json/v2` и `encoding/json/jsontext` — быстрее, строже (отклоняет невалидный UTF-8, дубликаты ключей), поддерживает стриминг. Альтернативы: `easyjson`, `sonic`, `goccy/go-json`.",
    "markdown": true
  },
  {
    "id": 333,
    "title": "gRPC vs REST",
    "answer": "| | gRPC | REST/JSON |\n|---|---|---|\n| Транспорт | HTTP/2, мультиплексирование | HTTP/1.1 или 2 |\n| Формат | Protobuf (бинарный, схема) | JSON (текст) |\n| Стриминг | unary, server, client, bidi | SSE/WebSocket отдельно |\n| Контракт | `.proto` + кодогенерация | OpenAPI (опционально) |\n| Браузер | нужен gRPC-Web / Connect | нативно |",
    "markdown": true
  },
  {
    "id": 334,
    "title": "Что спрашивают про gRPC",
    "answer": "- Interceptors (unary/stream) — аналог middleware.\n- Дедлайны передаются в метаданных и превращаются в `ctx` на сервере.\n- Коды ошибок `status.Error(codes.NotFound, ...)`.\n- Балансировка: HTTP/2 держит одно долгое соединение → L4-балансировщик распределяет плохо; нужен client-side LB (`round_robin`) или L7 (Envoy).\n- Обратная совместимость protobuf: нельзя менять номера полей, удалённые — `reserved`.",
    "markdown": true
  },
  {
    "id": 335,
    "title": "Типичные утечки",
    "answer": "Не закрыли `rows` → соединение не вернётся в пул: всегда `defer rows.Close()` и проверка `rows.Err()`. `QueryRow` закрывается сам после `Scan`.",
    "markdown": true
  },
  {
    "id": 336,
    "title": "N+1, SQL-инъекции, ORM",
    "answer": "- N+1 — запрос в цикле → `WHERE id = ANY($1)` или JOIN.\n- Инъекции — только плейсхолдеры (`$1`), никакого `fmt.Sprintf` в SQL.\n- В Go чаще `sqlc` (генерация из SQL), `squirrel`/`goqu`, реже GORM/ent.",
    "markdown": true
  },
  {
    "id": 337,
    "title": "Миграции",
    "answer": "`goose`, `golang-migrate`, `atlas`. Правило zero-downtime: расширяем → деплоим код → сужаем (expand/contract), `CREATE INDEX CONCURRENTLY`.",
    "markdown": true
  },
  {
    "id": 338,
    "title": "Kafka: что нужно знать Go-разработчику",
    "answer": "Топик → партиции → упорядоченность только внутри партиции (ключ сообщения определяет партицию). Consumer group: одна партиция — один консьюмер группы. Offset commit **после** обработки → at-least-once → **идемпотентные** обработчики. Exactly-once — транзакции Kafka или дедупликация на стороне получателя. Клиенты: `segmentio/kafka-go`, `twmb/franz-go`, `IBM/sarama`, `confluent-kafka-go`.",
    "markdown": true
  },
  {
    "id": 339,
    "title": "Outbox pattern",
    "answer": "Как атомарно записать в БД и отправить событие? Пишем событие в таблицу `outbox` в той же транзакции, отдельный процесс читает и публикует в Kafka (или CDC через Debezium).",
    "markdown": true
  }
]);
