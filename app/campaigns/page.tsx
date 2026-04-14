import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { CampaignRow } from '@/components/campaigns/CampaignRow';
import { MOCK_CAMPAIGNS } from '@/lib/mock';
import { CAMPAIGN_STATUS_ORDER } from '@/lib/campaigns';

export default function CampaignsPage() {
  const ordered = [...MOCK_CAMPAIGNS].sort(
    (a, b) => CAMPAIGN_STATUS_ORDER.indexOf(a.status) - CAMPAIGN_STATUS_ORDER.indexOf(b.status)
  );

  const activeCount = ordered.filter((c) => c.status === 'active').length;
  const scheduledCount = ordered.filter((c) => c.status === 'scheduled').length;

  return (
    <AppShell>
      <Header />

      <section className="editorial-container pt-16 pb-10">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <Label className="mb-3">Campañas</Label>
            <h1
              className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] text-fg max-w-[22ch]"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}
            >
              <span className="italic">{activeCount} campañas activas</span>
              {scheduledCount > 0 && (
                <span className="text-fg-muted">, {scheduledCount} programada.</span>
              )}
            </h1>
          </div>
          <div className="shrink-0 pt-4">
            <Link href="/templates">
              <Button variant="primary">Nueva campaña</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="editorial-container pb-24">
        <div className="border-t border-hairline">
          <header className="grid grid-cols-[minmax(0,1.8fr)_100px_90px_100px_140px_auto] items-end gap-6 pl-8 pr-6 pt-4 pb-3">
            <Label>Campaña</Label>
            <Label className="text-right">Enviados</Label>
            <Label className="text-right">Respuesta</Label>
            <Label className="text-right">Conversión</Label>
            <Label className="text-right">Revenue</Label>
            <Label className="text-right">Acción</Label>
          </header>
          <div className="border-t border-hairline">
            {ordered.map((c, i) => (
              <CampaignRow key={c.id} campaign={c} index={i} />
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
