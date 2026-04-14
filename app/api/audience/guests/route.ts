import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { DEFAULT_RESTAURANT } from '@/lib/constants';
import type { Segment, AudienceTier, GuestProfile, Guest } from '@/lib/types';

const VALID_SEGMENTS: Segment[] = ['lead', 'new', 'active', 'at_risk', 'dormant', 'vip'];
const VALID_TIERS: AudienceTier[] = ['vip', 'frequent', 'occasional'];

const SORT_COLUMNS = {
  visits: 'total_visits',
  spent: 'total_spent',
  recent: 'last_visit_at',
  inactive: 'days_since_last',
} as const;
type SortKey = keyof typeof SORT_COLUMNS;

function isSortKey(value: string): value is SortKey {
  return value in SORT_COLUMNS;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const segment = url.searchParams.get('segment');
  const tier = url.searchParams.get('tier');
  const sortParam = url.searchParams.get('sort') ?? 'visits';
  const sort: SortKey = isSortKey(sortParam) ? sortParam : 'visits';
  const limit = Math.min(Number(url.searchParams.get('limit') ?? '50'), 5000);
  const offset = Number(url.searchParams.get('offset') ?? '0');
  const minVisits = Number(url.searchParams.get('min_visits') ?? '0');
  const maxDaysSinceLast = url.searchParams.get('max_days_since_last');
  const search = url.searchParams.get('q')?.trim();

  if (segment && !VALID_SEGMENTS.includes(segment as Segment)) {
    return NextResponse.json({ error: `invalid segment: ${segment}` }, { status: 400 });
  }
  if (tier && !VALID_TIERS.includes(tier as AudienceTier)) {
    return NextResponse.json({ error: `invalid tier: ${tier}` }, { status: 400 });
  }

  try {
    const db = getServiceClient();
    const { data: restaurant, error: rErr } = await db
      .from('restaurants')
      .select('id')
      .eq('slug', DEFAULT_RESTAURANT.slug)
      .maybeSingle();
    if (rErr || !restaurant) {
      return NextResponse.json({ error: 'restaurant not found' }, { status: 500 });
    }

    let query = db
      .from('guest_profiles')
      .select('*, guest:guests(*)', { count: 'exact' })
      .eq('restaurant_id', restaurant.id);

    if (segment) query = query.eq('segment', segment);
    if (tier) query = query.eq('tier', tier);
    if (minVisits > 0) query = query.gte('total_visits', minVisits);
    if (maxDaysSinceLast) {
      const n = Number(maxDaysSinceLast);
      if (Number.isFinite(n) && n > 0) query = query.lte('days_since_last', n);
    }
    if (search) {
      query = query.ilike('guests.name', `%${search}%`);
    }

    const ascending = sort === 'inactive';
    const { data, count, error } = await query
      .order(SORT_COLUMNS[sort], { ascending, nullsFirst: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;

    const guests = (data ?? []) as Array<GuestProfile & { guest: Guest | null }>;
    return NextResponse.json({ guests, total: count ?? guests.length, sort });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
