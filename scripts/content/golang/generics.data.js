window.InterviewProContent["golang/generics"] = window.InterviewProBuildCards("golang/generics", [
  {
    "id": 299,
    "title": "Синтаксис и ограничения (constraints)",
    "answer": "```go\nfunc Map[T, R any](xs []T, f func(T) R) []R {\n    out := make([]R, 0, len(xs))\n    for _, x := range xs { out = append(out, f(x)) }\n    return out\n}\n\ntype Number interface { ~int | ~int64 | ~float64 }\nfunc Sum[T Number](xs ...T) (s T) { for _, x := range xs { s += x }; return }\n```\n- `any` — любой тип; `comparable` — поддерживает `==` (с Go 1.20 включает интерфейсы, которые могут паниковать при сравнении).\n- `~int` — любой тип с underlying `int` (например, `type UserID int`).\n- `cmp.Ordered` (Go 1.21) — всё, что поддерживает `< <= > >=`.",
    "markdown": true
  },
  {
    "id": 300,
    "title": "Как дженерики реализованы? Есть ли оверхед?",
    "answer": "**GC shape stenciling + словари.** Код генерируется на каждую «форму» (GC shape): все указательные типы делят одну реализацию, методы вызываются через словарь → косвенный вызов, иногда медленнее интерфейсов и мешает инлайнингу. Для значимых типов (`int`, `float64`) — отдельная специализированная копия, быстро.\nВывод для собеса: дженерики — для **структур данных и алгоритмов** (контейнеры, `slices`, `maps`), а не замена интерфейсам в бизнес-логике.",
    "markdown": true
  },
  {
    "id": 301,
    "title": "Дженерики или интерфейсы?",
    "answer": "- Интерфейс — когда важно **поведение** (методы), а конкретный тип не важен.\n- Дженерик — когда одна и та же логика для разных типов и важно **сохранить тип** (без `any` и type assertion), например `Max[T]`, `Cache[K, V]`.",
    "markdown": true
  },
  {
    "id": 302,
    "title": "Что нельзя делать с дженериками?",
    "answer": "- Методы с собственными параметрами типа можно объявлять с Go 1.27. Но **в интерфейсах** методы с параметрами типа по-прежнему запрещены.\n- Специализация (разная реализация для конкретного `T`) — нет, только type switch по `any(v)`.\n- Параметры типа в type switch/`case` напрямую, variadic type parameters — нет.",
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
  {
    "id": 305,
    "title": "Параметризованные алиасы (Go 1.24)",
    "answer": "Параметризованный алиас даёт другое имя типу с параметром, не создавая новый тип.\n\n```go\ntype Set[T comparable] = map[T]struct{}\n```",
    "markdown": true
  },
  {
    "id": 306,
    "title": "Итераторы (Go 1.23) и дженерики",
    "answer": "```go\nfunc Filter[T any](seq iter.Seq[T], pred func(T) bool) iter.Seq[T] {\n    return func(yield func(T) bool) {\n        for v := range seq {\n            if pred(v) && !yield(v) { return }\n        }\n    }\n}\nfor v := range Filter(slices.Values(xs), isEven) { ... }\n```\n`iter.Seq[V]` = `func(yield func(V) bool)`, `iter.Seq2[K,V]`. Важно проверять результат `yield` — иначе panic при `break` в цикле потребителя.",
    "markdown": true
  },
  {
    "id": 307,
    "title": "Инференс типов",
    "answer": "Компилятор выводит параметры по аргументам: `Map(xs, strconv.Itoa)`. С Go 1.21 — и по типу присваивания/возвращаемому значению; в **Go 1.27** инференс работает во всех контекстах, где дженерик-функция присваивается переменной или конвертируется в тип функции.",
    "markdown": true
  }
]);
