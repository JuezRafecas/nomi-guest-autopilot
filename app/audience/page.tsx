import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Label } from '@/components/ui/Label';
import { SegmentLedger } from '@/components/dashboard/SegmentLedger';
import { GuestList } from '@/components/guests/GuestList';
import { MOCK_SEGMENT_SUMMARIES, MOCK_GUESTS, MOCK_RESTAURANT } from '@/lib/mock';
import { Numeral } from '@/components/ui/Numeral';

export default function AudiencePage() {
  return (
    <AppShell>
      <Header />

      <section className="editorial-container pt-16 pb-12">
        <Label className="mb-3">Audiencia · Base de comensales</Label>
        <div className="flex items-end justify-between gap-10">
          <h1
            className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] text-fg max-w-[24ch]"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}
          >
            <span className="italic">{MOCK_RESTAURANT.total_guests}</span> comensales en la base.
          </h1>
          <div className="text-right shrink-0 pb-4">
            <div className="font-mono text-4xl text-fg tabular-nums">
              <Numeral value={MOCK_RESTAURANT.total_guests} />
            </div>
            <div className="text-[10px] uppercase tracking-label text-fg-subtle mt-1">total</div>
          </div>
        </div>
      </section>

      {/* Segments ledger reused from dashboard */}
      <section className="editorial-container pb-16">
        <SegmentLedger summaries={MOCK_SEGMENT_SUMMARIES} />
      </section>

      {/* Guest table */}
      <section className="editorial-container pb-24">
        <Label className="mb-4">Comensales destacados</Label>
        <GuestList rows={MOCK_GUESTS} />
      </section>
    </AppShell>
  );
}
