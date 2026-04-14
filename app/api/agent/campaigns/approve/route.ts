import type { NextRequest } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { isValidDraft, persistCampaignDraft } from '@/lib/agent/persist';
import type { CampaignDraft } from '@/lib/agent/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let supabase;
  try {
    supabase = getServiceClient();
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Supabase not configured.' },
      { status: 501 }
    );
  }

  const body = (await req.json()) as { draft?: CampaignDraft };
  if (!body.draft || !isValidDraft(body.draft)) {
    return Response.json(
      {
        error:
          'Invalid draft: missing restaurant_id, name, type, workflow, audience_filter or trigger.',
      },
      { status: 400 }
    );
  }

  try {
    const campaign = await persistCampaignDraft(supabase, {
      ...body.draft,
      source: 'nomi',
      reasoning: body.draft.reasoning,
    });
    return Response.json({ campaign }, { status: 201 });
  } catch (err) {
    const detail = supabaseErrorDetail(err);
    return Response.json(
      {
        error: `Failed to persist campaign${detail ? `: ${detail}` : '.'}`,
      },
      { status: 500 }
    );
  }
}

function supabaseErrorDetail(err: unknown): string | null {
  if (!err || typeof err !== 'object') {
    return err instanceof Error ? err.message : null;
  }
  const e = err as { message?: string; code?: string; details?: string; hint?: string };
  const parts = [e.code, e.message, e.details, e.hint].filter(
    (p): p is string => typeof p === 'string' && p.length > 0
  );
  return parts.length ? parts.join(' · ') : null;
}
