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

      {/* Editorial headline — compact, one anchor (the outlined digit) */}
      <section className="editorial-container pt-14 pb-10">
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
      <section className="editorial-container grid grid-cols-1 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] gap-12 lg:gap-16 pb-24">
        <HealthScore
          score={MOCK_HEALTH_SCORE}
          activeCount={activeCount}
          totalCount={MOCK_RESTAURANT.total_guests}
          diagnosis="uno de cada dos comensales se está yendo por la puerta."
        />
        <SegmentLedger summaries={MOCK_SEGMENT_SUMMARIES} />
      </section>

      {/* Active campaigns strip */}
      <section className="pb-20">
        <div className="editorial-container flex items-end justify-between mb-5">
          <div>
            <div
              className="text-[10.5px] uppercase font-[600] mb-2"
              style={{
                letterSpacing: '0.18em',
                color: 'var(--k-green, #0e5e48)',
                fontFamily: 'var(--font-kaszek-sans), Inter, system-ui, sans-serif',
              }}
            >
              Campañas activas
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-kaszek-display), "Archivo Black", system-ui, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(1.5rem, 2vw, 1.85rem)',
                letterSpacing: '-0.035em',
                color: 'var(--fg)',
                lineHeight: 1.05,
              }}
            >
              Lo que está corriendo ahora mismo.
            </h2>
          </div>
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-2 text-[10.5px] uppercase font-[600] px-4 py-2 transition-colors hover:bg-[var(--k-green)] hover:text-[var(--bg)] hover:border-[var(--k-green)]"
            style={{
              letterSpacing: '0.16em',
              border: '1px solid var(--fg)',
              color: 'var(--fg)',
              fontFamily: 'var(--font-kaszek-sans), Inter, system-ui, sans-serif',
            }}
          >
            Ver todas
            <span>→</span>
          </Link>
        </div>
        <div
          className="editorial-container"
          style={{ borderTop: '1.5px solid var(--hairline-strong)' }}
        >
          {activeCampaigns.map((c, i) => (
            <CampaignRow key={c.id} campaign={c} index={i} />
          ))}
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
