import { describe, it, expect } from 'vitest';
import { shouldAttribute, summarizeAttributions } from '../lib/attribution';
import { emptyMetrics } from '../lib/campaigns';
import type { Attribution, Campaign, Message, Visit } from '../lib/types';

function msg(overrides: Partial<Message> = {}): Pick<Message, 'sent_at' | 'guest_id' | 'status'> {
  return {
    sent_at: '2026-04-01T12:00:00Z',
    guest_id: 'g1',
    status: 'sent',
    ...overrides,
  };
}

function visit(overrides: Partial<Visit> = {}): Pick<Visit, 'visit_date' | 'guest_id'> {
  return {
    visit_date: '2026-04-10T20:00:00Z',
    guest_id: 'g1',
    ...overrides,
  };
}

describe('shouldAttribute', () => {
  it('attributes a visit within the default 14-day window', () => {
    expect(shouldAttribute(msg(), visit())).toBe(true);
  });
  it('rejects visits outside the window', () => {
    expect(shouldAttribute(msg(), visit({ visit_date: '2026-04-20T00:00:00Z' }))).toBe(false);
  });
  it('rejects when guest IDs differ', () => {
    expect(shouldAttribute(msg(), visit({ guest_id: 'g2' }))).toBe(false);
  });
  it('rejects failed messages', () => {
    expect(shouldAttribute(msg({ status: 'failed' }), visit())).toBe(false);
  });
  it('rejects visits that happened before the send', () => {
    expect(
      shouldAttribute(msg(), visit({ visit_date: '2026-03-20T00:00:00Z' }))
    ).toBe(false);
  });
  it('honors a custom window', () => {
    expect(shouldAttribute(msg(), visit({ visit_date: '2026-04-25T00:00:00Z' }), 30)).toBe(true);
  });
});

describe('summarizeAttributions', () => {
  it('groups attributions by campaign and computes rate', () => {
    const campaigns: Array<Pick<Campaign, 'id' | 'name' | 'template_key' | 'metrics'>> = [
      {
        id: 'c1',
        name: 'Campaign A',
        template_key: 'reactivate_inactive',
        metrics: { ...emptyMetrics(), sent: 100 },
      },
      {
        id: 'c2',
        name: 'Campaign B',
        template_key: 'post_visit_smart',
        metrics: { ...emptyMetrics(), sent: 50 },
      },
    ];
    const attributions: Attribution[] = [
      attr('c1', 40_000),
      attr('c1', 60_000),
      attr('c2', 30_000),
    ];
    const rows = summarizeAttributions(attributions, campaigns);
    expect(rows).toHaveLength(2);
    const a = rows.find((r) => r.campaign_id === 'c1')!;
    expect(a.conversions).toBe(2);
    expect(a.revenue).toBe(100_000);
    expect(a.rate).toBeCloseTo(0.02);
  });
});

function attr(campaign_id: string, amount: number): Attribution {
  return {
    id: `a_${Math.random()}`,
    restaurant_id: 'r1',
    campaign_id,
    message_id: 'm1',
    guest_id: 'g1',
    visit_id: 'v1',
    amount,
    attribution_window_days: 14,
    attributed_at: '2026-04-10T00:00:00Z',
  };
}
