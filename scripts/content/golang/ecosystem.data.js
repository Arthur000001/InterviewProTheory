window.InterviewProContent = window.InterviewProContent || Object.create(null);
window.InterviewProContent["golang/ecosystem"] = `<article class="question-card" id="question-134">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>134.</strong> Что такое client-go и controller-runtime? Как устроен Reconciler loop при написании собственных утилит или операторов для Kubernetes?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong></p>
<ul>
  <li><strong>client-go:</strong> официальная библиотека для работы с K8s API (Informer, Lister, DynamicClient, Clientset).</li>
  <li><strong>controller-runtime:</strong> высокоуровневый фреймворк (база Kubebuilder), скрывающий рутину очередей и кэшей.</li>
</ul>
<p><strong>Reconciler:</strong> метод <code>Reconcile(ctx, req)</code> получает имя ресурса. Читает актуальное состояние из кэша, сравнивает со спекой и приводит реальность к желаемому, возвращая <code>ctrl.Result{RequeueAfter: ...}</code>.</p>
        </div>
</details>

</article>
<article class="question-card" id="question-138">
<label class="checklist-item main-question"><input type="checkbox"><span class="question-text"><strong>138.</strong> Как правильно протестировать функцию, взаимодействующую с внешним API или Kubernetes, с помощью интерфейсов и моков?</span></label>
<details class="answer-details"><summary>Показать ответ</summary>
<div class="answer-box">
          <p><strong>Суть:</strong> Принцип инверсии зависимостей. Зависеть не от конкретной структуры клиента, а от узкого интерфейса:</p>
<pre><code class="language-go">type K8sClient interface {
    GetPod(ctx context.Context, name string) (*Pod, error)
}

// В тестах передаем мок:
type MockK8sClient struct {
    mock.Mock
}
func (m *MockK8sClient) GetPod(ctx context.Context, name string) (*Pod, error) {
    args := m.Called(ctx, name)
    return args.Get(0).(*Pod), args.Error(1)
}</code></pre>
        </div>
</details>

</article>`;
