'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { FilterBar, type FilterOption } from '@/components/ui/FilterBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { CampaignRow } from '@/components/campaigns/CampaignRow';
import { CAMPAIGN_STATUS_ORDER, CAMPAIGN_STATUS_LABEL } from '@/lib/campaigns';
import type { Campaign, CampaignStatus } from '@/lib/types';

type StatusFilter = 'all' | CampaignStatus;

export function CampaignsClient({
  campaigns,
  pendingCount,
}: {
  campaigns: Campaign[];
  pendingCount?: number;
}) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const ordered = useMemo(
    () =>
      [...campaigns].sort(
        (a, b) =>
          CAMPAIGN_STATUS_ORDER.indexOf(a.status) -
          CAMPAIGN_STATUS_ORDER.indexOf(b.status)
      ),
    [campaigns]
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: ordered.length };
    for (const c of ordered) map[c.status] = (map[c.status] ?? 0) + 1;
    return map;
  }, [ordered]);

  const activeCount = counts.active ?? 0;
  const scheduledCount = counts.scheduled ?? 0;

  const filtered = useMemo(
    () =>
      statusFilter === 'all'
        ? ordered
        : ordered.filter((c) => c.status === statusFilter),
    [ordered, statusFilter]
  );

  const filterOptions: FilterOption[] = useMemo(() => {
    const base: FilterOption[] = [
      { value: 'all', label: 'Todas', count: counts.all },
    ];
    for (const s of CAMPAIGN_STATUS_ORDER) {
      if (!counts[s]) continue;
      base.push({ value: s, label: CAMPAIGN_STATUS_LABEL[s], count: counts[s] });
    }
    return base;
  }, [counts]);

  return (
    <AppShell pendingCount={pendingCount}>
      <Header title="Todas las campañas" subtitle="Campañas" />

      <section className="editorial-container section-pt-lead section-pb-close">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-10 mb-8">
          <div>
            <Label className="mb-3">Campañas</Label>
            <h1
              className="font-display text-[clamp(2rem,5vw,4.5rem)] leading-[0.95] text-fg max-w-[22ch]"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}
            >
              <span className="italic">{activeCount} campañas activas</span>
              {scheduledCount > 0 && (
                <span className="text-fg-muted">, {scheduledCount} programada{scheduledCount > 1 ? 's' : ''}.</span>
              )}
            </h1>
          </div>
          <div className="shrink-0 md:pt-4">
            <Link href="/templates">
              <Button variant="primary">Nueva campaña</Button>
            </Link>
          </div>
        </div>

        <div className="border-t border-hairline pt-3">
          <FilterBar
            label="Filtrar campañas por estado"
            options={filterOptions}
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as StatusFilter)}
          />
        </div>
      </section>

      <section className="editorial-container pb-24">
        <div className="border-t border-hairline">
          <header className="hidden lg:grid grid-cols-[minmax(0,1.8fr)_100px_90px_100px_140px_auto] items-end gap-6 pl-8 pr-6 pt-4 pb-3">
            <Label>Campaña</Label>
            <Label className="text-right">Enviados</Label>
            <Label className="text-right">Respuesta</Label>
            <Label className="text-right">Conversión</Label>
            <Label className="text-right">Revenue</Label>
            <Label className="text-right">Acción</Label>
          </header>
          <div className="border-t border-hairline">
            {filtered.length === 0 ? (
              <EmptyState
                title={
                  statusFilter === 'all'
                    ? 'Sin campañas todavía.'
                    : `Nada ${CAMPAIGN_STATUS_LABEL[statusFilter as CampaignStatus].toLowerCase()}.`
                }
                hint={
                  statusFilter === 'all'
                    ? 'Elegí una plantilla para empezar. Vos aprobás, nosotros ejecutamos.'
                    : 'Probá otro estado, o creá una desde cero con una plantilla.'
                }
                cta={{ label: 'Ver plantillas', href: '/templates' }}
              />
            ) : (
              filtered.map((c, i) => <CampaignRow key={c.id} campaign={c} index={i} />)
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
