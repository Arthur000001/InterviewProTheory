window.InterviewProContent["golang/collections_deep"] = window.InterviewProBuildCards("golang/collections_deep", [
  {
    "id": 243,
    "title": "Как удалить элемент из слайса?",
    "answer": "При сохранении порядка удаление сдвигает элементы; без сохранения порядка элемент можно заменить последним.\n\n```go\ns = slices.Delete(s, i, i+1)        // Go 1.21+, с 1.22 обнуляет хвост (нет утечек указателей)\ns = append(s[:i], s[i+1:]...)        // вручную, O(n)\ns[i] = s[len(s)-1]; s = s[:len(s)-1] // O(1), если порядок не важен\n```",
    "markdown": true
  },
  {
    "id": 244,
    "title": "Пакет slices (Go 1.21+) — что знать",
    "answer": "`Sort`, `SortFunc`, `BinarySearch`, `Contains`, `Index`, `Max`, `Min`, `Reverse`, `Compact`, `Equal`, `Insert`, `Delete`, `Clone`, `Grow`, `Chunk` (1.23, итератор), `Collect`, `Sorted`, `Values` (итераторы, 1.23).",
    "markdown": true
  },
  {
    "id": 245,
    "title": "Что может быть ключом map?",
    "answer": "Любой **comparable** тип: числа, строки, bool, указатели, каналы, интерфейсы, массивы и структуры из comparable-полей. Нельзя: слайсы, map, функции. Интерфейс с несравнимым динамическим значением скомпилируется, но **упадёт в рантайме**.",
    "markdown": true
  },
  {
    "id": 246,
    "title": "Как проверить наличие ключа?",
    "answer": "`v, ok := m[k]`. Для множества — `map[T]struct{}`.",
    "markdown": true
  },
  {
    "id": 247,
    "title": "sync.Map — когда использовать?",
    "answer": "Оптимизирован для двух сценариев: ключ записывается один раз, а читается много (кэши), и горутины работают с непересекающимися наборами ключей. С Go 1.24 внутри — конкурентное HashTrieMap, стал быстрее. В остальных случаях `map + RWMutex` проще и типобезопаснее.",
    "markdown": true
  },
  {
    "id": 248,
    "title": "Новые функции в strings/bytes",
    "answer": "`Cut` (1.18), `CutPrefix`/`CutSuffix` (1.20), `Lines`, `SplitSeq`, `FieldsSeq` — итераторы (1.24), `CutLast` (1.27), `bytes.Buffer.Peek` (1.26).",
    "markdown": true
  }
]);
