window.InterviewProQuestionCatalog = {
  additionalQuestionRanges: {
    'algorithms/graphs': [[399,399]],
    'architecture/distributed': [[371,373],[375,380]],
    'architecture/messaging': [[381,388]],
    'architecture/scenarios': [[408,408],[411,412]],
    'architecture/service_patterns': [[402,403],[406,407]],
    'databases/querying': [[390,391]],
    'databases/scaling': [[396,398]],
    'golang/backend': [[330,330],[333,333],[335,335],[339,339]],
    'golang/build_security': [[369,370]],
    'golang/collections_deep': [[243,243],[245,247]],
    'golang/concurrency_patterns': [[273,275],[278,278]],
    'golang/context_deep': [[308,308]],
    'golang/design': [[341,342],[345,345]],
    'golang/errors': [[261,261],[264,269]],
    'golang/generics': [[300,300],[303,304]],
    'golang/language': [[184,185],[187,195],[197,202]],
    'golang/optimization': [[353,353],[360,360],[362,362]],
    'golang/runtime_deep': [[289,294],[296,297]],

    'golang/synchronization': [[281,281],[283,283],[285,285]],
    'golang/testing': [[318,318],[321,322],[325,325]],
    'golang/types': [[253,254],[257,258],[260,260]],
    'reliability/resilience': [[419,419],[423,423]],
  },
  clarificationCounts: {
    'algorithms/graphs': 1,
    'architecture/messaging': 8,
    'architecture/scenarios': 3,

    'architecture/service_patterns': 4,
    'architecture/services': 3,
    'databases/indexes': 16,
    'databases/postgresql': 16,
    'databases/querying': 2,
    'databases/redis': 12,
    'databases/scaling': 3,
    'databases/sql': 19,
    'golang/basics': 22,

    'golang/concurrency': 44,

    'golang/language': 17,
    'golang/runtime': 21,

    'linux/kernel': 6,
    'linux/memory': 9,
    'linux/processes': 15,
    'network/http': 4,

    'reliability/observability': 7,
    'reliability/resilience': 2,
  },
  questions: [
    {"id":2,"topic":"reliability/sre","title":"Что такое SLA, SLO и SLI? Как понять, что сервис деградирует до того, как клиенты пожалуются?"},
    {"id":5,"topic":"linux/processes","title":"Какими способами можно посмотреть файлы, открытые процессом?"},
    {"id":18,"topic":"linux/memory","title":"Как устроена виртуальная память в Linux (Virtual Memory, RSS, Swap, Page Faults)?"},
    {"id":19,"topic":"linux/memory","title":"Что такое страница памяти?"},
    {"id":20,"topic":"linux/processes","title":"Что такое сисколл?"},
    {"id":21,"topic":"linux/kernel","title":"Какие знаешь примитивы синхронизации в ОС?"},
    {"id":22,"topic":"linux/kernel","title":"Что такое user space и kernel space? Зачем нужно такое разделение?"},
    {"id":24,"topic":"linux/memory","title":"На голом сервере запущен сервис с утечкой памяти. Что произойдет, когда память закончится?"},
    {"id":25,"topic":"linux/processes","title":"Чем отличается процесс от системного потока?"},
    {"id":27,"topic":"linux/processes","title":"Как убить процесс linux'e?"},
    {"id":30,"topic":"network/transport","title":"Чем отличается UDP от TCP?"},
    {"id":38,"topic":"network/kubernetes","title":"В чем разница между реализациями сетевого прокси в Kubernetes: iptables vs IPVS vs eBPF (Cilium)?"},
    {"id":39,"topic":"network/kubernetes","title":"В кластере K8s внезапно подскочили задержки DNS-запросов. В чем суть проблемы ndots:5 в /etc/resolv.conf?"},
    {"id":44,"topic":"network/http","title":"В чем разница между proxy / reverse-proxy?"},
    {"id":48,"topic":"network/http","title":"Чем HTTP/1.1 отличается от HTTP/2?"},
    {"id":50,"topic":"containers/delivery","title":"Путь от Git Push до продакшена (Zero Downtime GitOps): как устроен полный цикл сборки, тестирования, безопасной доставки через werf и раскатки в Kubernetes?"},
    {"id":51,"topic":"containers/docker","title":"Какие практики для уменьшения размера docker-образа существуют?"},
    {"id":52,"topic":"containers/docker","title":"Что такое контейнер под капотом Linux? Какие механизмы ядра (namespaces, cgroups, chroot/pivot_root) обеспечивают изоляцию?"},
    {"id":57,"topic":"containers/docker","title":"Как устроен кэш слоев в Docker и как оптимизировать Dockerfile для ускорения CI/CD сборки в разы?"},
    {"id":59,"topic":"containers/delivery","title":"В чем отличие стратегий деплоя Blue-Green, Canary и RollingUpdate? Какие риски и преимущества у каждой?"},
    {"id":60,"topic":"containers/delivery","title":"Что такое Immutable Infrastructure (неизменяемая инфраструктура) и почему запрещено вносить ручные правки на серверах через SSH?"},
    {"id":62,"topic":"kubernetes/operations","title":"Почему namespace может висеть в статусе Terminating?"},
    {"id":63,"topic":"kubernetes/architecture","title":"Зачем нужен Kubelet?"},
    {"id":65,"topic":"kubernetes/architecture","title":"Какой компонент kubernetes хранит состояние ресурсов кластера?"},
    {"id":71,"topic":"kubernetes/architecture","title":"Как устроен etcd в Kubernetes? Что такое кворум и что произойдет с кластером из 3 master-нод, если откажут 1 нода или 2 ноды?"},
    {"id":72,"topic":"kubernetes/operations","title":"Как происходит Graceful Shutdown пода при обновлении Deployment (RollingUpdate)? Какова роль preStop hook, SIGTERM и задержки удаления из Endpoints?"},
    {"id":79,"topic":"kubernetes/operations","title":"Что такое Finalizers в Kubernetes и как они могут заблокировать удаление ресурсов?"},
    {"id":88,"topic":"databases/redis","title":"Как устроен Redis под капотом (single-threaded event loop, RDB snapshot vs AOF log)?"},
    {"id":89,"topic":"databases/distributed","title":"Чем синхронная репликация отличается от асинхронной и полусинхронной, и в чем компромисс между производительностью и надежностью (RPO/RTO)?"},
    {"id":90,"topic":"databases/sql","title":"Что такое транзакция? Какие уровни изоляции транзакций существуют в РСУБД?"},
    {"id":91,"topic":"databases/sql","title":"Какие аномалии могут быть при параллельном исполнении транзакций?"},
    {"id":92,"topic":"databases/postgresql","title":"Какие типы локов (блокировок) есть в PostgreSQL? Кто берет эти локи?"},
    {"id":93,"topic":"databases/postgresql","title":"Что такое MVCC в PostgreSQL?"},
    {"id":94,"topic":"databases/postgresql","title":"Зачем PostgreSQL нужен VACUUM и чем отличается VACUUM FULL?"},
    {"id":95,"topic":"databases/indexes","title":"Что делает индекс и какую цену за него платит запись?"},
    {"id":97,"topic":"databases/indexes","title":"Чем EXPLAIN ANALYZE отличается от EXPLAIN?"},
    {"id":99,"topic":"databases/sql","title":"Что произойдёт, если строка нарушит CHECK в PostgreSQL?"},
    {"id":102,"topic":"databases/sql","title":"Как ORDER BY сортирует по нескольким полям?"},
    {"id":104,"topic":"databases/postgresql","title":"Зачем выполнять ANALYZE после крупного изменения данных?"},
    {"id":105,"topic":"databases/indexes","title":"Когда применяют REINDEX?"},
    {"id":107,"topic":"databases/indexes","title":"Какие риски у ALTER TABLE на большой таблице?"},
    {"id":108,"topic":"databases/indexes","title":"Чем CREATE INDEX CONCURRENTLY отличается от обычного создания?"},
    {"id":111,"topic":"databases/sql","title":"Когда использовать DELETE вместо TRUNCATE?"},
    {"id":112,"topic":"databases/sql","title":"Что возвращает UPDATE ... RETURNING?"},
    {"id":113,"topic":"databases/postgresql","title":"Что делает autovacuum?"},
    {"id":118,"topic":"reliability/observability","title":"В чем разница между Pull-моделью (Prometheus) и Push-моделью сбора метрик? Каковы плюсы и минусы каждой?"},
    {"id":120,"topic":"reliability/observability","title":"В чем разница между логами (Loki/Elasticsearch/ClickHouse), метриками (Prometheus/VictoriaMetrics) и трейсами (OpenTelemetry/Jaeger)? Когда нужны трейсы?"},
    {"id":121,"topic":"reliability/sre","title":"Что такое правило четырех золотых сигналов (Four Golden Signals) в Google SRE (Latency, Traffic, Errors, Saturation)?"},
    {"id":123,"topic":"golang/basics","title":"Как преобразовать строку в число в Go?"},
    {"id":124,"topic":"golang/basics","title":"Какой функцией стандартной библиотеки нужно воспользоваться для извлечения ошибки конкретного типа?"},
    {"id":125,"topic":"golang/runtime","title":"Планировщик какого семейства используется в go?"},
    {"id":126,"topic":"golang/runtime","title":"Сколько горутин может единовременно выполняться на логическом процессоре в go?"},
    {"id":127,"topic":"golang/basics","title":"В каком варианте преобразования типа возможна паника и какая конструкция позволяет её избежать?"},
    {"id":128,"topic":"golang/basics","title":"Для чего нужен механизм seed в структурах map?"},
    {"id":129,"topic":"golang/concurrency","title":"Что такое утечка горутин (goroutine leak), как ее обнаружить с помощью pprof и как предотвратить в коде?"},
    {"id":131,"topic":"golang/concurrency","title":"Чем небуферизованный канал отличается от буферизованного, и что произойдет при чтении/записи/закрытии nil канала или уже закрытого канала?"},
    {"id":132,"topic":"golang/basics","title":"Как устроен слайс под капотом (структура slice header) и по какому алгоритму растет capacity при использовании append?"},
    {"id":133,"topic":"golang/concurrency","title":"В чем разница между sync.Mutex и sync.RWMutex? Почему мьютекс нельзя передавать по значению (копировать)?"},
    {"id":135,"topic":"golang/concurrency","title":"Как реализовать паттерн Worker Pool на горутинах и каналах для параллельной обработки пачки задач с ограничением конкурентности?"},
    {"id":136,"topic":"golang/runtime","title":"Как устроен детектор гонок (Race Detector) в Go (go test -race) и как он находит гонки данных во время выполнения?"},
    {"id":137,"topic":"golang/runtime","title":"Как устроен сборщик мусора (Garbage Collector) в Go (трехцветный триколорный алгоритм, фазы STW, влияние GOGC и GOMEMLIMIT)?"},
    {"id":139,"topic":"golang/runtime","title":"В чем разница между стеком и кучей (stack vs heap) в Go, и как компилятор принимает решение об Escape Analysis (go build -gcflags='-m')?"},
    {"id":140,"topic":"golang/runtime","title":"Что такое GOMAXPROCS? Зачем это нужно?"},
    {"id":141,"topic":"golang/runtime","title":"pprof. Что это такое и зачем нужно?"},
    {"id":142,"topic":"golang/basics","title":"Что такое интерфейс в Go? Как он устроен внутри (iface / eface)?"},
    {"id":143,"topic":"golang/concurrency","title":"Чем горутины отличаются от потоков?"},
    {"id":144,"topic":"golang/basics","title":"Что такое замыкание? Приведите пример использования замыкания."},
    {"id":145,"topic":"golang/concurrency","title":"Что такое mutex и зачем он нужен?"},
    {"id":146,"topic":"golang/concurrency","title":"Что такое каналы? Зачем нужны?"},
    {"id":147,"topic":"golang/basics","title":"Что такое слайс? Как он устроен?"},
    {"id":148,"topic":"golang/basics","title":"Что из себя представляет строка в Go?"},
    {"id":149,"topic":"golang/runtime","title":"Как устроен планировщик Go: G, M, P и work stealing?"},
    {"id":150,"topic":"golang/basics","title":"Как устроена map в современных версиях Go?"},
    {"id":151,"topic":"golang/concurrency","title":"Как select выбирает операции над каналами?"},
    {"id":152,"topic":"golang/concurrency","title":"Зачем нужен context.Context и что в нём передавать?"},
    {"id":153,"topic":"golang/basics","title":"Когда вычисляются аргументы defer и в каком порядке выполняются вызовы?"},
    {"id":154,"topic":"golang/runtime","title":"Как Go GC находит и освобождает недоступные объекты?"},
    {"id":155,"topic":"golang/concurrency","title":"Чем отличаются sync.Once и sync.Pool?"},
    {"id":156,"topic":"golang/concurrency","title":"Когда выбирать sync.Mutex, а когда sync.RWMutex?"},
    {"id":157,"topic":"golang/concurrency","title":"Чем гонка данных отличается от deadlock?"},
    {"id":158,"topic":"golang/concurrency","title":"Что проверяет go test -race и чего детектор не гарантирует?"},
    {"id":160,"topic":"golang/concurrency","title":"Как канал Go хранит ожидающих отправителей и получателей?"},
    {"id":161,"topic":"golang/concurrency","title":"Как отличить нулевое значение из канала от чтения после закрытия?"},
    {"id":163,"topic":"golang/basics","title":"Почему порядок обхода map в Go нельзя считать постоянным?"},
    {"id":164,"topic":"golang/concurrency","title":"Что происходит при чтении, записи и закрытии nil-канала?"},
    {"id":165,"topic":"golang/basics","title":"Чем rune отличается от byte при работе со строками Go?"},
    {"id":168,"topic":"architecture/services","title":"Что представляет собой протокол HTTP? Из каких основных частей состоят HTTP-запрос и ответ?"},
    {"id":169,"topic":"reliability/observability","title":"Какие существуют инструменты для мониторинга и отладки микросервисов?"},
    {"id":171,"topic":"reliability/observability","title":"Как работают распределённые трассировки, например Jaeger?"},
    {"id":173,"topic":"databases/redis","title":"Для каких задач подходит Redis?"},
    {"id":174,"topic":"databases/redis","title":"Когда кеш помогает и как измерить его пользу?"},
    {"id":175,"topic":"databases/redis","title":"Как избежать рассинхронизации кеша и базы данных?"},
    {"id":176,"topic":"databases/redis","title":"Почему Redis быстро обслуживает много соединений?"},
    {"id":177,"topic":"databases/redis","title":"Как безопасно задать ключ блокировки в Redis?"},



    ...(window.InterviewProAdditionalQuestions || [])
  ],
  relatedGroups: [
    [2, 121],
    [120, 169, 171],
    [2, 118, 121],




    [25, 22],
    [20, 22],
    [18, 19, 24],



    [21, 133, 145, 156, 157],






    [48, 168],

    [38, 39],
    [38, 39],
    [50, 59, 60, 72],
    [51, 57, 50],



    [63, 52],
    [63, 65],

    [65, 71],
    [62, 79],






    [71, 89],

    [93, 94, 113],
    [90, 91, 92, 93],
    [99, 112],
    [102, 97],
    [95, 97, 104, 108],

    [107, 108],
    [95, 97],
    [111, 112],


    [88, 176, 173],

    [174, 175],


    [123, 127, 148, 165],
    [124, 127, 142],
    [128, 150, 163],
    [132, 147, 139],
    [144, 153, 139],
    [129, 152, 135, 143],
    [131, 146, 151, 160, 161, 164],
    [133, 145, 156, 157, 158, 136],
    [155, 133, 145],
    [125, 126, 140, 149],
    [136, 157, 158],
    [137, 154, 139],
    [141, 129, 137],

    [168, 44, 48],


    [118, 121],
    [120, 169, 171, 141]
  ]
};
