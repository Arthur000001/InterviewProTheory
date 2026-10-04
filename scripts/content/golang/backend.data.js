window.InterviewProContent["golang/backend"] = window.InterviewProBuildCards("golang/backend", [
  {
    "id": 330,
    "title": "Graceful shutdown",
    "answer": "См. задачу [gracefulshutdown](#graceful-shutdown-http-сервера).",
    "markdown": true
  },
  {
    "id": 333,
    "title": "gRPC vs REST",
    "answer": "| | gRPC | REST/JSON |\n|---|---|---|\n| Транспорт | HTTP/2, мультиплексирование | HTTP/1.1 или 2 |\n| Формат | Protobuf (бинарный, схема) | JSON (текст) |\n| Стриминг | unary, server, client, bidi | SSE/WebSocket отдельно |\n| Контракт | `.proto` + кодогенерация | OpenAPI (опционально) |\n| Браузер | нужен gRPC-Web / Connect | нативно |",
    "markdown": true
  },
  {
    "id": 335,
    "title": "Типичные утечки",
    "answer": "Не закрыли `rows` → соединение не вернётся в пул: всегда `defer rows.Close()` и проверка `rows.Err()`. `QueryRow` закрывается сам после `Scan`.",
    "markdown": true
  },
  {
    "id": 339,
    "title": "Outbox pattern",
    "answer": "Как атомарно записать в БД и отправить событие? Пишем событие в таблицу `outbox` в той же транзакции, отдельный процесс читает и публикует в Kafka (или CDC через Debezium).",
    "markdown": true
  }
]);
