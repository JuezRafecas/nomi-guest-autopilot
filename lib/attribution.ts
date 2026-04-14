import type { Attribution, AttributionSummary, Campaign, Message, Visit } from './types';

// ============================================================================
// Revenue attribution
// ============================================================================

/**
 * A visit attributes to a message if the visit occurred within the attribution
 * window (default 14 days) after the message was sent, and no other message
 * to the same guest was sent in between.
 *
 * Implementation intentionally simple — the hackathon can replace this with
 * multi-touch or time-decay models.
 */
export function shouldAttribute(
  message: Pick<Message, 'sent_at' | 'guest_id' | 'status'>,
  visit: Pick<Visit, 'visit_date' | 'guest_id'>,
  windowDays = 14
): boolean {
  if (!message.sent_at) return false;
  if (message.guest_id !== visit.guest_id) return false;
  if (message.status === 'failed') return false;
  const sent = new Date(message.sent_at).getTime();
  const visited = new Date(visit.visit_date).getTime();
  if (visited < sent) return false;
  const deltaDays = (visited - sent) / (1000 * 60 * 60 * 24);
  return deltaDays <= windowDays;
}

export function summarizeAttributions(
  attributions: Attribution[],
  campaigns: Pick<Campaign, 'id' | 'name' | 'template_key' | 'metrics'>[]
): AttributionSummary[] {
  const byCampaign = new Map<string, AttributionSummary>();
  for (const c of campaigns) {
    byCampaign.set(c.id, {
      campaign_id: c.id,
      campaign_name: c.name,
      template_key: c.template_key,
      messages_sent: c.metrics.sent,
      conversions: 0,
      revenue: 0,
      rate: 0,
    });
  }
  for (const a of attributions) {
    const row = byCampaign.get(a.campaign_id);
    if (!row) continue;
    row.conversions += 1;
    row.revenue += a.amount;
  }
  for (const row of byCampaign.values()) {
    row.rate = row.messages_sent === 0 ? 0 : row.conversions / row.messages_sent;
  }
  return Array.from(byCampaign.values()).sort((a, b) => b.revenue - a.revenue);
}
