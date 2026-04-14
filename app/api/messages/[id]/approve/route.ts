import { NextResponse } from 'next/server';

/**
 * POST /api/messages/[id]/approve
 * Moves a message from pending_approval → approved (and queues it for send).
 * TODO (hackathon):
 *  1. Load message, validate status === 'pending_approval'
 *  2. Update status = 'approved', approved_at = now()
 *  3. Enqueue for delivery (WhatsApp/Email provider adapter)
 */
export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return NextResponse.json({
    id,
    status: 'approved',
    approved_at: new Date().toISOString(),
    queued: true,
  });
}
