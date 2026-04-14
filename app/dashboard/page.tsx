import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { EditorialHeadline } from '@/components/dashboard/EditorialHeadline';
import { HealthScore } from '@/components/dashboard/HealthScore';
import { SegmentLedger } from '@/components/dashboard/SegmentLedger';
import { RevenueOpportunity } from '@/components/dashboard/RevenueOpportunity';
import { ActivityTicker } from '@/components/dashboard/ActivityTicker';
import { KPIGrid } from '@/components/dashboard/KPIGrid';
import { CampaignRow } from '@/components/campaigns/CampaignRow';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import {
  MOCK_SEGMENT_SUMMARIES,
  MOCK_HEALTH_SCORE,
  MOCK_TOTAL_REVENUE_AT_STAKE,
  MOCK_EDITORIAL_HEADLINE,
  MOCK_ACTIVITY_TICKER,
  MOCK_RESTAURANT,
  MOCK_DASHBOARD_KPIS,
  MOCK_CAMPAIGNS,
} from '@/lib/mock';

export default function DashboardPage() {
  const activeCount =
    MOCK_SEGMENT_SUMMARIES.find((s) => s.segment === 'vip')!.count +
    MOCK_SEGMENT_SUMMARIES.find((s) => s.segment === 'active')!.count;
  const dormantCount = MOCK_SEGMENT_SUMMARIES.find((s) => s.segment === 'dormant')!.count;

  const activeCampaigns = MOCK_CAMPAIGNS.filter((c) => c.status === 'active').slice(0, 3);

  return (
    <AppShell>
      <Header />

      {/* Editorial headline — unforgettable first impression */}
      <section className="editorial-container pt-16 pb-12">
        <EditorialHeadline
          prefix={MOCK_EDITORIAL_HEADLINE.prefix}
          highlight={MOCK_EDITORIAL_HEADLINE.highlight}
          suffix={MOCK_EDITORIAL_HEADLINE.suffix}
        />
      </section>

      {/* KPI row */}
      <section className="pb-16">
        <div className="editorial-container">
          <KPIGrid
            kpis={[
              { label: 'Campañas activas', value: MOCK_DASHBOARD_KPIS.active_campaigns },
              { label: 'Enviados · 30d', value: MOCK_DASHBOARD_KPIS.messages_sent_30d, animated: true },
              { label: 'Tasa de respuesta', value: MOCK_DASHBOARD_KPIS.response_rate_30d, format: 'percent', delta: 8.7 },
              {
                label: 'Revenue atribuido · 30d',
                value: MOCK_DASHBOARD_KPIS.revenue_attributed_30d,
                format: 'ars',
                animated: true,
                delta: 12.3,
              },
            ]}
          />
        </div>
      </section>

      {/* Diagnostic: health score + segment ledger */}
      <section className="editorial-container grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] gap-16 pb-24">
        <HealthScore
          score={MOCK_HEALTH_SCORE}
          activeCount={activeCount}
          totalCount={MOCK_RESTAURANT.total_guests}
          diagnosis="uno de cada dos comensales se está yendo por la puerta."
        />
        <SegmentLedger summaries={MOCK_SEGMENT_SUMMARIES} />
      </section>

      {/* Active campaigns strip */}
      <section className="pb-12">
        <div className="editorial-container flex items-end justify-between mb-6">
          <div>
            <Label className="mb-2">Campañas activas</Label>
            <h2
              className="font-display text-3xl text-fg"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}
            >
              Lo que está corriendo ahora mismo.
            </h2>
          </div>
          <Link href="/campaigns">
            <Button variant="ghost">Ver todas</Button>
          </Link>
        </div>
        <div className="editorial-container">
          <div className="border-t border-hairline">
            {activeCampaigns.map((c, i) => (
              <CampaignRow key={c.id} campaign={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      <RevenueOpportunity
        totalAtStake={MOCK_TOTAL_REVENUE_AT_STAKE}
        dormantCount={dormantCount}
        avgTicket={MOCK_RESTAURANT.avg_ticket}
      />

      <ActivityTicker items={MOCK_ACTIVITY_TICKER} />
    </AppShell>
  );
}
