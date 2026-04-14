import { tool } from 'ai';
import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  AudienceFilter,
  CampaignMetrics,
  CampaignTrigger,
  GuestProfile,
  Segment,
  WorkflowStep,
} from '../types';
import { filterProfiles, describeAudience, SEGMENT_LABEL } from '../audience';
import { deriveChannels, computeRates, emptyMetrics } from '../campaigns';
import { TEMPLATES, TEMPLATE_ORDER } from '../templates';
import { detectOpportunities } from './opportunities';
import { validateWorkflow } from './workflow-validation';
import type {
  CampaignDraft,
  CampaignResultsSummary,
  Opportunity,
  QueryCustomersResult,
  SegmentMetricRow,
} from './types';

export interface NomiToolDeps {
  restaurantId: string;
  avgTicket: number;
  supabase: SupabaseClient;
}

const SEGMENT_VALUES = ['lead', 'new', 'active', 'at_risk', 'dormant', 'vip'] as const;
const TIER_VALUES = ['vip', 'frequent', 'occasional'] as const;
const CHANNEL_VALUES = ['whatsapp', 'email', 'whatsapp_then_email', 'call'] as const;
const PROMPT_KEY_VALUES = [
  'reactivation',
  'second_visit',
  'post_visit',
  'fill_tables',
] as const;
const EVENT_VALUES = [
  'visit_completed',
  'visit_detected',
  'no_visit_threshold_reached',
  'low_occupancy_detected',
  'manual_enrollment',
] as const;
const BRANCH_CONDITION_VALUES = [
  'message_response',
  'visit_since_step',
  'custom',
] as const;

async function loadProfiles(
  supabase: SupabaseClient,
  restaurantId: string
): Promise<GuestProfile[]> {
  const { data, error } = await supabase
    .from('guest_profiles')
    .select('*, guest:guests(id, name, phone, email, opt_in_whatsapp, opt_in_email)')
    .eq('restaurant_id', restaurantId);
  if (error) throw error;
  return (data ?? []) as GuestProfile[];
}

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function revenueAtStakeFor(
  profiles: GuestProfile[],
  segment: Segment,
  avgTicket: number
): number {
  const cohort = profiles.filter((p) => p.segment === segment);
  if (segment === 'dormant') return Math.round(cohort.length * avgTicket * 0.08);
  if (segment === 'at_risk') return Math.round(cohort.length * avgTicket * 0.12);
  if (segment === 'new') return Math.round(cohort.length * avgTicket * 0.15);
  return 0;
}

// ---------- Workflow step schemas (zod) ------------------------------------

const sendStepSchema = z.object({
  id: z.string().min(1),
  kind: z.literal('send_message'),
  channel: z.enum(CHANNEL_VALUES),
  prompt_key: z.enum(PROMPT_KEY_VALUES).describe(
    'Which copy system-prompt to use. Pick the closest intent: reactivation for dormant/at_risk, second_visit for new guests, post_visit for feedback/review, fill_tables for low-occupancy invites.'
  ),
  content_brief: z
    .string()
    .min(5)
    .max(280)
    .describe(
      'One-line creative brief for this specific message (tone, hook, angle). Will be appended to the copy prompt at send time.'
    )
    .optional(),
  title: z
    .string()
    .min(3)
    .max(60)
    .describe('Short editorial title for this step (3–5 words).')
    .optional(),
  next: z.string().optional(),
});

const waitStepSchema = z.object({
  id: z.string().min(1),
  kind: z.literal('wait'),
  hours: z.number().int().positive().max(24 * 30),
  next: z.string().optional(),
});

const branchStepSchema = z.object({
  id: z.string().min(1),
  kind: z.literal('branch'),
  condition: z.enum(BRANCH_CONDITION_VALUES),
  branches: z
    .array(
      z.object({
        label: z.string().min(1),
        matches: z.string().min(1),
        next: z.string().min(1),
      })
    )
    .min(2),
});

const endStepSchema = z.object({
  id: z.string().min(1),
  kind: z.literal('end'),
  outcome: z.enum(['completed', 'escalated']),
});

const workflowStepSchema = z.discriminatedUnion('kind', [
  sendStepSchema,
  waitStepSchema,
  branchStepSchema,
  endStepSchema,
]);

const audienceSchema = z.object({
  segments: z.array(z.enum(SEGMENT_VALUES)).optional(),
  tiers: z.array(z.enum(TIER_VALUES)).optional(),
  min_total_visits: z.number().int().nonnegative().optional(),
  max_total_visits: z.number().int().nonnegative().optional(),
  visited_in_last_days: z.number().int().positive().optional(),
  not_visited_in_last_days: z.number().int().positive().optional(),
  preferred_day_of_week: z.string().optional(),
  preferred_shift: z.string().optional(),
  requires_opt_in: z.enum(CHANNEL_VALUES).optional(),
});

const triggerSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('event'),
    event: z.enum(EVENT_VALUES),
    delay_hours: z.number().int().nonnegative().optional(),
  }),
  z.object({
    type: z.literal('schedule'),
    at: z.string().describe('ISO 8601 timestamp or cron expression.'),
  }),
  z.object({ type: z.literal('manual') }),
]);

export function buildNomiTools({ restaurantId, avgTicket, supabase }: NomiToolDeps) {
  return {
    queryCustomers: tool({
      description:
        'Count and sample guests from the CDP by filter (segment, tier, min visits, recency). Returns count + sample + averages. Use to verify audience size before designing a campaign.',
      inputSchema: z.object({
        segment: z.enum(SEGMENT_VALUES).optional(),
        tier: z.enum(TIER_VALUES).optional(),
        min_total_visits: z.number().int().nonnegative().optional(),
        not_visited_in_last_days: z.number().int().positive().optional(),
        visited_in_last_days: z.number().int().positive().optional(),
        limit: z.number().int().positive().max(20).optional(),
      }),
      execute: async (args): Promise<QueryCustomersResult> => {
        const profiles = await loadProfiles(supabase, restaurantId);
        const filter: AudienceFilter = {
          segments: args.segment ? [args.segment] : undefined,
          tiers: args.tier ? [args.tier] : undefined,
          min_total_visits: args.min_total_visits,
          not_visited_in_last_days: args.not_visited_in_last_days,
          visited_in_last_days: args.visited_in_last_days,
        };
        const matched = filterProfiles(profiles, filter);
        const sample = matched.slice(0, args.limit ?? 5).map((p) => ({
          id: p.guest?.id ?? p.guest_id,
          name: p.guest?.name ?? 'Sin nombre',
          phone: p.guest?.phone ?? null,
          email: p.guest?.email ?? null,
          last_visit_at: p.last_visit_at,
        }));
        return {
          count: matched.length,
          sample,
          avg_visits: Number(avg(matched.map((p) => p.total_visits ?? 0)).toFixed(1)),
          avg_spent: Math.round(avg(matched.map((p) => p.total_spent ?? 0))),
        };
      },
    }),

    getSegmentMetrics: tool({
      description:
        'Returns the distribution of guests by segment (lead/new/active/at_risk/dormant/vip) with count, percentage and estimated revenue at stake. Use for diagnostics and prioritization before designing a workflow.',
      inputSchema: z.object({
        segment: z.enum(SEGMENT_VALUES).optional(),
      }),
      execute: async (args): Promise<{ rows: SegmentMetricRow[] }> => {
        const profiles = await loadProfiles(supabase, restaurantId);
        const total = profiles.length || 1;
        const segments: Segment[] = args.segment
          ? [args.segment]
          : ['vip', 'active', 'new', 'at_risk', 'dormant', 'lead'];
        const rows: SegmentMetricRow[] = segments.map((s) => {
          const count = profiles.filter((p) => p.segment === s).length;
          return {
            segment: s,
            count,
            percentage: Number((count / total).toFixed(3)),
            revenue_at_stake: revenueAtStakeFor(profiles, s, avgTicket),
          };
        });
        return { rows };
      },
    }),

    getCampaignResults: tool({
      description:
        'Returns KPIs for a specific campaign (by id) or the aggregated summary of all active campaigns. Use to answer "how is my X campaign doing?".',
      inputSchema: z.object({
        campaign_id: z.string().optional(),
      }),
      execute: async (args): Promise<{ campaigns: CampaignResultsSummary[] }> => {
        let query = supabase
          .from('campaigns')
          .select('*')
          .eq('restaurant_id', restaurantId);
        if (args.campaign_id) query = query.eq('id', args.campaign_id);
        else query = query.in('status', ['active', 'completed']);
        const { data, error } = await query;
        if (error) throw error;
        const campaigns = (data ?? []).map((c: Record<string, unknown>) => {
          const rawMetrics = (c.metrics as CampaignMetrics | null) ?? emptyMetrics();
          const metrics = computeRates(rawMetrics);
          return {
            id: String(c.id),
            name: String(c.name),
            status: String(c.status),
            sent: metrics.sent,
            delivered: metrics.delivered,
            read: metrics.read,
            responded: metrics.responded,
            converted: metrics.converted,
            revenue_attributed: metrics.revenue_attributed,
            response_rate: metrics.response_rate,
            conversion_rate: metrics.conversion_rate,
          } satisfies CampaignResultsSummary;
        });
        return { campaigns };
      },
    }),

    listTemplates: tool({
      description:
        'List the 5 canonical campaign templates with their defaults. These are REFERENCE/INSPIRATION only — you are NOT required to pick one. Prefer designing a tailored workflow via designCampaign.',
      inputSchema: z.object({}),
      execute: async () => {
        return {
          templates: TEMPLATE_ORDER.map((key) => {
            const t = TEMPLATES[key];
            return {
              key,
              name: t.name,
              description: t.description,
              headline: t.headline,
              default_audience: describeAudience(t.default_audience),
              trigger_kind: t.default_trigger.type,
              kpi_labels: t.kpi_labels.map((k) => k.label),
              workflow_step_count: t.workflow.length,
            };
          }),
        };
      },
    }),

    detectOpportunities: tool({
      description:
        'Run the opportunity detector over the current CDP. Returns top opportunities ranked by revenue potential, each with reasoning, target segment and recommended template key (as hint, not obligation).',
      inputSchema: z.object({}),
      execute: async (): Promise<{ opportunities: Opportunity[] }> => {
        const profiles = await loadProfiles(supabase, restaurantId);
        return { opportunities: detectOpportunities(profiles, avgTicket) };
      },
    }),

    estimateAudienceSize: tool({
      description:
        'Estimate how many guests match a specific audience filter. Use to confirm size before drafting a campaign.',
      inputSchema: z.object({
        segments: z.array(z.enum(SEGMENT_VALUES)).optional(),
        tiers: z.array(z.enum(TIER_VALUES)).optional(),
        min_total_visits: z.number().int().nonnegative().optional(),
        not_visited_in_last_days: z.number().int().positive().optional(),
        visited_in_last_days: z.number().int().positive().optional(),
      }),
      execute: async (args) => {
        const profiles = await loadProfiles(supabase, restaurantId);
        const filter: AudienceFilter = { ...args };
        const matched = filterProfiles(profiles, filter);
        return {
          count: matched.length,
          described: describeAudience(filter),
        };
      },
    }),

    designCampaign: tool({
      description: `Design a complete, BESPOKE campaign for the guest segment at hand — name, editorial goal line, audience filter, trigger, full workflow (send_message / wait / branch / end steps), proposed KPIs, reasoning, and revenue estimate. This is the primary creative tool.

CRITICAL RULES:
- Before calling this, you MUST have called queryCustomers or getSegmentMetrics for the target segment so the design is grounded in real numbers.
- DO NOT copy the 5 canonical templates. They are reference only. Design workflows that are LONGER and more specific when the situation warrants — feel free to use 5–10+ steps with multiple waits and branches.
- Each send_message step SHOULD include a content_brief: a one-line creative hook for that specific message (e.g. "warm opener mentioning their preferred Thursday dinners, no discount").
- Workflows must be well-formed: every "next" references a real step id, every branch has ≥2 targets, at least one end step, every path eventually reaches an end. Reuse step ids only when you deliberately want a loop back (don't).
- Channels: whatsapp is default. Use whatsapp_then_email when WhatsApp may fail (cold dormant guests). Use email alone for final gentle attempts.
- Waits: first contact usually 0h or single-digit hours from trigger. Between a send and the next branch, wait 48–120h so guests can reply. Final reactivation attempts can wait 5–7 days.
- Branches on message_response usually have 3 arms: positive / negative / no_response.
- propose KPIs that match the campaign intent (reactivation_rate, second_visit_rate, feedback_nps, etc.) — not generic ones.

Return a plan the operator can approve with one click. NEVER persist anything.`,
      inputSchema: z.object({
        name: z
          .string()
          .min(3)
          .max(60)
          .describe('Short editorial campaign name (not a template key).'),
        goal: z
          .string()
          .min(8)
          .max(140)
          .describe('One-line goal: what success looks like for this campaign.'),
        reasoning: z
          .string()
          .min(12)
          .max(500)
          .describe(
            'Why this design is right for THIS audience right now. Cite numbers from the tools you called.'
          ),
        audience: audienceSchema.describe('The exact audience filter to use at runtime.'),
        trigger: triggerSchema.describe(
          'How the campaign starts. Use event for automation, schedule for one-shot, manual if the operator triggers it.'
        ),
        workflow: z
          .array(workflowStepSchema)
          .min(3)
          .max(16)
          .describe(
            'Ordered list of steps. First step is the entry point. Must be well-formed: all next/branch ids resolve, at least one end, every path reaches an end.'
          ),
        kpi_labels: z
          .array(
            z.object({
              label: z.string().min(2).max(40),
              key: z.string().min(2).max(40),
            })
          )
          .min(2)
          .max(5)
          .describe('2–5 KPIs that measure success for this specific campaign.'),
        estimated_revenue: z
          .number()
          .int()
          .nonnegative()
          .describe(
            'Conservative revenue estimate in the restaurant currency (integer, no decimals). Base it on audience size × avg ticket × realistic conversion rate.'
          ),
      }),
      execute: async (args): Promise<{ draft: CampaignDraft }> => {
        const workflow = args.workflow as unknown as WorkflowStep[];
        const validation = validateWorkflow(workflow);
        if (!validation.ok) {
          throw new Error(
            `Invalid workflow: ${validation.errors.join('; ')}. Fix the graph and call designCampaign again.`
          );
        }

        const audience: AudienceFilter = { ...args.audience };
        const profiles = await loadProfiles(supabase, restaurantId);
        const matched = filterProfiles(profiles, audience);

        const type = args.trigger.type === 'schedule' ? 'one_shot' : 'automation';

        const draft: CampaignDraft = {
          restaurant_id: restaurantId,
          template_key: null,
          type,
          name: args.name,
          description: args.goal,
          status: 'draft',
          audience_filter: audience,
          trigger: args.trigger as CampaignTrigger,
          workflow,
          channels: deriveChannels(workflow),
          estimated_revenue: args.estimated_revenue,
          started_at: null,
          completed_at: null,
          reasoning: args.reasoning,
          described_audience:
            describeAudience(audience) || `${matched.length} guests`,
          source: 'nomi',
          goal: args.goal,
          kpi_labels: args.kpi_labels,
        };
        return { draft };
      },
    }),
  } as const;
}

export function formatSegmentsList(segs: Segment[]): string {
  return segs.map((s) => SEGMENT_LABEL[s]).join(' · ');
}
