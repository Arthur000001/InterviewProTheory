window.InterviewProContent["golang/concurrency_patterns"] = window.InterviewProBuildCards("golang/concurrency_patterns", [
  {
    "id": 273,
    "title": "Кто должен закрывать канал?",
    "answer": "**Отправитель**, и только когда больше никто не будет писать. Получатель канал не закрывает. При нескольких отправителях — отдельная горутина `wg.Wait(); close(ch)` или сигнальный канал `done`. Закрывать канал **не обязательно** — GC соберёт; закрывают, чтобы сообщить получателям «данных больше нет».",
    "markdown": true
  },
  {
    "id": 274,
    "title": "Как ограничить число одновременных горутин?",
    "answer": "Семафор на канале, worker pool, `errgroup.SetLimit`, `golang.org/x/sync/semaphore` (взвешенный). См. [workerpool](#worker-pool-на-go) и [parallel](#параллельные-запросы-с-лимитом-и-отменой-свой-errgroup).",
    "markdown": true
  },
  {
    "id": 275,
    "title": "Как дождаться завершения горутин?",
    "answer": "`sync.WaitGroup`. С Go 1.25 — `wg.Go(func(){...})`, который сам делает `Add(1)` и `Done()`:\n```go\nvar wg sync.WaitGroup\nfor _, u := range urls {\n    wg.Go(func() { fetch(u) })\n}\nwg.Wait()\n```\nДля ошибок и отмены — `errgroup.Group`.",
    "markdown": true
  },
  {
    "id": 278,
    "title": "Как остановить горутину извне?",
    "answer": "Никак принудительно. Только кооперативно: горутина сама проверяет `ctx.Done()` / закрытый `done`-канал.",
    "markdown": true
  },
]);
