window.InterviewProContent["golang/context_deep"] = window.InterviewProBuildCards("golang/context_deep", [
  {
    "id": 308,
    "title": "Интерфейс",
    "answer": "Context передаёт дедлайн, сигнал и результат отмены, а также значения, связанные с операцией.\n\n```go\ntype Context interface {\n    Deadline() (deadline time.Time, ok bool)\n    Done() <-chan struct{}\n    Err() error          // nil, Canceled или DeadlineExceeded\n    Value(key any) any\n}\n```",
    "markdown": true
  },
]);
