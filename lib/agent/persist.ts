import type { SupabaseClient } from '@supabase/supabase-js';
import { campaignFromRow, campaignInsertPayload, type CampaignRow } from '../campaigns-db';
import { emptyMetrics } from '../campaigns';
import type { Campaign } from '../types';
import type { CampaignDraft } from './types';

export async function persistCampaignDraft(
  supabase: SupabaseClient,
  draft: Omit<Campaign, 'id' | 'created_at' | 'updated_at' | 'metrics'> & {
    metrics?: Campaign['metrics'];
    source?: string;
    reasoning?: string;
  }
): Promise<Campaign> {
  const reasoning = draft.reasoning?.trim();
  const description = reasoning
    ? `${draft.description ?? ''}${draft.description ? '\n\n' : ''}Why: ${reasoning}`
    : draft.description;

  const payload = campaignInsertPayload({
    restaurant_id: draft.restaurant_id,
    template_key: draft.template_key,
    type: draft.type,
    name: draft.name,
    description: description ?? null,
    status: draft.status,
    audience_filter: draft.audience_filter,
    trigger: draft.trigger,
    workflow: draft.workflow,
    channels: draft.channels,
    metrics: draft.metrics ?? emptyMetrics(),
    estimated_revenue: draft.estimated_revenue,
    started_at: draft.started_at ?? null,
    completed_at: draft.completed_at ?? null,
  });

  const { data, error } = await supabase
    .from('campaigns')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return campaignFromRow(data as CampaignRow);
}

export function isValidDraft(draft: unknown): draft is CampaignDraft {
  if (!draft || typeof draft !== 'object') return false;
  const d = draft as Record<string, unknown>;
  return (
    typeof d.restaurant_id === 'string' &&
    typeof d.name === 'string' &&
    typeof d.type === 'string' &&
    Array.isArray(d.workflow) &&
    d.audience_filter != null &&
    d.trigger != null
  );
}
