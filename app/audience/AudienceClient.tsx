'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Label } from '@/components/ui/Label';
import { FilterBar, type FilterOption } from '@/components/ui/FilterBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { SegmentLedger } from '@/components/dashboard/SegmentLedger';
import { GuestList } from '@/components/guests/GuestList';
import { Numeral } from '@/components/ui/Numeral';
import { SEGMENT_CONFIG, SEGMENT_HEX, SEGMENT_ORDER } from '@/lib/constants';
import type { Segment, SegmentSummary } from '@/lib/types';
import type { GuestRow } from '@/lib/api';

type Scope = 'all' | Segment;
type SortKey = 'visits' | 'spent' | 'recent' | 'inactive';

const VALID_SEGMENTS = new Set<string>(SEGMENT_ORDER);

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'visits', label: 'Most visits' },
  { value: 'spent', label: 'Top spend' },
  { value: 'recent', label: 'Most recent' },
  { value: 'inactive', label: 'Most inactive' },
];

const MIN_VISITS_OPTIONS: Array<{ value: number; label: string }> = [
  { value: 0, label: 'Any' },
  { value: 2, label: '2+' },
  { value: 5, label: '5+' },
  { value: 10, label: '10+' },
];

function sortGuests(rows: GuestRow[], sort: SortKey): GuestRow[] {
  const arr = [...rows];
  arr.sort((a, b) => {
    if (sort === 'visits') return b.total_visits - a.total_visits;
    if (sort === 'spent') return b.total_spent - a.total_spent;
    if (sort === 'recent') return a.days_since_last - b.days_since_last;
    return b.days_since_last - a.days_since_last;
  });
  return arr;
}

export function AudienceClient({
  summaries,
  guests,
  totalGuests,
  pendingCount,
}: {
  summaries: SegmentSummary[];
  guests: GuestRow[];
  totalGuests: number;
  pendingCount?: number;
}) {
  const params = useSearchParams();
  const initial = params?.get('segment');
  const initialScope: Scope =
    initial && VALID_SEGMENTS.has(initial) ? (initial as Segment) : 'all';
  const [scope, setScope] = useState<Scope>(initialScope);
  const [sort, setSort] = useState<SortKey>('visits');
  const [minVisits, setMinVisits] = useState<number>(0);
  const [search, setSearch] = useState('');

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: guests.length };
    for (const g of guests) {
      map[g.segment] = (map[g.segment] ?? 0) + 1;
    }
    return map;
  }, [guests]);

  const filtered = useMemo(() => {
    let rows = scope === 'all' ? guests : guests.filter((g) => g.segment === scope);
    if (minVisits > 0) rows = rows.filter((g) => g.total_visits >= minVisits);
    const q = search.trim().toLowerCase();
    if (q) rows = rows.filter((g) => g.name.toLowerCase().includes(q));
    return sortGuests(rows, sort);
  }, [scope, guests, minVisits, search, sort]);

  const filterOptions: FilterOption[] = useMemo(() => {
    const base: FilterOption[] = [
      { value: 'all', label: 'All', count: counts.all },
    ];
    for (const s of SEGMENT_ORDER) {
      if (!counts[s]) continue;
      base.push({
        value: s,
        label: SEGMENT_CONFIG[s].label,
        count: counts[s],
        dot: SEGMENT_HEX[s],
      });
    }
    return base;
  }, [counts]);

  return (
    <AppShell pendingCount={pendingCount}>
      <Header title="Audience" subtitle="Guest base" />

      <section className="editorial-container section-pt-lead section-pb-close">
        <Label className="mb-3">Audience · Guest base</Label>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10">
          <h1
            className="font-display text-[clamp(2.25rem,4.6vw,4.5rem)] leading-[0.95] text-fg max-w-[24ch]"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}
          >
            <span className="italic">{totalGuests}</span> guests in the base.
          </h1>
          <div className="md:text-right shrink-0 md:pb-4 flex items-baseline gap-3 md:block">
            <div className="text-[10px] uppercase tracking-label text-fg-subtle">Total base</div>
            <div className="font-mono text-2xl md:text-3xl text-fg-muted tabular-nums md:mt-1">
              <Numeral value={totalGuests} /> contacts
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-container pb-16">
        <SegmentLedger summaries={summaries} />
      </section>

      <section className="editorial-container pb-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-3">
          <Label>Featured guests</Label>
          <span
            className="font-mono text-[11px] uppercase tabular-nums"
            style={{ letterSpacing: '0.14em', color: 'var(--fg-subtle)' }}
          >
            Showing <span style={{ color: 'var(--fg)' }}>{filtered.length}</span> / {guests.length}
          </span>
        </div>
        <div className="border-t border-hairline pt-3">
          <FilterBar
            label="Filter guests by segment"
            options={filterOptions}
            value={scope}
            onChange={(v) => setScope(v as Scope)}
          />
        </div>

        <div className="mt-4 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] uppercase tracking-label"
              style={{ color: 'var(--fg-subtle)', letterSpacing: '0.16em' }}
            >
              Sort
            </span>
            {SORT_OPTIONS.map((opt) => {
              const active = sort === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSort(opt.value)}
                  className="font-mono text-[10px] uppercase px-2.5 py-1.5 transition-colors"
                  style={{
                    letterSpacing: '0.12em',
                    color: active ? 'var(--fg)' : 'var(--fg-subtle)',
                    border: '1px solid',
                    borderColor: active ? 'var(--fg)' : 'var(--hairline-strong)',
                    background: active ? 'var(--bg-raised)' : 'transparent',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] uppercase tracking-label"
              style={{ color: 'var(--fg-subtle)', letterSpacing: '0.16em' }}
            >
              Visits
            </span>
            {MIN_VISITS_OPTIONS.map((opt) => {
              const active = minVisits === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMinVisits(opt.value)}
                  className="font-mono text-[10px] uppercase px-2.5 py-1.5 transition-colors"
                  style={{
                    letterSpacing: '0.12em',
                    color: active ? 'var(--fg)' : 'var(--fg-subtle)',
                    border: '1px solid',
                    borderColor: active ? 'var(--fg)' : 'var(--hairline-strong)',
                    background: active ? 'var(--bg-raised)' : 'transparent',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="flex-1 md:max-w-[280px]">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name…"
              aria-label="Search guests by name"
              className="w-full bg-transparent px-3 py-2 text-[12px] focus:outline-none"
              style={{
                fontFamily: 'var(--font-kaszek-sans), Inter, system-ui, sans-serif',
                color: 'var(--fg)',
                border: '1px solid var(--hairline-strong)',
                letterSpacing: '-0.005em',
              }}
            />
          </div>
        </div>
      </section>

      <section className="editorial-container pb-24">
        {filtered.length === 0 ? (
          <div className="border-t border-hairline">
            <EmptyState
              title="No one matches these filters."
              hint="Loosen the filters or try a different segment."
            />
          </div>
        ) : (
          <GuestList rows={filtered} />
        )}
      </section>
    </AppShell>
  );
}
