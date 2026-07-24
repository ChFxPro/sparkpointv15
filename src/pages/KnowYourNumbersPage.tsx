import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import { ArrowLeft, Download, FileDown, Printer } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { OnlineGuide } from '../components/know-your-numbers/OnlineGuide';
import { OnlineCalculator } from '../components/know-your-numbers/OnlineCalculator';
import {
  PrintGuidePage,
  PrintWorksheetPage,
} from '../components/know-your-numbers/PrintPages';
import {
  EMPTY_WORKSHEET_STATE,
  KNOW_YOUR_NUMBERS,
  type WorksheetState,
} from '../data/knowYourNumbers';
import './knowYourNumbers.css';

const BASE = import.meta.env.BASE_URL;
const blankPdfHref = `${BASE}downloads/brain-health/know-your-numbers.pdf`;

export function KnowYourNumbersPage() {
  const [worksheet, setWorksheet] = useState<WorksheetState>({ ...EMPTY_WORKSHEET_STATE });
  const [printStatus, setPrintStatus] = useState('');

  const updateWorksheet = (patch: Partial<WorksheetState>) => {
    setWorksheet((current) => ({ ...current, ...patch }));
  };

  useEffect(() => {
    const preparePrint = () => document.body.classList.add('kyn-printing');
    const finishPrint = () => {
      document.body.classList.remove('kyn-printing');
      setWorksheet({ ...EMPTY_WORKSHEET_STATE });
      setPrintStatus('Print dialog closed. For your privacy, all worksheet answers have been cleared.');
    };

    window.addEventListener('beforeprint', preparePrint);
    window.addEventListener('afterprint', finishPrint);
    return () => {
      window.removeEventListener('beforeprint', preparePrint);
      window.removeEventListener('afterprint', finishPrint);
      document.body.classList.remove('kyn-printing');
    };
  }, []);

  const openPrintDialog = (mode: 'print' | 'pdf') => {
    setPrintStatus(
      mode === 'pdf'
        ? 'Opening your completed worksheet. Choose “Save as PDF” in the print dialog.'
        : 'Opening your completed worksheet for printing.',
    );
    document.body.classList.add('kyn-printing');
    requestAnimationFrame(() => window.print());
  };

  return (
    <>
      <SEOHead
        title="Know Your Numbers — Metabolic Health Guide | SparkPoint"
        description="Explore seven metabolic health measures, calculate HOMA-IR, and create a completed two-page worksheet to discuss with your healthcare provider."
        path="/resources/know-your-numbers"
        type="website"
        keywords={[
          'metabolic health',
          'HOMA-IR calculator',
          'fasting glucose',
          'fasting insulin',
          'health worksheet',
          'Dr. Ora Wells',
          'SparkPoint',
        ]}
      />

      <div className="kyn-page">
        <div className="kyn-page-shell">
          <nav className="kyn-breadcrumb" aria-label="Breadcrumb">
            <Link to="/stories/talks-lectures/dr-ora-brain-health">
              <ArrowLeft size={16} aria-hidden="true" />
              Protecting Cognitive Health
            </Link>
            <span aria-hidden="true">/</span>
            <span>Know Your Numbers</span>
          </nav>

          <OnlineGuide />
          <OnlineCalculator state={worksheet} onChange={updateWorksheet} />

          <section className="kyn-output" aria-labelledby="kyn-output-title">
            <span className="kyn-output-icon" aria-hidden="true">
              <FileDown size={28} />
            </span>
            <div>
              <h2 id="kyn-output-title">Take your completed guide with you</h2>
              <p>
                Your answers exist only on this page. They are added to a landscape print sheet
                when you print or save a PDF, then cleared when the print dialog closes.
              </p>
              <div className="kyn-output-actions">
                <button type="button" onClick={() => openPrintDialog('print')}>
                  <Printer size={17} aria-hidden="true" />
                  Print completed guide
                </button>
                <button type="button" className="kyn-output-secondary" onClick={() => openPrintDialog('pdf')}>
                  <Download size={17} aria-hidden="true" />
                  Save completed PDF
                </button>
                <a href={blankPdfHref} download>
                  Download blank handout
                </a>
              </div>
              <p className="kyn-print-status" role="status" aria-live="polite">
                {printStatus}
              </p>
            </div>
          </section>

          <p className="kyn-disclaimer">{KNOW_YOUR_NUMBERS.disclaimer}</p>
        </div>
      </div>

      {createPortal(
        <div className="kyn-print-root" aria-hidden="true">
          <PrintGuidePage />
          <PrintWorksheetPage state={worksheet} />
        </div>,
        document.body,
      )}
    </>
  );
}
