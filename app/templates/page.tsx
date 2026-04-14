import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Label } from '@/components/ui/Label';
import { TemplateCard } from '@/components/campaigns/TemplateCard';
import { TEMPLATES, TEMPLATE_ORDER } from '@/lib/templates';

export default function TemplatesPage() {
  return (
    <AppShell>
      <Header />

      <section className="editorial-container pt-16 pb-10">
        <Label className="mb-3">Plantillas de campaña</Label>
        <h1
          className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] text-fg max-w-[22ch]"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}
        >
          Cinco recetas. <span className="italic">Cero configuración.</span>
        </h1>
        <p
          className="mt-4 font-display italic text-xl text-fg-muted max-w-[56ch] leading-snug"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
        >
          cada plantilla incluye audiencia, disparador, flujo de mensajes y los KPIs que optimiza.
          vos aprobás, nosotros ejecutamos.
        </p>
      </section>

      <section className="editorial-container pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-hairline [&>*]:border-r [&>*]:border-b [&>*]:border-hairline">
          {TEMPLATE_ORDER.map((key, i) => (
            <TemplateCard key={key} template={TEMPLATES[key]} index={i} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
