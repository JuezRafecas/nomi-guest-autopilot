import { NextResponse } from 'next/server';
import { MOCK_MESSAGES } from '@/lib/mock';
import type { MessageStatus } from '@/lib/types';

/**
 * GET /api/messages?status=pending_approval&campaign_id=xyz
 * Returns the message inbox with optional filters.
 * TODO (hackathon): query DB with joins to guests + campaigns.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get('status') as MessageStatus | null;
  let messages = MOCK_MESSAGES;
  if (status) {
    messages = messages.filter((m) => m.status === status);
  }
  return NextResponse.json({ messages });
}
