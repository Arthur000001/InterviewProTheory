window.InterviewProContent["golang/generics"] = window.InterviewProBuildCards("golang/generics", [
  {
    "id": 300,
    "title": "Как дженерики реализованы? Есть ли оверхед?",
    "answer": "**GC shape stenciling + словари.** Код генерируется на каждую «форму» (GC shape): все указательные типы делят одну реализацию, методы вызываются через словарь → косвенный вызов, иногда медленнее интерфейсов и мешает инлайнингу. Для значимых типов (`int`, `float64`) — отдельная специализированная копия, быстро.\nВывод для собеса: дженерики — для **структур данных и алгоритмов** (контейнеры, `slices`, `maps`), а не замена интерфейсам в бизнес-логике.",
    "markdown": true
  },
  {
    "id": 303,
    "title": "Go 1.27: generic-методы",
    "answer": "Методы теперь могут объявлять свои параметры типа:\n```go\ntype Stream[T any] struct{ items []T }\n\nfunc (s Stream[T]) Map[R any](f func(T) R) Stream[R] { // Go 1.27+\n    out := make([]R, len(s.items))\n    for i, v := range s.items { out[i] = f(v) }\n    return Stream[R]{out}\n}\n```\nПример в стандартной библиотеке — `(*rand.Rand).N[Int intType](Int) Int` в `math/rand/v2`. Ограничение: такие методы **не участвуют в реализации интерфейсов**.",
    "markdown": true
  },
  {
    "id": 304,
    "title": "Go 1.26: самоссылающиеся ограничения",
    "answer": "```go\ntype Adder[A Adder[A]] interface { Add(A) A }\n\nfunc SumAll[A Adder[A]](xs ...A) A { /* ... */ }\n```\nРаньше тип не мог ссылаться на себя в своём списке параметров типа.",
    "markdown": true
  },
]);
