window.InterviewProContent["golang/synchronization"] = window.InterviewProBuildCards("golang/synchronization", [
  {
    "id": 281,
    "title": "Race condition vs data race",
    "answer": "Data race — низкоуровневый конфликт доступа к памяти. Race condition — логическая ошибка из-за порядка событий (check-then-act), возможна и без data race: `if m.Get(k) == nil { m.Set(k, v) }` — каждый вызов под мьютексом, а вместе — нет.",
    "markdown": true
  },
  {
    "id": 283,
    "title": "sync.Cond — зачем, если есть каналы?",
    "answer": "Для broadcast-пробуждения многих ожидающих по изменению состояния под мьютексом (`Wait` всегда в цикле `for !cond { c.Wait() }`). На практике редко, чаще заменяют закрытием канала.",
    "markdown": true
  },
  {
    "id": 285,
    "title": "Что такое модель памяти Go (Go Memory Model)?",
    "answer": "Формальные правила **happens-before**: когда запись в одной горутине гарантированно видна чтению в другой. Гарантии дают:\n- запуск горутины (`go f()` happens-before начала `f`);\n- отправка в канал happens-before соответствующего получения; `close` happens-before получения zero value;\n- для небуферизированного канала получение happens-before завершения отправки;\n- `Unlock` happens-before следующего `Lock`;\n- `Once.Do(f)`: завершение `f` happens-before возврата любого `Do`;\n- атомики sequentially consistent (с 2022 года это явно в спецификации).\n\nБез этого компилятор и CPU вправе переупорядочивать операции:\n```go\nvar a string; var done bool\ngo func() { a = \"hello\"; done = true }()\nfor !done {}   // может крутиться вечно\nprint(a)       // может напечатать \"\"\n```",
    "markdown": true
  },
]);
