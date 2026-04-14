import { describe, expect, it } from 'vitest';
import { validateWorkflow } from '../workflow-validation';
import type { WorkflowStep } from '../../types';

describe('validateWorkflow', () => {
  it('accepts a minimal linear workflow with send → wait → end', () => {
    const workflow: WorkflowStep[] = [
      {
        id: 'send_1',
        kind: 'send_message',
        channel: 'whatsapp',
        template_id: 'agent_generated',
        prompt_key: 'reactivation',
        next: 'wait_1',
      },
      { id: 'wait_1', kind: 'wait', hours: 48, next: 'end' },
      { id: 'end', kind: 'end', outcome: 'completed' },
    ];
    const result = validateWorkflow(workflow);
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects an empty workflow', () => {
    const result = validateWorkflow([]);
    expect(result.ok).toBe(false);
    expect(result.errors).toContain('workflow is empty');
  });

  it('rejects duplicate step ids', () => {
    const workflow: WorkflowStep[] = [
      {
        id: 'send_1',
        kind: 'send_message',
        channel: 'whatsapp',
        template_id: 'agent_generated',
        prompt_key: 'reactivation',
        next: 'send_1',
      },
      {
        id: 'send_1',
        kind: 'send_message',
        channel: 'email',
        template_id: 'agent_generated',
        prompt_key: 'reactivation',
        next: 'end',
      },
      { id: 'end', kind: 'end', outcome: 'completed' },
    ];
    const result = validateWorkflow(workflow);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes('duplicate'))).toBe(true);
  });

  it('rejects a next pointer that references a missing step id', () => {
    const workflow: WorkflowStep[] = [
      {
        id: 'send_1',
        kind: 'send_message',
        channel: 'whatsapp',
        template_id: 'agent_generated',
        prompt_key: 'reactivation',
        next: 'ghost',
      },
      { id: 'end', kind: 'end', outcome: 'completed' },
    ];
    const result = validateWorkflow(workflow);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes('ghost'))).toBe(true);
  });

  it('rejects a workflow with no end step', () => {
    const workflow: WorkflowStep[] = [
      {
        id: 'send_1',
        kind: 'send_message',
        channel: 'whatsapp',
        template_id: 'agent_generated',
        prompt_key: 'reactivation',
        next: 'wait_1',
      },
      { id: 'wait_1', kind: 'wait', hours: 24 },
    ];
    const result = validateWorkflow(workflow);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.toLowerCase().includes('end'))).toBe(true);
  });

  it('rejects a branch step with a target that does not exist', () => {
    const workflow: WorkflowStep[] = [
      {
        id: 'send_1',
        kind: 'send_message',
        channel: 'whatsapp',
        template_id: 'agent_generated',
        prompt_key: 'reactivation',
        next: 'decision',
      },
      {
        id: 'decision',
        kind: 'branch',
        condition: 'message_response',
        branches: [
          { label: 'Positive', matches: 'positive', next: 'end' },
          { label: 'No response', matches: 'no_response', next: 'ghost_branch' },
        ],
      },
      { id: 'end', kind: 'end', outcome: 'completed' },
    ];
    const result = validateWorkflow(workflow);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes('ghost_branch'))).toBe(true);
  });

  it('rejects a workflow where the first step cannot reach any end step', () => {
    const workflow: WorkflowStep[] = [
      {
        id: 'send_1',
        kind: 'send_message',
        channel: 'whatsapp',
        template_id: 'agent_generated',
        prompt_key: 'reactivation',
      },
      { id: 'end_unreached', kind: 'end', outcome: 'completed' },
    ];
    const result = validateWorkflow(workflow);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.toLowerCase().includes('unreachable'))).toBe(
      true
    );
  });

  it('accepts an extensive branching workflow with multiple sends and waits', () => {
    const workflow: WorkflowStep[] = [
      {
        id: 'send_initial',
        kind: 'send_message',
        channel: 'whatsapp',
        template_id: 'agent_generated',
        prompt_key: 'reactivation',
        content_brief: 'Warm reactivation — mention their preferred day.',
        next: 'wait_for_response',
      },
      { id: 'wait_for_response', kind: 'wait', hours: 72, next: 'decision_1' },
      {
        id: 'decision_1',
        kind: 'branch',
        condition: 'message_response',
        branches: [
          { label: 'Positive', matches: 'positive', next: 'end_positive' },
          { label: 'Negative', matches: 'negative', next: 'end_negative' },
          { label: 'No response', matches: 'no_response', next: 'send_followup' },
        ],
      },
      {
        id: 'send_followup',
        kind: 'send_message',
        channel: 'email',
        template_id: 'agent_generated',
        prompt_key: 'reactivation',
        content_brief: 'Softer follow-up. No pressure.',
        next: 'wait_final',
      },
      { id: 'wait_final', kind: 'wait', hours: 168, next: 'end_silent' },
      { id: 'end_positive', kind: 'end', outcome: 'completed' },
      { id: 'end_negative', kind: 'end', outcome: 'completed' },
      { id: 'end_silent', kind: 'end', outcome: 'completed' },
    ];
    const result = validateWorkflow(workflow);
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });
});
