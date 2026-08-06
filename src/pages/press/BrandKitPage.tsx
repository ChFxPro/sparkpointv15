import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Download } from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';

type BgMode = 'transparent' | 'dark' | 'light';

const GRADIENT = 'linear-gradient(90deg, #FDB515, #F15F48, #E03694, #9E509F)';

const CHECKER_STYLE: CSSProperties = {
  backgroundImage:
    'linear-gradient(45deg,#e9e7e3 25%,transparent 25%),linear-gradient(-45deg,#e9e7e3 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e9e7e3 75%),linear-gradient(-45deg,transparent 75%,#e9e7e3 75%)',
  backgroundSize: '16px 16px',
  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
  backgroundColor: '#fff',
};

function previewStyle(mode: BgMode): CSSProperties {
  if (mode === 'dark') return { backgroundColor: '#0D0D0D' };
  if (mode === 'light') return { backgroundColor: '#FCFCFD' };
  return CHECKER_STYLE;
}

const LOGO_COLORS: { key: string; label: string }[] = [
  { key: 'FullColor', label: 'Full Color' },
  { key: 'White', label: 'White' },
  { key: 'Black', label: 'Black' },
  { key: 'Purple', label: 'Purple' },
  { key: 'Pink', label: 'Pink' },
  { key: 'Orange', label: 'Orange' },
  { key: 'Gold', label: 'Gold' },
];

const MARK_COLORS: { key: string; label: string }[] = [
  { key: 'FullColor', label: 'Full Color' },
  { key: 'White', label: 'White' },
  { key: 'Black', label: 'Black' },
];

const COLORS = [
  { name: 'Gold', hex: '#FDB515', rgb: '253, 181, 21', cmyk: '0, 32, 100, 0' },
  { name: 'Orange', hex: '#F15F48', rgb: '241, 95, 72', cmyk: '0, 78, 75, 0' },
  { name: 'Pink', hex: '#E03694', rgb: '224, 54, 148', cmyk: '6, 92, 0, 0' },
  { name: 'Purple', hex: '#9E509F', rgb: '157, 80, 159', cmyk: '42, 82, 0, 0' },
];

export function BrandKitPage() {
  const [bgMode, setBgMode] = useState<BgMode>('transparent');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const base = import.meta.env.BASE_URL;
  const asset = (path: string) => `${base}brand-kit/assets/${path}`;
  const zipHref = `${base}brand-kit/SparkPoint-Brand-Kit.zip`;

  function handleCopy(hex: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hex).catch(() => undefined);
    }
    setCopiedHex(hex);
    window.setTimeout(() => setCopiedHex(null), 1100);
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <SEOHead
        title="Brand Kit | SparkPoint"
        description="Every SparkPoint logo color, the brandmark, full color palette, and fonts — ready to download for press, partners, and funders."
        path="/brand-kit"
      />

      {/* Toolbar */}
      <div className="sticky top-20 z-30 border-b border-gray-100 bg-white/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="inline-flex overflow-hidden rounded-full border border-gray-200 bg-white">
            {(['transparent', 'dark', 'light'] as BgMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setBgMode(mode)}
                className={`px-4 py-2 text-xs font-bold capitalize transition-colors ${
                  bgMode === mode ? 'bg-[#1A1A1A] text-white' : 'text-gray-500 hover:text-[#1A1A1A]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <a
            href={zipHref}
            download
            className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
            style={{ backgroundImage: GRADIENT }}
          >
            <Download className="h-4 w-4" aria-hidden="true" /> Download Everything — PNG + EPS
          </a>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-20 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-140px] h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-10 blur-3xl"
          style={{ backgroundImage: 'conic-gradient(from 180deg, #FDB515, #F15F48, #E03694, #9E509F, #FDB515)' }}
        />
        <img
          src={asset('mark/SparkPoint-Mark-Black.png')}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-10 w-96 rotate-6 opacity-[0.05]"
        />
        <div className="relative mx-auto max-w-2xl">
          <img src={asset('logo/SparkPoint-Logo-FullColor.png')} alt="SparkPoint" className="mx-auto mb-8 w-full max-w-sm" />
          <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] md:text-5xl">
            Everything you need to feature SparkPoint
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-7 text-gray-600">
            Logos, colors, and fonts — ready to drop into a press piece, program guide, event slide, or partner page.
            Grab what you need below, no permission required.
          </p>
        </div>
      </section>

      {/* Logo */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <span aria-hidden="true" className="mb-4 block h-1 w-10 rounded-full" style={{ backgroundImage: GRADIENT }} />
        <h2 className="text-2xl font-bold uppercase tracking-tight text-[#1A1A1A]">Logo</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          Seven color options, high-res PNGs ready for web, slides, and docs. Preview each on transparent, dark, or light
          using the toggle above.
        </p>
        <a
          href={zipHref}
          download
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-[#1A1A1A] hover:border-[#1A1A1A]"
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundImage: GRADIENT }} />
          Need vector EPS files for print? They're in the full download above.
        </a>

        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {LOGO_COLORS.map(({ key, label }) => (
            <div
              key={key}
              className="group overflow-hidden rounded-2xl border border-gray-100 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex aspect-[4/3] items-center justify-center p-6" style={previewStyle(bgMode)}>
                <img src={asset(`logo/SparkPoint-Logo-${key}.png`)} alt={`SparkPoint logo, ${label.toLowerCase()}`} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="border-t border-gray-100 p-4">
                <div className="mb-3 text-sm font-bold text-[#1A1A1A]">{label}</div>
                <a
                  href={asset(`logo/SparkPoint-Logo-${key}.png`)}
                  download
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white"
                >
                  Download PNG ↓
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brandmark */}
      <section className="bg-[#FAF9F7] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <span aria-hidden="true" className="mb-4 block h-1 w-10 rounded-full" style={{ backgroundImage: GRADIENT }} />
          <h2 className="text-2xl font-bold uppercase tracking-tight text-[#1A1A1A]">Brandmark</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            The spark icon on its own — handy as a favicon, social avatar, watermark, or accent graphic.
          </p>
          <a
            href={zipHref}
            download
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-[#1A1A1A] hover:border-[#1A1A1A]"
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundImage: GRADIENT }} />
            Vector EPS versions are in the full download above.
          </a>

          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
            {MARK_COLORS.map(({ key, label }) => (
              <div
                key={key}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex aspect-[4/3] items-center justify-center p-6" style={previewStyle(bgMode)}>
                  <img
                    src={asset(`mark/SparkPoint-Mark-${key}.png`)}
                    alt={`SparkPoint brandmark, ${label.toLowerCase()}`}
                    className="max-h-[65%] max-w-[65%] object-contain"
                  />
                </div>
                <div className="border-t border-gray-100 p-4">
                  <div className="mb-3 text-sm font-bold text-[#1A1A1A]">{label}</div>
                  <a
                    href={asset(`mark/SparkPoint-Mark-${key}.png`)}
                    download
                    className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white"
                  >
                    Download PNG ↓
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Colors */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <span aria-hidden="true" className="mb-4 block h-1 w-10 rounded-full" style={{ backgroundImage: GRADIENT }} />
        <h2 className="text-2xl font-bold uppercase tracking-tight text-[#1A1A1A]">Colors</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          Click a swatch to copy its hex code. The full gradient runs Gold → Orange → Pink → Purple.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {COLORS.map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => handleCopy(c.hex)}
              className="overflow-hidden rounded-2xl border border-gray-100 text-left transition-shadow hover:shadow-lg"
            >
              <div className="h-28" style={{ backgroundColor: c.hex }} />
              <div className="p-4">
                <div className="mb-1 text-sm font-bold text-[#1A1A1A]">{copiedHex === c.hex ? `Copied ${c.hex}` : c.name}</div>
                <div className="font-mono text-xs text-gray-500">
                  {c.hex} · RGB {c.rgb}
                </div>
                <div className="font-mono text-xs text-gray-500">CMYK {c.cmyk}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-6 h-16 rounded-2xl border border-gray-100" style={{ backgroundImage: GRADIENT }} />
        <p className="mt-4 text-xs text-gray-500">
          For body text, a dark 90% black reads better than pure black — pairs well with any brand color as an accent.
        </p>
      </section>

      {/* Fonts */}
      <section className="bg-[#FAF9F7] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <span aria-hidden="true" className="mb-4 block h-1 w-10 rounded-full" style={{ backgroundImage: GRADIENT }} />
          <h2 className="text-2xl font-bold uppercase tracking-tight text-[#1A1A1A]">Fonts</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            The logo and headlines use Helvetica Neue LT W1G. If you don't have that family, regular Helvetica or Arial
            works as a stand-in.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-400">Headings</div>
              <div className="text-2xl font-bold tracking-tight text-[#1A1A1A]">HELVETICA NEUE 95 BLACK</div>
              <p className="mt-2 text-xs text-gray-500">All caps, tight letterspacing. Works in any brand color.</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-400">Subheadings</div>
              <div className="text-xl font-bold tracking-[0.15em] text-[#1A1A1A]">HELVETICA 75 BOLD</div>
              <p className="mt-2 text-xs text-gray-500">All caps, open letterspacing.</p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6">
            <div className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-400">Body copy</div>
            <div className="text-base text-[#1A1A1A]">Helvetica Neue 55 Roman — used for paragraph text like this.</div>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <span aria-hidden="true" className="mb-4 block h-1 w-10 rounded-full" style={{ backgroundImage: GRADIENT }} />
        <h2 className="text-2xl font-bold uppercase tracking-tight text-[#1A1A1A]">A few quick tips</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          Nothing formal here — just what helps SparkPoint look consistent wherever it shows up.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: 'PNG for screens, EPS for print',
              body: 'PNGs are great for web, slides, and social. EPS files scale cleanly for banners, signage, and anything printed large — grab them in the full download.',
            },
            {
              title: 'Pick the right color',
              body: 'Use the full-color version when you can. White or black works well over photos or contrasting backgrounds; single colors are handy for one-color print jobs.',
            },
            {
              title: 'Give it some breathing room',
              body: 'A little clear space around the logo (roughly a fifth of its width) keeps it easy to read next to other logos or text.',
            },
            {
              title: 'Questions?',
              body: "Need a different format, size, or color? Just reach out — happy to send whatever's useful.",
            },
          ].map((tip) => (
            <div key={tip.title}>
              <h4 className="mb-2 text-sm font-bold text-[#1A1A1A]">{tip.title}</h4>
              <p className="text-sm leading-6 text-gray-600">{tip.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
