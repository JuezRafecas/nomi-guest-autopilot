import { Label } from '@/components/ui/Label';
import { Numeral } from '@/components/ui/Numeral';
import { describeAudience } from '@/lib/audience';
import type { AudienceFilter } from '@/lib/types';

export function AudienceSummary({
  filter,
  matchedCount,
  tierBreakdown,
}: {
  filter: AudienceFilter;
  matchedCount: number;
  tierBreakdown?: Array<{ label: string; count: number }>;
}) {
  return (
    <div className="border border-hairline p-8 bg-bg-raised">
      <Label className="mb-3">Audiencia</Label>
      <div className="flex items-baseline gap-4 mb-2">
        <Numeral value={matchedCount} size="xl" className="text-fg" />
        <span className="text-[11px] uppercase tracking-label text-fg-subtle">contactos</span>
      </div>
      <p
        className="font-display italic text-sm text-fg-muted max-w-[50ch] leading-snug"
        style={{ fontVariationSettings: '"opsz" 14' }}
      >
        {describeAudience(filter)}
      </p>

      {tierBreakdown && tierBreakdown.length > 0 && (
        <div className="mt-6 pt-6 border-t border-hairline space-y-2">
          {tierBreakdown.map((t) => (
            <div key={t.label} className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-label text-fg-subtle">{t.label}</span>
              <span className="font-mono text-sm text-fg tabular-nums">
                <Numeral value={t.count} />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
