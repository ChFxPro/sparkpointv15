import {
  calculateHomaIR,
  KNOW_YOUR_NUMBERS,
  type WorksheetState,
} from '../../data/knowYourNumbers';

function PrintFooter({ side }: { side: 1 | 2 }) {
  return (
    <footer className="kyn-print-footer">
      <strong>
        {side === 1
          ? KNOW_YOUR_NUMBERS.print.side1Footer
          : KNOW_YOUR_NUMBERS.print.side2Footer}
      </strong>
      <span>{KNOW_YOUR_NUMBERS.print.sheetNote}</span>
    </footer>
  );
}

export function PrintGuidePage() {
  return (
    <section className="kyn-print-page kyn-print-guide-page">
      <header className="kyn-print-guide-header">
        <span>Metabolic health field guide</span>
        <h1>{KNOW_YOUR_NUMBERS.title}</h1>
        <p>{KNOW_YOUR_NUMBERS.subtitle}</p>
      </header>

      <p className="kyn-print-intro">{KNOW_YOUR_NUMBERS.introduction}</p>

      <div className="kyn-print-groups">
        {KNOW_YOUR_NUMBERS.groups.map((group) => (
          <section className="kyn-print-group" key={group.id}>
            <h2>{group.title}</h2>
            {group.metrics.map((metric) => (
              <article className="kyn-print-metric" key={metric.number}>
                <span className="kyn-print-number">{String(metric.number).padStart(2, '0')}</span>
                <div>
                  <h3>{metric.name}</h3>
                  <p>{metric.description}</p>
                </div>
                <div className="kyn-print-reading">
                  <strong>{metric.value}</strong>
                  <span>{metric.preferred}</span>
                </div>
              </article>
            ))}
          </section>
        ))}
      </div>

      <aside className="kyn-print-apoe">
        <strong>APOE conversation</strong>
        <span>{KNOW_YOUR_NUMBERS.apoeNote}</span>
      </aside>

      <PrintFooter side={1} />
    </section>
  );
}

function PrintCheck({ checked }: { checked: boolean }) {
  return <span className={`kyn-print-check${checked ? ' is-checked' : ''}`} aria-hidden="true" />;
}

function DisplayValue({ value, fallback = '' }: { value: string; fallback?: string }) {
  return <span className={value ? 'has-value' : ''}>{value || fallback}</span>;
}

export function PrintWorksheetPage({ state }: { state: WorksheetState }) {
  const result = calculateHomaIR(state.glucose, state.insulin);

  return (
    <section className="kyn-print-page kyn-print-worksheet-page">
      <header className="kyn-print-worksheet-header">
        <span>Know Your Numbers</span>
        <h1>{KNOW_YOUR_NUMBERS.calculator.title}</h1>
        <p>{KNOW_YOUR_NUMBERS.calculator.subtitle}</p>
      </header>

      <div className="kyn-print-steps">
        <section className="kyn-print-step kyn-print-step--ask">
          <span className="kyn-print-step-number">01</span>
          <div>
            <h2>Ask</h2>
            <p>{KNOW_YOUR_NUMBERS.calculator.steps[0].body}</p>
            <div className="kyn-print-checks">
              <span><PrintCheck checked={state.askGlucose} /> Fasting glucose</span>
              <span><PrintCheck checked={state.askInsulin} /> Fasting insulin</span>
            </div>
          </div>
        </section>

        <section className="kyn-print-step kyn-print-step--record">
          <span className="kyn-print-step-number">02</span>
          <div>
            <h2>Record</h2>
            <div className="kyn-print-record-grid">
              <label>
                Collection date
                <DisplayValue value={state.collectionDate} />
              </label>
              <label>
                Fasting duration
                <DisplayValue value={state.fastingHours} fallback="                     hours" />
              </label>
              <label>
                Glucose · mg/dL
                <DisplayValue value={state.glucose} />
              </label>
              <label>
                Insulin · µIU/mL
                <DisplayValue value={state.insulin} />
              </label>
            </div>
          </div>
        </section>

        <section className="kyn-print-step kyn-print-step--calculation">
          <span className="kyn-print-step-number">03</span>
          <div>
            <h2>Calculate</h2>
            <p>Glucose × Insulin ÷ 405 = Your HOMA-IR</p>
            <div className="kyn-print-equation">
              <div>
                <span>Glucose</span>
                <strong>{state.glucose}</strong>
              </div>
              <b>×</b>
              <div>
                <span>Insulin</span>
                <strong>{state.insulin}</strong>
              </div>
              <b>÷</b>
              <div className="kyn-print-divisor">
                <span>Divisor</span>
                <strong>405</strong>
              </div>
              <b>=</b>
              <div className="kyn-print-result">
                <span>Your HOMA-IR</span>
                <strong>{result}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="kyn-print-step kyn-print-step--understand">
          <span className="kyn-print-step-number">04</span>
          <div>
            <h2>Understand Your Result</h2>
            <p>{KNOW_YOUR_NUMBERS.calculator.steps[3].body}</p>
            <div className="kyn-print-ranges">
              <span><strong>Below 1.5</strong> Preferred reference</span>
              <span><strong>Below 2</strong> General reference</span>
            </div>
          </div>
        </section>

        <section className="kyn-print-step kyn-print-step--notes">
          <span className="kyn-print-step-number">05</span>
          <div>
            <h2>Notes &amp; Questions</h2>
            <div className={`kyn-print-notes${state.notes ? ' has-value' : ''}`}>{state.notes}</div>
          </div>
        </section>
      </div>

      <aside className="kyn-print-prompt">
        <strong>Conversation starter</strong>
        <span>“{KNOW_YOUR_NUMBERS.clinicianPrompt}”</span>
      </aside>

      <p className="kyn-print-disclaimer">{KNOW_YOUR_NUMBERS.disclaimer}</p>
      <PrintFooter side={2} />
    </section>
  );
}
