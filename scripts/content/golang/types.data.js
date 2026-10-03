window.InterviewProContent["golang/types"] = window.InterviewProBuildCards("golang/types", [
  {
    "id": 249,
    "title": "Главная ловушка: nil-интерфейс ≠ интерфейс с nil-значением",
    "answer": "```go\ntype MyErr struct{}\nfunc (*MyErr) Error() string { return \"boom\" }\n\nfunc do() error {\n    var e *MyErr = nil\n    return e // интерфейс {type: *MyErr, value: nil}\n}\n\nfmt.Println(do() == nil) // false!\n```\nИнтерфейс равен `nil`, только если **и тип, и значение** nil. Правило: возвращайте `nil` явно, а не типизированный nil-указатель.",
    "markdown": true
  },
  {
    "id": 250,
    "title": "Неявная реализация интерфейсов — плюсы и минусы",
    "answer": "Тип реализует интерфейс автоматически, если имеет все методы (duck typing на этапе компиляции). Плюсы: нет зависимости от пакета с интерфейсом, легко мокать. Идиома: **«Accept interfaces, return structs»**, интерфейсы объявляются на стороне **потребителя** и маленькие (`io.Reader` — 1 метод).\n\nПроверка на этапе компиляции: `var _ Storage = (*PgStorage)(nil)`.",
    "markdown": true
  },
  {
    "id": 251,
    "title": "Value receiver vs pointer receiver",
    "answer": "| | Value `func (t T)` | Pointer `func (t *T)` |\n|---|---|---|\n| Меняет исходный объект | нет (копия) | да |\n| Копирование | всей структуры | 8 байт |\n| Method set `T` | ✔ | ✘ |\n| Method set `*T` | ✔ | ✔ |\n\nСледствие: если метод объявлен на `*T`, то **значение** `T` не реализует интерфейс:\n```go\ntype S struct{}\nfunc (*S) M() {}\nvar _ I = S{}  // ошибка компиляции\nvar _ I = &S{} // ок\n```\nПравило: если хоть один метод на указателе (или есть мьютекс внутри) — делайте все на указателе.",
    "markdown": true
  },
  {
    "id": 252,
    "title": "Встраивание (embedding) — это наследование?",
    "answer": "Нет, это **композиция с продвижением методов**. Встроенный тип не знает о внешнем — нет виртуальных вызовов:\n```go\ntype Base struct{}\nfunc (Base) Name() string   { return \"base\" }\nfunc (b Base) Hello() string { return \"hi \" + b.Name() }\n\ntype Child struct{ Base }\nfunc (Child) Name() string { return \"child\" }\n\nChild{}.Hello() // \"hi base\" — не \"hi child\"!\n```\nВстраивание интерфейса в структуру — приём для частичных моков и декораторов.",
    "markdown": true
  },
  {
    "id": 253,
    "title": "Можно ли сравнивать структуры?",
    "answer": "`==` работает, если все поля comparable. Структура со слайсом/map — ошибка компиляции. Интерфейсы с несравнимым значением внутри — **panic в рантайме**. Для глубокого сравнения в тестах — `reflect.DeepEqual` или `github.com/google/go-cmp`.",
    "markdown": true
  },
  {
    "id": 254,
    "title": "Пустая структура struct{} — зачем?",
    "answer": "Занимает 0 байт (все такие значения могут иметь один адрес `runtime.zerobase`). Применения: множества `map[K]struct{}`, сигнальные каналы `chan struct{}`, типы-маркеры с методами.",
    "markdown": true
  },
  {
    "id": 255,
    "title": "Выравнивание полей (alignment/padding)",
    "answer": "```go\ntype Bad struct {  // 24 байта\n    a bool   // 1 + 7 padding\n    b int64  // 8\n    c bool   // 1 + 7 padding\n}\ntype Good struct { // 16 байт\n    b int64\n    a, c bool\n}\n```\nПроверка: `unsafe.Sizeof`, линтер `fieldalignment`. Важно для горячих структур и 64-битных атомиков на 32-битных платформах (используйте `atomic.Int64` — он выровнен).",
    "markdown": true
  },
  {
    "id": 256,
    "title": "Теги структур",
    "answer": "Метаданные для рефлексии: `json:\"name,omitempty\"`, `db:\"id\"`, `validate:\"required\"`. Читаются через `reflect.StructTag.Get`. В Go 1.24 появилась опция `omitzero` в `encoding/json` — пропускает zero value (в т.ч. `time.Time{}`) и учитывает метод `IsZero()`. В `encoding/json/v2` (Go 1.27) — ещё строже и быстрее.",
    "markdown": true
  },
  {
    "id": 257,
    "title": "Можно ли определить метод для типа из другого пакета?",
    "answer": "Нет. Только для типов своего пакета. Решение — `type MyTime time.Time` или обёртка-структура.",
    "markdown": true
  },
  {
    "id": 258,
    "title": "Что такое any? Когда его использовать?",
    "answer": "Алиас `interface{}` (Go 1.18). Использовать минимально: теряется типобезопасность, значения упаковываются (boxing → часто аллокация). Сейчас большинство кейсов закрывают дженерики.",
    "markdown": true
  },
  {
    "id": 259,
    "title": "Функциональные опции (functional options)",
    "answer": "```go\ntype Option func(*Server)\nfunc WithTimeout(d time.Duration) Option { return func(s *Server) { s.timeout = d } }\nfunc NewServer(addr string, opts ...Option) *Server {\n    s := &Server{addr: addr, timeout: 30 * time.Second}\n    for _, o := range opts { o(s) }\n    return s\n}\n```\nСпрашивают как пример идиоматичного API в Go.",
    "markdown": true
  },
  {
    "id": 260,
    "title": "Когда интерфейс вызывает аллокацию?",
    "answer": "При присваивании в интерфейс значение, не помещающееся в указатель (или чей адрес «убегает»), копируется в кучу. Маленькие целые (0–255) и нулевые значения рантайм берёт из статических таблиц. Проверяйте: `go build -gcflags=-m`.",
    "markdown": true
  }
]);
