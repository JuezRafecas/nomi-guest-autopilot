import { NextResponse } from 'next/server';
import { MOCK_SEGMENT_SUMMARIES } from '@/lib/mock';

/**
 * GET /api/audience/segments
 * Returns the segment distribution summary (count, %, trend, revenue opportunity).
 * TODO (hackathon): query guest_profiles grouped by segment.
 */
export async function GET() {
  return NextResponse.json({ summaries: MOCK_SEGMENT_SUMMARIES });
}
