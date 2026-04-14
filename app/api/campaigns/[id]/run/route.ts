import { NextResponse } from 'next/server';

/**
 * POST /api/campaigns/[id]/run
 * Trigger a manual run of a campaign: materialize audience, generate messages
 * for each recipient (via /api/generate-message), and queue them in the
 * messages table with status = pending_approval.
 *
 * TODO (hackathon):
 *  1. Load campaign from DB
 *  2. Apply audience_filter via lib/audience.filterProfiles
 *  3. For each matched guest, call generateMessage() with the right prompt
 *  4. Insert row into messages with status='pending_approval'
 *  5. Update campaign metrics
 */
export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return NextResponse.json(
    {
      campaign_id: id,
      status: 'not_implemented',
      message: 'Implementar durante el hackathon',
    },
    { status: 501 }
  );
}
