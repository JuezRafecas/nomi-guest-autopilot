import { NextResponse } from 'next/server';
import { MOCK_GUESTS } from '@/lib/mock';
import type { Segment } from '@/lib/types';

/**
 * GET /api/audience/guests?segment=dormant
 * Returns guests, optionally filtered by segment.
 * TODO (hackathon): query guest_profiles joined with guests.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const segment = url.searchParams.get('segment') as Segment | null;
  const rows = segment ? MOCK_GUESTS.filter((g) => g.segment === segment) : MOCK_GUESTS;
  return NextResponse.json({ guests: rows });
}
