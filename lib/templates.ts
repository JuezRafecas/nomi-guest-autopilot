import type { CampaignTemplate, TemplateKey } from './types';

/**
 * The five canonical templates that define the product.
 * Each one is a complete campaign recipe: audience, trigger, workflow, KPIs.
 *
 * These are the entry points for any new campaign — the user never starts
 * from scratch. "Approve, don't configure."
 */

export const TEMPLATES: Record<TemplateKey, CampaignTemplate> = {
  post_visit_smart: {
    key: 'post_visit_smart',
    type: 'automation',
    name: 'Post-visita inteligente',
    description:
      'Después de cada visita, agradecé, pedí feedback y si fue positiva, invitá a dejar una reseña en Google.',
    headline: 'Cada visita, una oportunidad de review.',
    accent: 'active',
    default_audience: {
      segments: ['active', 'vip', 'new'],
      visited_in_last_days: 7,
      requires_opt_in: 'whatsapp',
    },
    default_trigger: {
      type: 'event',
      event: 'visit_completed',
      delay_hours: 24,
    },
    workflow: [
      {
        id: 'send_thanks',
        kind: 'send_message',
        channel: 'whatsapp_then_email',
        template_id: 'post_visita_gracias_v2',
        prompt_key: 'post_visit',
        fallback: { retry_after_hours: 1, retry_channel: 'email', max_retries: 1 },
        next: 'await_response',
      },
      {
        id: 'await_response',
        kind: 'wait',
        hours: 48,
        next: 'branch_response',
      },
      {
        id: 'branch_response',
        kind: 'branch',
        condition: 'message_response',
        branches: [
          { label: 'Positiva', matches: 'positive', next: 'request_review' },
          { label: 'Negativa', matches: 'negative', next: 'escalate' },
          { label: 'Sin respuesta', matches: 'no_response', next: 'gentle_reminder' },
        ],
      },
      {
        id: 'request_review',
        kind: 'send_message',
        channel: 'whatsapp',
        template_id: 'post_visita_review_v1',
        prompt_key: 'post_visit',
        next: 'end_positive',
      },
      {
        id: 'escalate',
        kind: 'end',
        outcome: 'escalated',
      },
      {
        id: 'gentle_reminder',
        kind: 'send_message',
        channel: 'whatsapp',
        template_id: 'post_visita_recordatorio_v1',
        prompt_key: 'post_visit',
        next: 'end_reminder',
      },
      { id: 'end_positive', kind: 'end', outcome: 'completed' },
      { id: 'end_reminder', kind: 'end', outcome: 'completed' },
    ],
    kpi_labels: [
      { label: 'Reseñas generadas', key: 'reviews_generated' },
      { label: 'Tasa de retorno', key: 'return_rate' },
      { label: 'Ingreso atribuido', key: 'revenue_attributed' },
    ],
  },

  first_to_second_visit: {
    key: 'first_to_second_visit',
    type: 'automation',
    name: 'Primera → Segunda visita',
    description:
      'Cuando un cliente visita por primera vez, enviá un mensaje personalizado invitándolo a volver.',
    headline: 'La segunda visita es la que importa.',
    accent: 'new',
    default_audience: {
      segments: ['new'],
      requires_opt_in: 'whatsapp',
    },
    default_trigger: {
      type: 'event',
      event: 'visit_completed',
      delay_hours: 72,
    },
    workflow: [
      {
        id: 'send_invite',
        kind: 'send_message',
        channel: 'whatsapp_then_email',
        template_id: 'second_visit_invite_v1',
        prompt_key: 'second_visit',
        fallback: { retry_after_hours: 24, retry_channel: 'email', max_retries: 1 },
        next: 'await_visit',
      },
      { id: 'await_visit', kind: 'wait', hours: 24 * 14, next: 'end' },
      { id: 'end', kind: 'end', outcome: 'completed' },
    ],
    kpi_labels: [
      { label: 'Tasa de segunda visita', key: 'second_visit_rate' },
      { label: 'Días a segunda visita', key: 'days_to_second_visit' },
    ],
  },

  reactivate_inactive: {
    key: 'reactivate_inactive',
    type: 'automation',
    name: 'Recuperar clientes inactivos',
    description:
      'Contactá a clientes que hace tiempo no visitan con un mensaje de "te extrañamos" y una invitación personalizada.',
    headline: 'La plata que se está yendo por la puerta.',
    accent: 'dormant',
    default_audience: {
      segments: ['dormant', 'at_risk'],
      not_visited_in_last_days: 60,
      min_total_visits: 2,
      requires_opt_in: 'whatsapp',
    },
    default_trigger: {
      type: 'event',
      event: 'no_visit_threshold_reached',
    },
    workflow: [
      {
        id: 'send_reactivation',
        kind: 'send_message',
        channel: 'whatsapp_then_email',
        template_id: 'reactivation_v3',
        prompt_key: 'reactivation',
        fallback: { retry_after_hours: 2, retry_channel: 'email', max_retries: 1 },
        next: 'await_response',
      },
      { id: 'await_response', kind: 'wait', hours: 120, next: 'branch_response' },
      {
        id: 'branch_response',
        kind: 'branch',
        condition: 'message_response',
        branches: [
          { label: 'Positiva', matches: 'positive', next: 'end_positive' },
          { label: 'Sin respuesta', matches: 'no_response', next: 'final_attempt' },
          { label: 'Negativa', matches: 'negative', next: 'end_negative' },
        ],
      },
      {
        id: 'final_attempt',
        kind: 'send_message',
        channel: 'email',
        template_id: 'reactivation_final_v1',
        prompt_key: 'reactivation',
        next: 'end_no_response',
      },
      { id: 'end_positive', kind: 'end', outcome: 'completed' },
      { id: 'end_negative', kind: 'end', outcome: 'completed' },
      { id: 'end_no_response', kind: 'end', outcome: 'completed' },
    ],
    kpi_labels: [
      { label: 'Tasa de reactivación', key: 'reactivation_rate' },
      { label: 'Ingreso recuperado', key: 'revenue_recovered' },
    ],
  },

  promote_event: {
    key: 'promote_event',
    type: 'one_shot',
    name: 'Promover evento',
    description:
      'Invitá a tus clientes a una experiencia especial — cena con chef invitado, menú degustación, fechas especiales.',
    headline: 'Noches que se cuentan después.',
    accent: 'vip',
    default_audience: {
      tiers: ['vip', 'frequent'],
      visited_in_last_days: 180,
      requires_opt_in: 'whatsapp',
    },
    default_trigger: {
      type: 'schedule',
      at: '2026-04-20T10:00:00-03:00',
    },
    workflow: [
      {
        id: 'send_vip_invite',
        kind: 'send_message',
        channel: 'whatsapp_then_email',
        template_id: 'event_invite_vip_v1',
        prompt_key: 'promote_event',
        next: 'wait_for_rsvps',
      },
      { id: 'wait_for_rsvps', kind: 'wait', hours: 72, next: 'branch_fill' },
      {
        id: 'branch_fill',
        kind: 'branch',
        condition: 'custom',
        branches: [
          { label: 'Cupos llenos', matches: 'event_full', next: 'end_full' },
          { label: 'Sigue abierto', matches: 'event_open', next: 'send_frequent_invite' },
        ],
      },
      {
        id: 'send_frequent_invite',
        kind: 'send_message',
        channel: 'whatsapp',
        template_id: 'event_invite_frequent_v1',
        prompt_key: 'promote_event',
        next: 'end_expanded',
      },
      { id: 'end_full', kind: 'end', outcome: 'completed' },
      { id: 'end_expanded', kind: 'end', outcome: 'completed' },
    ],
    kpi_labels: [
      { label: 'Reservas generadas', key: 'reservations_generated' },
      { label: 'Ocupación del evento', key: 'event_occupancy' },
    ],
  },

  fill_empty_tables: {
    key: 'fill_empty_tables',
    type: 'automation',
    name: 'Llenar mesas vacías',
    description:
      'Detecta automáticamente días con baja ocupación y contacta a los clientes con mayor afinidad a ese día y horario.',
    headline: 'Mesas vacías ya no deberían existir.',
    accent: 'at_risk',
    default_audience: {
      segments: ['active', 'at_risk'],
      visited_in_last_days: 90,
      requires_opt_in: 'whatsapp',
    },
    default_trigger: {
      type: 'event',
      event: 'low_occupancy_detected',
    },
    workflow: [
      {
        id: 'send_invite',
        kind: 'send_message',
        channel: 'whatsapp',
        template_id: 'fill_tables_v2',
        prompt_key: 'fill_tables',
        next: 'await_response',
      },
      { id: 'await_response', kind: 'wait', hours: 12, next: 'end' },
      { id: 'end', kind: 'end', outcome: 'completed' },
    ],
    kpi_labels: [
      { label: 'Cubiertos incrementales', key: 'incremental_covers' },
      { label: 'Ingreso incremental del día', key: 'incremental_daily_revenue' },
    ],
  },
};

export const TEMPLATE_ORDER: TemplateKey[] = [
  'reactivate_inactive',
  'post_visit_smart',
  'first_to_second_visit',
  'fill_empty_tables',
  'promote_event',
];

export function getTemplate(key: TemplateKey): CampaignTemplate {
  return TEMPLATES[key];
}
