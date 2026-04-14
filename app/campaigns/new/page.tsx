import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { WorkflowDiagram } from '@/components/campaigns/WorkflowDiagram';
import { AudienceSummary } from '@/components/campaigns/AudienceSummary';
import { TEMPLATES, TEMPLATE_ORDER } from '@/lib/templates';
import type { TemplateKey } from '@/lib/types';

export default async function NewCampaignPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template: templateParam } = await searchParams;
  const templateKey =
    templateParam && TEMPLATE_ORDER.includes(templateParam as TemplateKey)
      ? (templateParam as TemplateKey)
      : 'reactivate_inactive';

  const tpl = TEMPLATES[templateKey];

  return (
    <AppShell>
      <Header />

      <section className="editorial-container pt-12 pb-10">
        <Link
          href="/templates"
          className="inline-block font-mono text-[10px] uppercase tracking-label text-fg-subtle hover:text-fg mb-10"
        >
          ← Volver a plantillas
        </Link>

        <Label className="mb-3">Nueva campaña desde plantilla</Label>
        <h1
          className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] text-fg max-w-[22ch]"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}
        >
          {tpl.name}
        </h1>
        <p
          className="mt-4 font-display italic text-xl text-fg-muted max-w-[56ch] leading-snug"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
        >
          {tpl.description}
        </p>
      </section>

      <section className="editorial-container pb-24 grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,380px)] gap-10">
        <div>
          <Label className="mb-4">Workflow propuesto</Label>
          <WorkflowDiagram workflow={tpl.workflow} accent={tpl.accent} />
        </div>

        <aside className="space-y-8">
          <AudienceSummary filter={tpl.default_audience} matchedCount={402} />

          <div className="border border-hairline bg-bg-raised p-8">
            <Label className="mb-4">Revisar y lanzar</Label>
            <p
              className="font-display italic text-[15px] text-fg-muted leading-snug mb-8"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              vas a activar esta campaña con los parámetros por defecto del template.
              los mensajes se generan al vuelo, vos aprobás antes de que salgan.
            </p>
            <div className="flex flex-col gap-3">
              <Button variant="primary" className="w-full">
                Activar campaña
              </Button>
              <Button variant="ghost" className="w-full">
                Editar parámetros
              </Button>
            </div>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
