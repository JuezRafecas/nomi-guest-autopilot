import Link from 'next/link';
import { EventBadge } from '@/components/landing/EventBadge';
import { BauhausArt } from '@/components/landing/BauhausArt';
import { SponsorStrip } from '@/components/landing/SponsorStrip';
import { KaszekMarquee } from '@/components/landing/KaszekMarquee';

export const dynamic = 'force-dynamic';

export default function LandingPage() {
  return (
    <main
      data-theme="kaszek"
      className="relative min-h-screen w-full overflow-hidden bg-[#faf8f4] text-[#151411] k-grain"
    >
      {/* ─────────── HERO ─────────── */}
      <section className="relative z-10 editorial-container pt-20 md:pt-24 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] gap-14 lg:gap-24 items-start">
          {/* LEFT — copy column */}
          <div className="relative">
            <div className="k-reveal k-reveal-1 mb-10">
              <EventBadge />
            </div>

            <h1 className="k-reveal k-reveal-2 k-display-xl mb-8">
              El{' '}
              <span
                className="inline-block"
                style={{
                  color: '#e6784c',
                  WebkitTextStroke: '2px #151411',
                }}
              >
                50%
              </span>{' '}
              de tus comensales <span className="italic">ya no vuelve.</span>
            </h1>

            <p className="k-reveal k-reveal-3 k-body max-w-[46ch] mb-12">
              Diagnosticamos tu base, detectamos la plata que se está
              yendo, y generamos los mensajes que la recuperan. Vos{' '}
              <em className="text-[#0e5e48] not-italic font-semibold">
                aprobás
              </em>
              , no configurás.
            </p>

            <div className="k-reveal k-reveal-4 flex flex-wrap items-center gap-5 mb-14">
              <Link href="/dashboard">
                <KaszekButton variant="primary">
                  Ver el diagnóstico
                  <Arrow />
                </KaszekButton>
              </Link>
              <Link href="/upload">
                <KaszekButton variant="ghost">Subir mis datos</KaszekButton>
              </Link>
            </div>

            {/* Micro-credits row */}
            <div className="k-reveal k-reveal-5 flex flex-wrap gap-x-10 gap-y-4 pt-10 border-t border-[#e4dfd2]">
              <Metric value="1.2k" label="Visitas analizadas" />
              <Metric value="$48k" label="Revenue en riesgo" />
              <Metric value="6" label="Segmentos vivos" />
              <Metric value="24h" label="De datos a acción" />
            </div>
          </div>

          {/* RIGHT — art column */}
          <div className="relative pt-8 lg:pt-2">
            <BauhausArt />
          </div>
        </div>
      </section>

      {/* ─────────── MARQUEE ─────────── */}
      <KaszekMarquee />

      {/* ─────────── SPONSOR STRIP ─────────── */}
      <SponsorStrip />

      {/* ─────────── FOOTER ─────────── */}
      <footer className="relative z-10">
        <div className="editorial-container py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <KaszekLogo small />
            <div className="k-mono text-[10px] uppercase tracking-[0.16em] text-[#8a8782]">
              Approve · don&rsquo;t configure
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="k-mono text-[10px] uppercase tracking-[0.16em] text-[#8a8782]">
              © 2026 · Hackathon Entry
            </div>
            <div className="k-mono text-[10px] uppercase tracking-[0.16em] text-[#605e5a]">
              v0.1 · Fabric Sushi
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ────────────────────────────────────────────────────────
   Local components — kept in-file so the dashboard's
   shared Button / Logo stay completely untouched.
   ──────────────────────────────────────────────────────── */

function KaszekLogo({ small = false }: { small?: boolean }) {
  const size = small ? 18 : 22;
  return (
    <div className="flex items-baseline gap-[3px]" aria-label="Revenue Autopilot">
      <span
        className="k-display italic"
        style={{
          fontSize: size,
          lineHeight: 1,
          color: '#151411',
          letterSpacing: '-0.03em',
        }}
      >
        Revenue
      </span>
      <span
        className="k-display"
        style={{
          fontSize: size,
          lineHeight: 1,
          color: '#e6784c',
          letterSpacing: '-0.04em',
        }}
      >
        Autopilot
      </span>
      <span
        aria-hidden
        className="inline-block ml-1"
        style={{
          width: 6,
          height: 6,
          background: '#0e5e48',
          transform: 'translateY(-2px)',
        }}
      />
    </div>
  );
}

function KaszekButton({
  variant,
  children,
}: {
  variant: 'primary' | 'ghost';
  children: React.ReactNode;
}) {
  const base =
    'k-btn inline-flex items-center gap-3 h-12 px-7 text-[12px] uppercase tracking-[0.16em] font-semibold border-2 border-[#151411] select-none';

  if (variant === 'primary') {
    return (
      <button className={`${base} k-btn--primary text-[#faf8f4] bg-[#e6784c]`}>
        {children}
      </button>
    );
  }
  return (
    <button className={`${base} k-btn--ghost text-[#151411] bg-transparent`}>
      {children}
    </button>
  );
}

function Arrow() {
  return (
    <svg
      width="18"
      height="12"
      viewBox="0 0 18 12"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      <path
        d="M0 6H16M10 1L16 6L10 11"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="square"
      />
    </svg>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className="k-display text-[#151411]"
        style={{
          fontSize: 32,
          lineHeight: 1,
          letterSpacing: '-0.04em',
        }}
      >
        {value}
      </div>
      <div className="k-mono text-[10px] uppercase tracking-[0.14em] text-[#8a8782]">
        {label}
      </div>
    </div>
  );
}
