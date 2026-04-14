import { NextResponse } from 'next/server';
import { MOCK_MESSAGES } from '@/lib/mock';

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  // TODO (hackathon): query messages where campaign_id = id
  const messages = MOCK_MESSAGES.filter((m) => m.campaign_name.toLowerCase().includes('reactivar'));
  return NextResponse.json({ campaign_id: id, messages });
}
