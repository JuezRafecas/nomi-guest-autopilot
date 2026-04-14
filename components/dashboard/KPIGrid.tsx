import { Label } from '@/components/ui/Label';
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
    <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-b border-hairline">
      {kpis.map((k, i) => (
        <div
          key={k.label}
          className="px-10 py-8 border-r border-hairline last:border-r-0 [&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r [&:nth-child(3)]:lg:border-r"
          style={{ animationDelay: `${60 * i}ms` }}
        >
          <Label className="mb-3">{k.label}</Label>
          <div className="flex items-baseline gap-2">
            <KPIValue kpi={k} />
            {k.delta != null && k.delta !== 0 && (
              <span
                className={`font-mono text-[11px] tabular-nums ${
                  k.delta > 0 ? 'text-segment-active' : 'text-segment-dormant'
                }`}
              >
                {k.delta > 0 ? '↗' : '↘'} {Math.abs(k.delta).toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function KPIValue({ kpi }: { kpi: KPI }) {
  if (kpi.format === 'percent') {
    return (
      <span className="font-mono text-3xl md:text-4xl text-fg tabular-nums">
        <Numeral value={kpi.value} decimals={1} animated={kpi.animated} />
        <span className="text-sm text-fg-subtle ml-1">%</span>
      </span>
    );
  }
  if (kpi.format === 'ars') {
    return (
      <span className="font-mono text-3xl md:text-4xl text-accent tabular-nums">
        <Numeral value={kpi.value} format="ars" animated={kpi.animated} />
      </span>
    );
  }
  return (
    <span className="font-mono text-3xl md:text-4xl text-fg tabular-nums">
      <Numeral value={kpi.value} animated={kpi.animated} />
    </span>
  );
}
