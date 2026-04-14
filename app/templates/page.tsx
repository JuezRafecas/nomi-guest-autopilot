'use client';

import { useMemo, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Label } from '@/components/ui/Label';
import { FilterBar, type FilterOption } from '@/components/ui/FilterBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { TemplateCard } from '@/components/campaigns/TemplateCard';
import { TEMPLATES, TEMPLATE_ORDER } from '@/lib/templates';

type Scope = 'all' | 'automation' | 'one_shot';

export default function TemplatesPage() {
  const [scope, setScope] = useState<Scope>('all');

  const allTemplates = useMemo(() => TEMPLATE_ORDER.map((k) => TEMPLATES[k]), []);

  const counts = useMemo(() => {
    const map = { all: allTemplates.length, automation: 0, one_shot: 0 };
    for (const t of allTemplates) map[t.type]++;
    return map;
  }, [allTemplates]);

  const filtered = useMemo(
    () => (scope === 'all' ? allTemplates : allTemplates.filter((t) => t.type === scope)),
    [allTemplates, scope]
  );

  const filterOptions: FilterOption[] = [
    { value: 'all', label: 'Todas', count: counts.all },
    { value: 'automation', label: 'Automaciones', count: counts.automation },
    { value: 'one_shot', label: 'Puntuales', count: counts.one_shot },
  ];

  return (
    <AppShell>
      <Header title="Plantillas" subtitle="Recetas aprobadas" live={false} />

      <section className="editorial-container section-pt-lead section-pb-close">
        <Label className="mb-3">Plantillas de campaña</Label>
        <h1
          className="font-display text-[clamp(2rem,5vw,4.5rem)] leading-[0.95] text-fg max-w-[22ch]"
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

      <section className="editorial-container pb-5">
        <div className="border-t border-hairline pt-3">
          <FilterBar
            label="Filtrar plantillas por tipo"
            options={filterOptions}
            value={scope}
            onChange={(v) => setScope(v as Scope)}
          />
        </div>
      </section>

      <section className="editorial-container pb-24">
        {filtered.length === 0 ? (
          <div className="border-t border-hairline">
            <EmptyState
              title="Nada en este tipo."
              hint="Probá con otro filtro. Las cinco recetas cubren los momentos clave del ciclo de vida."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-hairline [&>*]:border-r [&>*]:border-b [&>*]:border-hairline">
            {filtered.map((tpl, i) => (
              <TemplateCard key={tpl.key} template={tpl} index={i} />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
