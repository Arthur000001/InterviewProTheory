window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["golang/basics"] = `<article class="question-card" id="question-123">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>123.</strong> Как преобразовать строку в число в Go?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Ответ:</strong> С помощью пакета <strong><code>strconv</code></strong>.</p>
<pre><code class="language-go">package main
import (
    "fmt"
    "strconv"
)

func main() {
    // В int:
    val, err := strconv.Atoi("123")
    // Или с явным контролем размера (int64):
    val64, err := strconv.ParseInt("123", 10, 64)
    fmt.Println(val, val64, err)
}</code></pre>
        </div>
</details>

</article>
<article class="question-card" id="question-124">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>124.</strong> Какой функцией стандартной библиотеки нужно воспользоваться для извлечения ошибки конкретного типа?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Ответ:</strong> Функцией <strong><code>errors.As()</code></strong> (проверяет цепочку обернутых ошибок по типу). Для проверки конкретного инстанса ошибки (sentinel error) используется <strong><code>errors.Is()</code></strong>.</p>
<pre><code class="language-go">var pathErr *os.PathError
if errors.As(err, &pathErr) {
    fmt.Println("Ошибка пути:", pathErr.Path)
}</code></pre>
        </div>
</details>

</article>
<article class="question-card" id="question-127">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>127.</strong> В каком варианте преобразования типа возможна паника и какая конструкция позволяет её избежать?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Ответ:</strong> Паника возникает при одиночном Type Assertion, если интерфейс хранит другой тип:</p>
<pre><code class="language-go">var i interface{} = "hello"
s := i.(int) // ПАНИКА! interface conversion: interface {} is string, not int

// Безопасный вариант (comma-ok idiom):
val, ok := i.(int)
if !ok {
    fmt.Println("Не удалось привести к int")
}</code></pre>
        </div>
</details>

</article>
<article class="question-card" id="question-128">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>128.</strong> Для чего нужен механизм seed в структурах map?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Ответ:</strong> Для защиты от атак типа <strong>HashDoS</strong> (Algorithmic Complexity Attack). При инициализации каждой <code>map</code> генерируется случайный криптографический <code>hash seed</code>. Это делает распределение ключей по бакетам непредсказуемым для злоумышленника, предотвращая вырождение карты в линейный список $O(N)$.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-132">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>132.</strong> Как устроен слайс под капотом (структура slice header) и по какому алгоритму растет capacity при использовании append?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Структура в памяти (24 байта на x64):</strong></p>
<pre><code class="language-go">type slice struct {
    array unsafe.Pointer // указатель на массив
    len   int            // текущая длина
    cap   int            // емкость
}</code></pre>
<p><strong>Рост cap:</strong> до 256 элементов емкость удваивается (x2). Для больших слайсов рост замедляется по формуле: <code>newcap += (newcap + 3*256) / 4</code> (~1.25x), чтобы избежать чрезмерного расхода памяти.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-142">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>142.</strong> Что такое интерфейс в Go? Как он устроен внутри (iface / eface)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p style="margin: 6px 0; color: var(--text-secondary); line-height: 1.65;">Рассмотрите следующий код с type assertion:</p>
<div style="margin: 10px 0;"><pre style="background: rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 8px; padding: 12px 16px; overflow-x: auto; font-family: 'Fira Code', 'JetBrains Mono', Consolas, monospace; font-size: 0.88rem; line-height: 1.55;"><code class="language-go">type Foo struct{}
func (f *Foo) A() {}
func (f *Foo) B() {}
func (f *Foo) C() {}

type AB interface {
	A()
	B()
}

type BC interface {
	B()
	C()
}

func main() {
	var f AB = &amp;Foo{}
	y := f.(BC) // сработает ли приведение типов?
}</code></pre></div>
          <div class="complete-answer"><p>Интерфейс Go задаёт набор методов. Тип удовлетворяет интерфейсу неявно, если его method set содержит эти методы. Значение интерфейса хранит динамический тип и данные; для непустого интерфейса используется метаинформация о методах, для пустого — только тип и данные. Интерфейс равен nil лишь тогда, когда отсутствуют и динамический тип, и значение: типизированный nil внутри интерфейса не равен nil. Важно учитывать method set значений и указателей.</p></div>

  
  
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(7)</small></h3>
<div class="clarification-item" id="question-142-followup-1" data-parent-question="question-142">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое empty interface и зачем он нужен?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Пустой интерфейс interface{} (псевдоним any) не требует методов, поэтому значение любого типа может ему удовлетворять. Он полезен для данных произвольного типа, но перед использованием обычно требуется проверка или приведение типа.</p></div>
</details>
</div>
<div class="clarification-item" id="question-142-followup-2" data-parent-question="question-142">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что хранится внутри интерфейса под капотом?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Интерфейсное значение концептуально содержит сведения о динамическом типе и само динамическое значение. У непустого интерфейса рантайм также знает таблицу методов; точная раскладка — деталь реализации, а не гарантия языка.</p></div>
</details>
</div>
<div class="clarification-item" id="question-142-followup-3" data-parent-question="question-142">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что произойдёт при неверном приведении типа?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Однорезультатное приведение x.(T) вызывает panic, если динамический тип не удовлетворяет T. Двухрезультатная форма v, ok := x.(T) вернёт ok=false без паники и нулевое значение T.</p></div>
</details>
</div>
<div class="clarification-item" id="question-142-followup-4" data-parent-question="question-142">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему nil интерфейса не всегда равен nil?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Интерфейс равен nil, только когда у него нет ни динамического типа, ни значения. Если поместить в интерфейс типизированный nil-указатель, динамический тип сохранится, поэтому сам интерфейс будет не nil.</p></div>
</details>
</div>
<div class="clarification-item" id="question-142-followup-5" data-parent-question="question-142">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое &quot;пустой интерфейс&quot; (interface{})?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Пустой интерфейсный тип не описывает методы. Любой объект удовлетворяет пустому
    интерфейсу.</p></div>
</details>
</div>
<div class="clarification-item" id="question-142-followup-6" data-parent-question="question-142">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Когда допустимо применять пустой интерфейс?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">В случае реализации кода, который должен уметь работать с любым типом данных.
    Например, функция fmt.Print стандартной библиотеки.</p></div>
</details>
</div>
<div class="clarification-item" id="question-142-followup-7" data-parent-question="question-142">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Каковы основные отличия применения интерфейса в Go от интерфейсов классического ООП-языка (Java, C#, etc)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Разница в том, что обычно в ООП-языках имплементация интерфейса указывается для
    класса явно, в Go имплементация неявная (duck typing).</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-144">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>144.</strong> Что такое замыкание? Приведите пример использования замыкания.</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer"><p>Замыкание — функция, которая использует переменные из окружающей области видимости после выхода из неё. Например, функция-счётчик может хранить локальное состояние между вызовами. Захваченные переменные живут столько, сколько нужно замыканию; если оно уходит за пределы функции, компилятор может разместить их в куче. При параллельном вызове доступ к общему состоянию нужно синхронизировать.</p></div>

  <div style="margin: 12px 0; padding: 12px 16px; background: rgba(245, 158, 11, 0.08); border-left: 4px solid #f59e0b; border-radius: 6px;">
    <strong style="color: #f59e0b; display: block; margin-bottom: 8px; font-size: 0.95rem;">🟡 Базовый уровень:</strong>
    <div style="color: var(--text-secondary); line-height: 1.65;"><p style="margin: 6px 0; color: var(--text-secondary); line-height: 1.65;">Замыкание - это функция, которая ссылается к переменным вне ее тела. Функция имеет<br>доступ к связанным переменным, а также может присваивать им значения<br>Пример:</p>
<div style="margin: 10px 0;"><pre style="background: rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 8px; padding: 12px 16px; overflow-x: auto; font-family: 'Fira Code', 'JetBrains Mono', Consolas, monospace; font-size: 0.88rem; line-height: 1.55;"><code class="language-go">func accum() func(int) int {
	sum := 0
	return func(x int) int {
		sum += x
		return sum
	}
}</code></pre></div>
<p style="margin: 6px 0; color: var(--text-secondary); line-height: 1.65;">Функция accum возвращает замыкание</p></div>
  </div>
        </div>
</details>

</article>
<article class="question-card" id="question-147">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>147.</strong> Что такое слайс? Как он устроен?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer"><p>Слайс — дескриптор массива: указатель на базовый массив, длина и ёмкость. Несколько слайсов могут разделять один массив, поэтому изменения элементов видны через другие представления. <code>append</code> использует свободную ёмкость или выделяет новый массив и копирует элементы; полученный слайс нужно сохранить. Рост ёмкости зависит от рантайма и размера данных, поэтому нельзя полагаться на фиксированный коэффициент.</p></div>

  
  
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(6)</small></h3>
<div class="clarification-item" id="question-147-followup-1" data-parent-question="question-147">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ На что влияет параметр вместимости слайса cap(acity)?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Cap — ключевой параметр для выделения памяти, влияет на производительность
    вставки в слайс: в случае, если вместимость на момент определения была задана
    недостаточной, вставка в слайс приведет к частому выделению памяти по мере
    добавления новых элементов. В идеале, capacity слайса в момент создания должна быть
    указана максимально близкой к плановому количеству элементов.</p></div>
</details>
</div>
<div class="clarification-item" id="question-147-followup-2" data-parent-question="question-147">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Какие способы безопасного копирования слайсов вы знаете?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Функция copy(dst, src) копирует элементы в другой заранее выделенный слайс; для независимой копии удобно append([]T(nil), src...). Простое присваивание слайса копирует только заголовок и оставляет общий базовый массив.</p></div>
</details>
</div>
<div class="clarification-item" id="question-147-followup-3" data-parent-question="question-147">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как происходит выделение памяти при росте слайса через append? К каким негативным последствиям может неправильное понимание будущего размера слайса в момент его создания?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">При размере слайса менее 1024 элементов размер памяти увеличивается вдвое. При
    размере среза &gt; 1024 элементов, срез увеличивается на четверть текущего размера.
    Операция вставки в слайс имеет серьезные последствия для памяти - при увеличении
    capacity массив будет скопирован в новый и размер выделенной памяти будет расти по
    своей внутренней логике, лишь отчасти связанной с требуемой емкостью.</p></div>
</details>
</div>
<div class="clarification-item" id="question-147-followup-4" data-parent-question="question-147">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Когда сборщик мусора удалит массив под слайсом?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Массив будет удален только после того, как не остается ни одного слайса, который
    ссылается на элементы этого массива.</p></div>
</details>
</div>
<div class="clarification-item" id="question-147-followup-5" data-parent-question="question-147">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Какие особенности получения нового среза от ранее существующего слайса вы знаете?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Слайсниг не производит копирование данных слайса. Создаётся новое значение слайса,
    указывающее на исходный массив.</p></div>
</details>
</div>
<div class="clarification-item" id="question-147-followup-6" data-parent-question="question-147">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Чем опасно создание через make слайса с явно указанными len &amp; cap?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">При создании слайса с указаной длиной и емкостью будет выделена память под
    емкость и при этом инициализированы значениями по умолчанию (для типа элементов
    слайса) len элементов массива. В дальнейшем они будут участвовать в итерировании и
    являться реальными значениями массива, которые могут внести искажение в данные.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-148">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text" style="flex: 1 1 auto; min-width: 0; word-break: break-word; line-height: 1.5;"><strong>148.</strong> Что из себя представляет строка в Go?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          
          <div class="complete-answer"><p>Строка Go — неизменяемая последовательность байтов; она может содержать UTF-8, но это не гарантируется типом. <code>len</code> считает байты, <code>range</code> декодирует руны Unicode и возвращает байтовые индексы. Для числа рун используют <code>utf8.RuneCountInString</code>; доступ по индексу возвращает байт. Конкатенация и преобразования могут выделять память, поэтому для многих добавлений удобен <code>strings.Builder</code>.</p></div>

  
  
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(1)</small></h3>
<div class="clarification-item" id="question-148-followup-1" data-parent-question="question-148">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Чем отличается байт от руны в Go?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Руны это тип в GO, int32, предназначен для представления Unicode и символов для
    кодирования которых нужно 32 бита</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-150">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>150.</strong> Как устроена map в современных версиях Go?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Map — хеш-таблица с неупорядоченной итерацией; одновременная запись без синхронизации недопустима. Начиная с Go 1.24 стандартная реализация основана на Swiss Tables: группы слотов и управляющие байты помогают быстро находить кандидатов. Старое описание с overflow buckets относится к прежней реализации и не является гарантией языка.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(4)</small></h3>
<div class="clarification-item" id="question-150-followup-1" data-parent-question="question-150">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как Go решает коллизии в map?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Map сравнивает хеши и затем ключи-кандидаты. В реализации Go 1.24+ используются группы слотов Swiss Table и пробирование при коллизиях; точное устройство map не закреплено спецификацией языка.</p></div>
</details>
</div>
<div class="clarification-item" id="question-150-followup-2" data-parent-question="question-150">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что такое overflow buckets?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Overflow buckets — механизм прежней реализации map Go, когда переполненная корзина ссылалась на следующую. В реализации на Swiss Tables с Go 1.24 применяется пробирование групп, поэтому описывать overflow buckets как текущую обязательную структуру неверно.</p></div>
</details>
</div>
<div class="clarification-item" id="question-150-followup-3" data-parent-question="question-150">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как работает rehash в Go?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">При росте map её внутренние таблицы перераспределяют записи и могут делиться на части; работа выполняется по мере роста. Для пользователя гарантированы операции map, а не конкретный алгоритм rehash — он зависит от версии Go.</p></div>
</details>
</div>
<div class="clarification-item" id="question-150-followup-4" data-parent-question="question-150">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Почему map не потокобезопасен?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Одновременная запись или запись параллельно с чтением без синхронизации создаёт гонку и может привести к ошибке рантайма или некорректному результату. Защитите map мьютексом, передавайте владение одной горутине или используйте sync.Map в подходящих сценариях.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-153">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>153.</strong> Когда вычисляются аргументы defer и в каком порядке выполняются вызовы?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Аргументы отложенного вызова вычисляются в момент выполнения defer, а сама функция запускается при выходе из окружающей функции. Несколько defer выполняются в обратном порядке, включая выход через panic. Замыкание может обращаться к именованному результату и изменить его перед возвратом.</p>
        
        </div>
</details>
<div class="clarifications" aria-label="Уточнения к вопросу"><h3>Уточнения <small>(4)</small></h3>
<div class="clarification-item" id="question-153-followup-1" data-parent-question="question-153">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ В каком порядке выполняются defer’ы?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Отложенные вызовы выполняются в обратном порядке их регистрации: последний defer запускается первым. Аргументы вызова вычисляются уже при выполнении оператора defer.</p></div>
</details>
</div>
<div class="clarification-item" id="question-153-followup-2" data-parent-question="question-153">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Как defer влияет на производительность?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Регистрация и выполнение defer имеют накладные расходы, хотя компилятор оптимизирует распространённые случаи. В горячем участке измеряйте их профилем; не заменяйте defer вручную без необходимости, потому что он помогает закрывать ресурсы на всех путях выхода.</p></div>
</details>
</div>
<div class="clarification-item" id="question-153-followup-3" data-parent-question="question-153">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Что произойдёт при panic, если есть несколько defer’ов?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">При раскрутке panic выполняются defer текущей функции в обратном порядке, затем вызывающей и так далее. Если один defer вызывает recover в нужной горутине, он может перехватить panic; os.Exit не запускает defer.</p></div>
</details>
</div>
<div class="clarification-item" id="question-153-followup-4" data-parent-question="question-153">
<label class="checklist-item clarification-question"><input type="checkbox"><span class="question-text">↳ Можно ли использовать defer в цикле?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box"><p style="white-space: pre-wrap;">Можно, но отложенные вызовы выполнятся только при выходе из окружающей функции, а не в конце каждой итерации. Для своевременного закрытия ресурса вынесите итерацию в отдельную функцию или закройте ресурс явно.</p></div>
</details>
</div>
</div>
</article>
<article class="question-card" id="question-163">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>163.</strong> Почему порядок обхода map в Go нельзя считать постоянным?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>Спецификация Go не определяет порядок обхода map, и он может меняться между запусками и даже повторными обходами. Код не должен полагаться на этот порядок. Для стабильного вывода собирают ключи в слайс, сортируют его и обращаются к значениям по отсортированным ключам.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-165">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>165.</strong> Чем rune отличается от byte при работе со строками Go?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          
          <p>byte — псевдоним uint8, единица хранения данных в строке UTF-8. rune — псевдоним int32 для кодовой точки Unicode. Индексация строки возвращает байт; range по строке декодирует руны. Одна руна может занимать несколько байтов, а видимый символ — несколько рун.</p>
        </div>
</details>

</article>`;
