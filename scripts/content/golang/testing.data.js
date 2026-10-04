window.InterviewProContent["golang/testing"] = window.InterviewProBuildCards("golang/testing", [
  {
    "id": 318,
    "title": "Бенчмарки",
    "answer": "```go\nfunc BenchmarkParse(b *testing.B) {\n    for b.Loop() {        // Go 1.24+: не нужно b.ResetTimer, компилятор не выкинет тело\n        Parse(input)\n    }\n}\n```\n`go test -bench=. -benchmem -count=10 | tee new.txt` и сравнение через `benchstat old.txt new.txt`.",
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
    "id": 325,
    "title": "Линтеры",
    "answer": "`go vet` (обязателен), `staticcheck`, `golangci-lint` (агрегатор), `govulncheck` (уязвимости зависимостей), `go fix` — с Go 1.26 применяет модернайзеры (переводит код на `min/max`, `slices`, `range int`, `wg.Go` и т.д.).",
    "markdown": true
  },
]);
