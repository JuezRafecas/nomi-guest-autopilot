import { NextResponse } from 'next/server';
import { MOCK_DASHBOARD_KPIS } from '@/lib/mock';

/**
 * GET /api/kpis
 * Dashboard KPI row (active campaigns, messages sent, response rate, revenue).
 * TODO (hackathon): compute from campaigns + messages + attributions tables.
 */
export async function GET() {
  return NextResponse.json({ kpis: MOCK_DASHBOARD_KPIS });
}
