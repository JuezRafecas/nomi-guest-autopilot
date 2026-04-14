import { describe, it, expect } from 'vitest';
import { TEMPLATES, TEMPLATE_ORDER } from '../lib/templates';

describe('TEMPLATES', () => {
  it('has exactly 5 canonical templates', () => {
    expect(Object.keys(TEMPLATES)).toHaveLength(5);
  });

  it('TEMPLATE_ORDER matches TEMPLATES keys', () => {
    expect(TEMPLATE_ORDER.sort()).toEqual((Object.keys(TEMPLATES) as string[]).sort());
  });

  it('every template has a non-empty workflow', () => {
    for (const [key, tpl] of Object.entries(TEMPLATES)) {
      expect(tpl.workflow.length).toBeGreaterThan(0);
      expect(tpl.key).toBe(key);
    }
  });

  it('every template has at least one KPI label', () => {
    for (const tpl of Object.values(TEMPLATES)) {
      expect(tpl.kpi_labels.length).toBeGreaterThan(0);
    }
  });

  it('every workflow starts with a send_message step', () => {
    for (const tpl of Object.values(TEMPLATES)) {
      expect(tpl.workflow[0]!.kind).toBe('send_message');
    }
  });

  it('every workflow has at least one end step', () => {
    for (const tpl of Object.values(TEMPLATES)) {
      const hasEnd = tpl.workflow.some((s) => s.kind === 'end');
      expect(hasEnd).toBe(true);
    }
  });

  it('template types are valid', () => {
    for (const tpl of Object.values(TEMPLATES)) {
      expect(['automation', 'one_shot']).toContain(tpl.type);
    }
  });
});
