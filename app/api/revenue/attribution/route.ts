import { NextResponse } from 'next/server';
import { MOCK_ATTRIBUTIONS } from '@/lib/mock';

/**
 * GET /api/revenue/attribution
 * Summarized revenue attribution by campaign.
 * TODO (hackathon): compute from attributions table joined with campaigns.
 */
export async function GET() {
  return NextResponse.json({ rows: MOCK_ATTRIBUTIONS });
}
