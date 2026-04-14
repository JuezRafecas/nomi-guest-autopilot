import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { EditorialHeadline } from '@/components/dashboard/EditorialHeadline';
import { HealthScore } from '@/components/dashboard/HealthScore';
import { SegmentLedger } from '@/components/dashboard/SegmentLedger';
import { RevenueOpportunity } from '@/components/dashboard/RevenueOpportunity';
import { ActivityTicker } from '@/components/dashboard/ActivityTicker';
import { KPIGrid } from '@/components/dashboard/KPIGrid';
import { CampaignRow } from '@/components/campaigns/CampaignRow';
import { getKpis, getSegments, getCampaigns, getMessages, type MessageRow } from '@/lib/api';
import { DEFAULT_RESTAURANT } from '@/lib/constants';

const MILLION_WORDS = ['cero', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];

function buildEditorialHeadline(revenueAtStake: number) {
  const millions = Math.floor(revenueAtStake / 1_000_000);
  const highlight =
    millions > 0 && millions <= 10
      ? `${MILLION_WORDS[millions]} millones`
      : `${millions.toLocaleString('es-AR')} millones`;
  return {
    prefix: 'Más de',
    highlight,
    suffix: 'de pesos se están yendo por la puerta.',
  };
}

function buildActivityTicker(messages: MessageRow[]): string[] {
  const now = Date.now();
  return messages.slice(0, 7).map((m) => {
    const mins = Math.max(1, Math.round((now - new Date(m.created_at).getTime()) / 60_000));
    const evento =
      m.status === 'converted'
        ? `CONVERSIÓN CONFIRMADA +$${Math.round((m.realized_revenue ?? 0) / 1000)}K`
        : m.status === 'pending_approval'
          ? 'MENSAJE PENDIENTE DE APROBACIÓN'
          : m.status === 'sent' || m.status === 'delivered'
            ? 'MENSAJE ENVIADO'
            : m.status === 'read'
              ? 'MENSAJE LEÍDO'
              : m.status === 'responded'
                ? 'RESPUESTA RECIBIDA'
                : 'MENSAJE GENERADO';
    return `${m.guest_name.toUpperCase()} · ${evento} · HACE ${mins} MIN`;
  });
}

export default async function DashboardPage() {
  const [kpis, summaries, campaigns, messages] = await Promise.all([
    getKpis(),
    getSegments(),
    getCampaigns(),
    getMessages(),
  ]);

  const vipCount = summaries.find((s) => s.segment === 'vip')?.count ?? 0;
  const activeCount = vipCount + (summaries.find((s) => s.segment === 'active')?.count ?? 0);
  const dormantCount = summaries.find((s) => s.segment === 'dormant')?.count ?? 0;

  const activeCampaigns = campaigns.filter((c) => c.status === 'active').slice(0, 3);

  const headline = buildEditorialHeadline(kpis.revenue_at_stake);
  const ticker = buildActivityTicker(messages);

  return (
    <AppShell>
      <Header />

      {/* Editorial headline — compact, one anchor (the outlined digit) */}
      <section className="editorial-container section-pt-lead section-pb-close">
        <EditorialHeadline
          prefix={headline.prefix}
          highlight={headline.highlight}
          suffix={headline.suffix}
        />
      </section>

      {/* KPI row */}
      <section className="pb-16">
        <div className="editorial-container">
          <KPIGrid
            kpis={[
              { label: 'Campañas activas', value: kpis.active_campaigns },
              { label: 'Enviados · 30d', value: kpis.messages_sent_30d, animated: true },
              { label: 'Tasa de respuesta', value: kpis.response_rate_30d, format: 'percent', delta: 8.7 },
              {
                label: 'Revenue atribuido · 30d',
                value: kpis.revenue_attributed_30d,
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
          score={kpis.base_health_score}
          activeCount={activeCount}
          totalCount={kpis.total_guests}
          diagnosis="uno de cada dos comensales se está yendo por la puerta."
        />
        <SegmentLedger summaries={summaries} />
      </section>

      {/* Active campaigns strip */}
      <section className="pb-20">
        <div className="editorial-container flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
          <div>
            <SectionLabel className="mb-2">Campañas activas</SectionLabel>
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
            className="inline-flex items-center gap-2 text-[10.5px] uppercase font-[600] px-4 py-2 transition-colors self-start md:self-auto k-outline-cta"
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
        totalAtStake={kpis.revenue_at_stake}
        dormantCount={dormantCount}
        avgTicket={DEFAULT_RESTAURANT.avg_ticket}
      />

      {ticker.length > 0 && <ActivityTicker items={ticker} />}
    </AppShell>
  );
}
