window.InterviewProContent["golang/testing"] = window.InterviewProBuildCards("golang/testing", [
  {
    "id": 316,
    "title": "Table-driven тесты",
    "answer": "```go\nfunc TestAbs(t *testing.T) {\n    tests := []struct{ name string; in, want int }{\n        {\"positive\", 5, 5}, {\"negative\", -5, 5}, {\"zero\", 0, 0},\n    }\n    for _, tt := range tests {\n        t.Run(tt.name, func(t *testing.T) {\n            t.Parallel()\n            if got := Abs(tt.in); got != tt.want {\n                t.Errorf(\"Abs(%d) = %d, want %d\", tt.in, got, tt.want)\n            }\n        })\n    }\n}\n```\nС Go 1.22 `tt := tt` перед `t.Parallel()` больше не нужен.",
    "markdown": true
  },
  {
    "id": 317,
    "title": "t.Error vs t.Fatal, t.Helper, t.Cleanup, t.TempDir, t.Setenv, t.Context",
    "answer": "- `Error` — отметить провал и продолжить; `Fatal` — провал и `runtime.Goexit` (нельзя вызывать из других горутин!).\n- `t.Helper()` — строки ошибок указывают на вызывающего.\n- `t.Cleanup(f)` — как `defer`, но для теста и подтестов.\n- `t.Context()` (1.24), `t.Chdir()` (1.24), `t.ArtifactDir()` (1.26), `t.Output()` (1.25).",
    "markdown": true
  },
  {
    "id": 318,
    "title": "Бенчмарки",
    "answer": "```go\nfunc BenchmarkParse(b *testing.B) {\n    for b.Loop() {        // Go 1.24+: не нужно b.ResetTimer, компилятор не выкинет тело\n        Parse(input)\n    }\n}\n```\n`go test -bench=. -benchmem -count=10 | tee new.txt` и сравнение через `benchstat old.txt new.txt`.",
    "markdown": true
  },
  {
    "id": 319,
    "title": "Фаззинг (Go 1.18+)",
    "answer": "Фаззинг проверяет свойство функции на автоматически созданных входных данных.\n\n```go\nfunc FuzzReverse(f *testing.F) {\n    f.Add(\"hello\")\n    f.Fuzz(func(t *testing.T, s string) {\n        if Reverse(Reverse(s)) != s { t.Fatal(s) }\n    })\n}\n```\n`go test -fuzz=FuzzReverse -fuzztime=30s`.",
    "markdown": true
  },
  {
    "id": 320,
    "title": "testing/synctest (Go 1.25)",
    "answer": "Детерминированное тестирование кода с `time` и горутинами без реальных `Sleep`. См. [раздел про sync](#12-тестирование-конкурентного-кода-без-timesleep).",
    "markdown": true
  },
  {
    "id": 321,
    "title": "Покрытие",
    "answer": "`go test -coverprofile=c.out ./... && go tool cover -html=c.out`. Для интеграционных тестов — `go build -cover` + `GOCOVERDIR`.",
    "markdown": true
  },
  {
    "id": 322,
    "title": "pprof: какие профили бывают?",
    "answer": "| Профиль | Что показывает |\n|---|---|\n| `cpu` | где тратится процессорное время (семплирование 100 Гц) |\n| `heap` | `inuse_space` (сейчас в памяти) / `alloc_space` (всего выделено) |\n| `allocs` | все аллокации |\n| `goroutine` | стеки всех горутин |\n| `goroutineleak` | утёкшие горутины (Go 1.26 эксп., 1.27 по умолчанию) |\n| `block` | ожидание на каналах/мьютексах (включить `SetBlockProfileRate`) |\n| `mutex` | конкуренция за мьютексы (`SetMutexProfileFraction`) |\n\n```go\nimport _ \"net/http/pprof\" // регистрирует /debug/pprof/* в DefaultServeMux — не выставляйте наружу!\n```\n```bash\ngo tool pprof -http=:8080 http://localhost:6060/debug/pprof/profile?seconds=30\n```\nС Go 1.26 веб-интерфейс pprof по умолчанию открывает flame graph.",
    "markdown": true
  },
  {
    "id": 323,
    "title": "go tool trace и Flight Recorder",
    "answer": "Трассировка показывает работу планировщика, GC, блокировки по времени. **Go 1.25:** `runtime/trace.FlightRecorder` — держит последние секунды трейса в кольцевом буфере и сохраняет их, когда случилась аномалия (например, медленный запрос).",
    "markdown": true
  },
  {
    "id": 324,
    "title": "PGO (Profile-Guided Optimization)",
    "answer": "Положите CPU-профиль продакшена как `default.pgo` в пакет `main` — `go build` использует его для инлайнинга и девиртуализации. Эффект зависит от нагрузки и измеряется бенчмарком.",
    "markdown": true
  },
  {
    "id": 325,
    "title": "Линтеры",
    "answer": "`go vet` (обязателен), `staticcheck`, `golangci-lint` (агрегатор), `govulncheck` (уязвимости зависимостей), `go fix` — с Go 1.26 применяет модернайзеры (переводит код на `min/max`, `slices`, `range int`, `wg.Go` и т.д.).",
    "markdown": true
  },
{
  "id": 433,
  "title": "По каким признакам понять, что тест Go-сервиса действительно полезен?",
  "answer": "Хороший тест проверяет наблюдаемый контракт и важные инварианты, различает корректную и ошибочную реализацию и стабильно работает независимо от порядка запуска. Он покрывает границы, ошибки, отмену и конкуренцию там, где это часть контракта. Моки используют на границе внешних зависимостей, а не для дублирования каждого внутреннего вызова; для интеграций полезен отдельный слой тестов с реалистичным хранилищем.",
  "followups": [
    [
      "Достаточно ли высокого процента покрытия кода?",
      "Нет. Покрытие показывает исполненные строки, но не качество утверждений и сценариев. Полезнее проверять, ловит ли тест намеренно внесённую ошибку и понятен ли результат сбоя."
    ]
  ]
}
]);
