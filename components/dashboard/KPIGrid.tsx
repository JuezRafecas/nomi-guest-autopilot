import { Numeral } from '@/components/ui/Numeral';

interface KPI {
  label: string;
  value: number;
  format?: 'plain' | 'ars' | 'percent' | 'compact';
  delta?: number;
  animated?: boolean;
}

export function KPIGrid({ kpis }: { kpis: KPI[] }) {
  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-4"
      style={{
        borderTop: '1.5px solid var(--hairline-strong)',
        borderBottom: '1.5px solid var(--hairline-strong)',
      }}
    >
      {kpis.map((k, i) => {
        const isAnchor = k.format === 'ars';
        return (
          <div
            key={k.label}
            className="px-8 py-8 relative"
            style={{
              borderRight: i % 4 !== 3 ? '1px solid var(--hairline)' : 'none',
              borderBottom: i < 2 ? '1px solid var(--hairline)' : 'none',
            }}
          >
            <div
              className="mb-3 text-[10.5px] uppercase font-[600]"
              style={{
                letterSpacing: '0.18em',
                color: isAnchor ? 'var(--accent-dim)' : 'var(--k-green, #0e5e48)',
                fontFamily: 'var(--font-kaszek-sans), Inter, system-ui, sans-serif',
              }}
            >
              {k.label}
            </div>
            <div className="flex items-baseline gap-3">
              <KPIValue kpi={k} isAnchor={isAnchor} />
              {k.delta != null && k.delta !== 0 && <DeltaChip delta={k.delta} />}
            </div>
          </div>
        );
      })}

      <style>{`
        @media (min-width: 1024px) {
          .lg\\:grid-cols-4 > div {
            border-bottom: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function KPIValue({ kpi, isAnchor }: { kpi: KPI; isAnchor: boolean }) {
  const displayFont = 'var(--font-kaszek-display), "Archivo Black", system-ui, sans-serif';
  const color = isAnchor ? 'var(--accent)' : 'var(--fg)';

  if (kpi.format === 'percent') {
    return (
      <span
        className="tabular-nums"
        style={{
          fontFamily: displayFont,
          fontWeight: 800,
          fontSize: 'clamp(1.8rem, 2.6vw, 2.4rem)',
          letterSpacing: '-0.035em',
          color,
          lineHeight: 1,
        }}
      >
        <Numeral value={kpi.value} decimals={1} animated={kpi.animated} />
        <span
          className="align-top ml-0.5"
          style={{ fontSize: '0.42em', color: 'var(--fg-subtle)' }}
        >
          %
        </span>
      </span>
    );
  }
  if (kpi.format === 'ars') {
    return (
      <span
        className="tabular-nums"
        style={{
          fontFamily: displayFont,
          fontWeight: 800,
          fontSize: 'clamp(1.8rem, 2.8vw, 2.6rem)',
          letterSpacing: '-0.04em',
          color,
          lineHeight: 1,
        }}
      >
        <Numeral value={kpi.value} format="ars" animated={kpi.animated} />
      </span>
    );
  }
  return (
    <span
      className="tabular-nums"
      style={{
        fontFamily: displayFont,
        fontWeight: 800,
        fontSize: 'clamp(1.8rem, 2.6vw, 2.4rem)',
        letterSpacing: '-0.035em',
        color,
        lineHeight: 1,
      }}
    >
      <Numeral value={kpi.value} animated={kpi.animated} />
    </span>
  );
}

function DeltaChip({ delta }: { delta: number }) {
  const positive = delta > 0;
  return (
    <span
      className="font-mono text-[10px] tabular-nums px-1.5 py-0.5"
      style={{
        letterSpacing: '0.04em',
        border: '1px solid var(--hairline-strong)',
        background: 'var(--bg-raised)',
        color: positive ? 'var(--k-green, #0e5e48)' : 'var(--accent-dim)',
      }}
    >
      {positive ? '↗' : '↘'} {Math.abs(delta).toFixed(1)}%
    </span>
  );
}
