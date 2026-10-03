window.InterviewProContent["golang/synchronization"] = window.InterviewProBuildCards("golang/synchronization", [
  {
    "id": 281,
    "title": "Race condition vs data race",
    "answer": "Data race — низкоуровневый конфликт доступа к памяти. Race condition — логическая ошибка из-за порядка событий (check-then-act), возможна и без data race: `if m.Get(k) == nil { m.Set(k, v) }` — каждый вызов под мьютексом, а вместе — нет.",
    "markdown": true
  },
  {
    "id": 282,
    "title": "sync.Once, OnceFunc, OnceValue, OnceValues",
    "answer": "```go\nvar getCfg = sync.OnceValue(func() *Config { return load() }) // Go 1.21\ncfg := getCfg()\n```\nЕсли функция внутри `Once.Do` паникует, `Once` считается выполненным.",
    "markdown": true
  },
  {
    "id": 283,
    "title": "sync.Cond — зачем, если есть каналы?",
    "answer": "Для broadcast-пробуждения многих ожидающих по изменению состояния под мьютексом (`Wait` всегда в цикле `for !cond { c.Wait() }`). На практике редко, чаще заменяют закрытием канала.",
    "markdown": true
  },
  {
    "id": 284,
    "title": "sync/atomic: что знать",
    "answer": "- Типизированные атомики (Go 1.19): `atomic.Int64`, `atomic.Bool`, `atomic.Pointer[T]`, `atomic.Value`.\n- `Add`, `Load`, `Store`, `Swap`, `CompareAndSwap`; в Go 1.23 добавлены `And`/`Or`.\n- `go fix` в Go 1.27 умеет переводить старый код на типизированные атомики (модернайзер `atomictypes`).\n```go\nvar hits atomic.Int64\nhits.Add(1)\n```\nАтомики быстрее мьютекса для одной переменной, но **не** делают атомарной группу операций.",
    "markdown": true
  },
  {
    "id": 285,
    "title": "Что такое модель памяти Go (Go Memory Model)?",
    "answer": "Формальные правила **happens-before**: когда запись в одной горутине гарантированно видна чтению в другой. Гарантии дают:\n- запуск горутины (`go f()` happens-before начала `f`);\n- отправка в канал happens-before соответствующего получения; `close` happens-before получения zero value;\n- для небуферизированного канала получение happens-before завершения отправки;\n- `Unlock` happens-before следующего `Lock`;\n- `Once.Do(f)`: завершение `f` happens-before возврата любого `Do`;\n- атомики sequentially consistent (с 2022 года это явно в спецификации).\n\nБез этого компилятор и CPU вправе переупорядочивать операции:\n```go\nvar a string; var done bool\ngo func() { a = \"hello\"; done = true }()\nfor !done {}   // может крутиться вечно\nprint(a)       // может напечатать \"\"\n```",
    "markdown": true
  },
  {
    "id": 286,
    "title": "Что такое false sharing?",
    "answer": "Две горутины пишут в разные переменные, лежащие в одной кэш-линии (64 байта) → кэш-линия «прыгает» между ядрами. Лечится паддингом `_ [56]byte` или `cpu.CacheLinePad`.",
    "markdown": true
  },
  {
    "id": 287,
    "title": "context + мьютекс: можно ли захватить мьютекс с таймаутом?",
    "answer": "Стандартный `Mutex` — нет (`TryLock` есть с Go 1.18, но его использование обычно запах дизайна). Альтернатива — семафор на канале: `select { case sem <- struct{}{}: case <-ctx.Done(): }`.",
    "markdown": true
  },
  {
    "id": 288,
    "title": "Тестирование конкурентного кода без time.Sleep",
    "answer": "Пакет **`testing/synctest`** (эксперимент в 1.24, стабилен с Go 1.25): код внутри `synctest.Test(t, func(t *testing.T){...})` работает в «пузыре» с фейковым временем — `time.Sleep(time.Hour)` проходит мгновенно, а `synctest.Wait()` ждёт, пока все горутины пузыря заблокируются. В Go 1.27 добавлен `synctest.Sleep`.",
    "markdown": true
  }
]);
