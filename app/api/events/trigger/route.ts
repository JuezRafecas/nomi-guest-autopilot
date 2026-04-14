import { NextResponse } from 'next/server';
import type { EventType } from '@/lib/types';

/**
 * POST /api/events/trigger
 * Enqueue a synthetic event (for testing automations).
 * Body: { event_type: EventType, guest_id?: string, payload?: object }
 *
 * TODO (hackathon): insert into events table, kick dispatcher.
 */
export async function POST(req: Request) {
  const body = (await req.json()) as {
    event_type: EventType;
    guest_id?: string;
    payload?: Record<string, unknown>;
  };
  return NextResponse.json({
    event_type: body.event_type,
    queued: true,
    created_at: new Date().toISOString(),
  });
}
