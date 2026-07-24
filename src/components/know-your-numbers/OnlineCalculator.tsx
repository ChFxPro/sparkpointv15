import { RotateCcw, ShieldCheck } from 'lucide-react';
import {
  calculateHomaIR,
  KNOW_YOUR_NUMBERS,
  type WorksheetState,
} from '../../data/knowYourNumbers';

interface OnlineCalculatorProps {
  state: WorksheetState;
  onChange: (patch: Partial<WorksheetState>) => void;
}

interface NumberFieldProps {
  id: string;
  label: string;
  unit?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: string;
  max?: string;
}

function NumberField({
  id,
  label,
  unit,
  value,
  onChange,
  placeholder,
  min = '0.01',
  max,
}: NumberFieldProps) {
  const invalid = value !== '' && (!Number.isFinite(Number(value)) || Number(value) <= 0);

  return (
    <label className="kyn-field" htmlFor={id}>
      <span>
        {label}
        {unit ? <small>{unit}</small> : null}
      </span>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        step="any"
        min={min}
        max={max}
        value={value}
        placeholder={placeholder}
        aria-invalid={invalid}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function OnlineCalculator({ state, onChange }: OnlineCalculatorProps) {
  const result = calculateHomaIR(state.glucose, state.insulin);
  const glucoseInvalid =
    state.glucose !== '' && (!Number.isFinite(Number(state.glucose)) || Number(state.glucose) <= 0);
  const insulinInvalid =
    state.insulin !== '' && (!Number.isFinite(Number(state.insulin)) || Number(state.insulin) <= 0);

  const clearLabValues = () => {
    onChange({ glucose: '', insulin: '' });
    requestAnimationFrame(() => document.querySelector<HTMLInputElement>('#kyn-record-glucose')?.focus());
  };

  return (
    <section className="kyn-calculator" aria-labelledby="kyn-calculator-title">
      <div className="kyn-calculator-heading">
        <span className="kyn-eyebrow">Bring this to your next appointment</span>
        <h2 id="kyn-calculator-title">{KNOW_YOUR_NUMBERS.calculator.title}</h2>
        <p>{KNOW_YOUR_NUMBERS.calculator.subtitle}</p>
        <aside className="kyn-privacy-note">
          <ShieldCheck size={20} aria-hidden="true" />
          <p>
            <strong>Private by design.</strong> Nothing you enter is saved or sent anywhere.
            Your answers clear when the print dialog closes, or when you leave or reload this page.
          </p>
        </aside>
      </div>

      <div className="kyn-steps">
        <section className="kyn-step" aria-labelledby="kyn-step-1">
          <div className="kyn-step-number" aria-hidden="true">01</div>
          <div className="kyn-step-content">
            <h3 id="kyn-step-1">Ask</h3>
            <p>{KNOW_YOUR_NUMBERS.calculator.steps[0].body}</p>
            <fieldset className="kyn-request-checks">
              <legend className="sr-only">Tests to request</legend>
              <label>
                <input
                  type="checkbox"
                  checked={state.askGlucose}
                  onChange={(event) => onChange({ askGlucose: event.target.checked })}
                />
                <span className="kyn-custom-check" aria-hidden="true" />
                Fasting glucose
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={state.askInsulin}
                  onChange={(event) => onChange({ askInsulin: event.target.checked })}
                />
                <span className="kyn-custom-check" aria-hidden="true" />
                Fasting insulin
              </label>
            </fieldset>
          </div>
        </section>

        <section className="kyn-step" aria-labelledby="kyn-step-2">
          <div className="kyn-step-number" aria-hidden="true">02</div>
          <div className="kyn-step-content">
            <h3 id="kyn-step-2">Record</h3>
            <p>{KNOW_YOUR_NUMBERS.calculator.steps[1].body}</p>
            <div className="kyn-record-grid">
              <label className="kyn-field" htmlFor="kyn-record-date">
                <span>Collection date</span>
                <input
                  id="kyn-record-date"
                  type="date"
                  value={state.collectionDate}
                  onChange={(event) => onChange({ collectionDate: event.target.value })}
                />
              </label>
              <NumberField
                id="kyn-fasting-hours"
                label="Fasting duration"
                unit="hours"
                value={state.fastingHours}
                max="48"
                placeholder="e.g. 12"
                onChange={(fastingHours) => onChange({ fastingHours })}
              />
              <NumberField
                id="kyn-record-glucose"
                label="Fasting glucose"
                unit={KNOW_YOUR_NUMBERS.calculator.units.glucose}
                value={state.glucose}
                placeholder="e.g. 95"
                onChange={(glucose) => onChange({ glucose })}
              />
              <NumberField
                id="kyn-record-insulin"
                label="Fasting insulin"
                unit={KNOW_YOUR_NUMBERS.calculator.units.insulin}
                value={state.insulin}
                placeholder="e.g. 4.2"
                onChange={(insulin) => onChange({ insulin })}
              />
            </div>
            {(glucoseInvalid || insulinInvalid) && (
              <p className="kyn-field-error" role="alert">
                Enter positive numbers for glucose and insulin.
              </p>
            )}
          </div>
        </section>

        <section className="kyn-step kyn-step--calculation" aria-labelledby="kyn-step-3">
          <div className="kyn-step-number" aria-hidden="true">03</div>
          <div className="kyn-step-content">
            <h3 id="kyn-step-3">Calculate</h3>
            <p>{KNOW_YOUR_NUMBERS.calculator.steps[2].body}</p>
            <div className="kyn-equation" aria-label="HOMA-IR calculation">
              <NumberField
                id="kyn-calc-glucose"
                label="Glucose"
                unit={KNOW_YOUR_NUMBERS.calculator.units.glucose}
                value={state.glucose}
                placeholder="Glucose"
                onChange={(glucose) => onChange({ glucose })}
              />
              <span className="kyn-operator" aria-hidden="true">×</span>
              <NumberField
                id="kyn-calc-insulin"
                label="Insulin"
                unit={KNOW_YOUR_NUMBERS.calculator.units.insulin}
                value={state.insulin}
                placeholder="Insulin"
                onChange={(insulin) => onChange({ insulin })}
              />
              <span className="kyn-division">
                <span aria-hidden="true">÷</span>
                <strong>405</strong>
              </span>
              <span className="kyn-operator" aria-hidden="true">=</span>
              <div className="kyn-result">
                <span>Your HOMA-IR</span>
                <output aria-live="polite">{result || '—'}</output>
              </div>
            </div>
            <button className="kyn-clear" type="button" onClick={clearLabValues}>
              <RotateCcw size={15} aria-hidden="true" />
              Clear lab values
            </button>
          </div>
        </section>

        <section className="kyn-step" aria-labelledby="kyn-step-4">
          <div className="kyn-step-number" aria-hidden="true">04</div>
          <div className="kyn-step-content">
            <h3 id="kyn-step-4">Understand Your Result</h3>
            <p>{KNOW_YOUR_NUMBERS.calculator.steps[3].body}</p>
            <div className="kyn-range-guide">
              <div>
                <strong>Below 1.5</strong>
                <span>Preferred reference</span>
              </div>
              <div>
                <strong>Below 2</strong>
                <span>General reference</span>
              </div>
              <p>Your clinician can interpret this result in the context of your health history.</p>
            </div>
          </div>
        </section>

        <section className="kyn-step" aria-labelledby="kyn-step-5">
          <div className="kyn-step-number" aria-hidden="true">05</div>
          <div className="kyn-step-content">
            <h3 id="kyn-step-5">Notes &amp; Questions</h3>
            <p>{KNOW_YOUR_NUMBERS.calculator.steps[4].body}</p>
            <label className="kyn-notes-label" htmlFor="kyn-notes">
              <span className="sr-only">Notes and questions for your clinician</span>
              <textarea
                id="kyn-notes"
                maxLength={220}
                rows={5}
                value={state.notes}
                placeholder="What would you like to ask?"
                onChange={(event) => onChange({ notes: event.target.value })}
              />
              <small>{state.notes.length}/220</small>
            </label>
          </div>
        </section>
      </div>

      <blockquote className="kyn-clinician-prompt">
        <span>Conversation starter</span>
        “{KNOW_YOUR_NUMBERS.clinicianPrompt}”
      </blockquote>
    </section>
  );
}
