import { describe, it, expect } from 'vitest';
import {
  emptyMetrics,
  computeRates,
  campaignFromTemplate,
  walkWorkflow,
  countWorkflowSends,
  countWorkflowBranches,
} from '../lib/campaigns';
import { TEMPLATES } from '../lib/templates';

describe('emptyMetrics', () => {
  it('returns zeroed metrics', () => {
    const m = emptyMetrics();
    expect(m.sent).toBe(0);
    expect(m.revenue_attributed).toBe(0);
    expect(m.delivery_rate).toBe(0);
  });
});

describe('computeRates', () => {
  it('derives rates from counts', () => {
    const rates = computeRates({
      ...emptyMetrics(),
      sent: 100,
      delivered: 90,
      read: 45,
      responded: 15,
      converted: 10,
    });
    expect(rates.delivery_rate).toBeCloseTo(0.9);
    expect(rates.read_rate).toBeCloseTo(0.5);
    expect(rates.response_rate).toBeCloseTo(1 / 3, 2);
    expect(rates.conversion_rate).toBeCloseTo(0.1);
  });
  it('guards against divide-by-zero', () => {
    const rates = computeRates(emptyMetrics());
    expect(rates.delivery_rate).toBe(0);
    expect(rates.read_rate).toBe(0);
  });
});

describe('campaignFromTemplate', () => {
  it('creates a draft with template defaults', () => {
    const draft = campaignFromTemplate('reactivate_inactive', 'r1');
    expect(draft.template_key).toBe('reactivate_inactive');
    expect(draft.type).toBe('automation');
    expect(draft.status).toBe('draft');
    expect(draft.audience_filter.segments).toContain('dormant');
    expect(draft.workflow.length).toBeGreaterThan(0);
  });
  it('allows overrides', () => {
    const draft = campaignFromTemplate('post_visit_smart', 'r1', {
      name: 'Custom name',
      status: 'active',
    });
    expect(draft.name).toBe('Custom name');
    expect(draft.status).toBe('active');
  });
});

describe('walkWorkflow', () => {
  it('walks a sequential workflow', () => {
    const path = walkWorkflow(TEMPLATES.first_to_second_visit.workflow);
    expect(path.length).toBeGreaterThan(0);
    expect(path[0]).toBe('send_invite');
  });
  it('follows the first branch when no decision is given', () => {
    const path = walkWorkflow(TEMPLATES.reactivate_inactive.workflow);
    expect(path).toContain('send_reactivation');
    // first branch = positive
    expect(path).toContain('end_positive');
  });
  it('follows a specific branch when decision is given', () => {
    const path = walkWorkflow(TEMPLATES.reactivate_inactive.workflow, {
      branch_response: 'no_response',
    });
    expect(path).toContain('final_attempt');
  });
});

describe('workflow structural counts', () => {
  it('post_visit_smart has 3 sends and 1 branch', () => {
    expect(countWorkflowSends(TEMPLATES.post_visit_smart.workflow)).toBe(3);
    expect(countWorkflowBranches(TEMPLATES.post_visit_smart.workflow)).toBe(1);
  });
  it('reactivate_inactive has 2 sends and 1 branch', () => {
    expect(countWorkflowSends(TEMPLATES.reactivate_inactive.workflow)).toBe(2);
    expect(countWorkflowBranches(TEMPLATES.reactivate_inactive.workflow)).toBe(1);
  });
  it('all templates have at least one send step', () => {
    for (const key of Object.keys(TEMPLATES) as Array<keyof typeof TEMPLATES>) {
      expect(countWorkflowSends(TEMPLATES[key].workflow)).toBeGreaterThan(0);
    }
  });
});
