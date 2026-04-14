import { NextResponse } from 'next/server';
import { MOCK_CAMPAIGNS } from '@/lib/mock';
import { campaignFromTemplate } from '@/lib/campaigns';
import type { TemplateKey } from '@/lib/types';

/**
 * GET /api/campaigns
 * List campaigns. TODO (hackathon): query from DB, filter by status.
 */
export async function GET() {
  return NextResponse.json({ campaigns: MOCK_CAMPAIGNS });
}

/**
 * POST /api/campaigns
 * Create a new campaign from a template.
 * Body: { template_key: TemplateKey, name?: string, restaurant_id: string }
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      template_key: TemplateKey;
      name?: string;
      restaurant_id: string;
    };
    if (!body.template_key || !body.restaurant_id) {
      return NextResponse.json(
        { error: 'template_key and restaurant_id are required' },
        { status: 400 }
      );
    }
    const draft = campaignFromTemplate(body.template_key, body.restaurant_id, {
      name: body.name,
    });
    // TODO (hackathon): persist to supabase.campaigns table
    return NextResponse.json({ campaign: { ...draft, id: 'preview', created_at: new Date().toISOString() } });
  } catch (err) {
    const m = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: m }, { status: 500 });
  }
}
