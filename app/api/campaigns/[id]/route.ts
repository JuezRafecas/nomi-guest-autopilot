import { NextResponse } from 'next/server';
import { getMockCampaignById } from '@/lib/mock';

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const campaign = getMockCampaignById(id);
  if (!campaign) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  return NextResponse.json({ campaign });
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();
  // TODO (hackathon): update campaign fields in DB
  return NextResponse.json({ id, updates: body, status: 'not_persisted' });
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  // TODO (hackathon): soft-delete campaign (status = 'archived')
  return NextResponse.json({ id, archived: true });
}
