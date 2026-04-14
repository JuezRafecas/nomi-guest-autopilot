import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Label } from '@/components/ui/Label';
import { Numeral } from '@/components/ui/Numeral';
import { Button } from '@/components/ui/Button';
import { CampaignStatusBadge } from '@/components/campaigns/CampaignStatusBadge';
import { WorkflowDiagram } from '@/components/campaigns/WorkflowDiagram';
import { AudienceSummary } from '@/components/campaigns/AudienceSummary';
import { MessagePreview } from '@/components/actions/MessagePreview';
import { getMockCampaignById, MOCK_SAMPLE_MESSAGES } from '@/lib/mock';
import { TEMPLATES } from '@/lib/templates';
import { describeAudience } from '@/lib/audience';
import { formatARS } from '@/lib/constants';

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = getMockCampaignById(id);
  if (!campaign) notFound();
  const tpl = campaign.template_key ? TEMPLATES[campaign.template_key] : null;
  const sampleMessage = tpl ? MOCK_SAMPLE_MESSAGES[tpl.accent] : '';

  return (
    <AppShell>
      <Header />

      <section className="editorial-container pt-12 pb-10">
        <Link
          href="/campaigns"
          className="inline-block font-mono text-[10px] uppercase tracking-label text-fg-subtle hover:text-fg mb-10"
        >
          ← Todas las campañas
        </Link>

        <div className="flex items-start justify-between gap-8 mb-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <CampaignStatusBadge status={campaign.status} animated />
              <span className="text-[10px] uppercase tracking-label text-fg-subtle">
                {campaign.type === 'automation' ? 'Automación' : 'Campaña puntual'}
              </span>
              {tpl && (
                <span className="text-[10px] uppercase tracking-label text-fg-subtle">
                  · {tpl.name}
                </span>
              )}
            </div>
            <h1
              className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] text-fg max-w-[24ch]"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}
            >
              {campaign.name}
            </h1>
            {campaign.description && (
              <p
                className="mt-4 font-display italic text-xl text-fg-muted max-w-[56ch] leading-snug"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
              >
                {campaign.description}.
              </p>
            )}
          </div>

          <div className="shrink-0 flex items-center gap-3 pt-4">
            {campaign.status === 'active' ? (
              <Button variant="ghost">Pausar</Button>
            ) : campaign.status === 'scheduled' ? (
              <Button variant="primary">Lanzar ahora</Button>
            ) : (
              <Button variant="primary">Activar</Button>
            )}
            <Button variant="link">Duplicar</Button>
          </div>
        </div>
      </section>

      {/* KPI row */}
      <section className="editorial-container pb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 border-y border-hairline">
          <Metric label="Enviados" value={campaign.metrics.sent} />
          <Metric label="Leídos" value={Math.round(campaign.metrics.read_rate * 100)} suffix="%" />
          <Metric label="Respondidos" value={Math.round(campaign.metrics.response_rate * 100)} suffix="%" />
          <Metric label="Convirtieron" value={campaign.metrics.converted} />
          <Metric
            label="Revenue"
            value={campaign.metrics.revenue_attributed}
            format="ars"
            accent
          />
        </div>
      </section>

      {/* Workflow + Audience + Message */}
      <section className="editorial-container pb-24 grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,380px)] gap-10">
        <div>
          <Label className="mb-4">Workflow</Label>
          <WorkflowDiagram
            workflow={tpl?.workflow ?? campaign.workflow}
            accent={tpl?.accent ?? 'active'}
          />
        </div>

        <aside className="space-y-8">
          <AudienceSummary
            filter={campaign.audience_filter}
            matchedCount={Math.max(50, campaign.metrics.sent)}
            tierBreakdown={[
              { label: 'VIP', count: Math.round(Math.max(50, campaign.metrics.sent) * 0.18) },
              { label: 'Frecuentes', count: Math.round(Math.max(50, campaign.metrics.sent) * 0.42) },
              { label: 'Ocasionales', count: Math.round(Math.max(50, campaign.metrics.sent) * 0.40) },
            ]}
          />

          <div>
            <Label className="mb-3">Ejemplo de mensaje</Label>
            <MessagePreview message={sampleMessage || 'Ejemplo generado a partir del template.'} />
          </div>

          <div className="border border-hairline bg-bg-raised p-6">
            <Label className="mb-3">Detalles</Label>
            <dl className="space-y-3 text-[12px]">
              <Row label="Creada" value={new Date(campaign.created_at).toLocaleDateString('es-AR')} />
              {campaign.started_at && (
                <Row label="Iniciada" value={new Date(campaign.started_at).toLocaleDateString('es-AR')} />
              )}
              <Row label="Canales" value={campaign.channels.join(', ')} />
              <Row label="Audiencia" value={describeAudience(campaign.audience_filter)} />
              {campaign.estimated_revenue && (
                <Row label="Revenue estimado" value={formatARS(campaign.estimated_revenue)} accent />
              )}
            </dl>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}

function Metric({
  label,
  value,
  suffix,
  format,
  accent,
}: {
  label: string;
  value: number;
  suffix?: string;
  format?: 'ars';
  accent?: boolean;
}) {
  return (
    <div className="px-8 py-10 border-r border-hairline last:border-r-0">
      <Label className="mb-3">{label}</Label>
      <div className={`font-mono text-3xl md:text-4xl tabular-nums ${accent ? 'text-accent' : 'text-fg'}`}>
        <Numeral value={value} format={format === 'ars' ? 'ars' : 'plain'} />
        {suffix && <span className="text-sm text-fg-subtle ml-1">{suffix}</span>}
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-[10px] uppercase tracking-label text-fg-subtle shrink-0">{label}</dt>
      <dd className={`font-mono text-[12px] text-right truncate ${accent ? 'text-accent' : 'text-fg-muted'}`}>
        {value}
      </dd>
    </div>
  );
}
