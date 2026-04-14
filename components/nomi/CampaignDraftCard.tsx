'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CampaignDraft } from '@/lib/agent/types';
import type { WorkflowStep, Channel } from '@/lib/types';

interface CampaignDraftCardProps {
  draft: CampaignDraft;
  currency?: string;
}

const CHANNEL_LABEL: Record<Channel, string> = {
  whatsapp: 'WhatsApp',
  email: 'Email',
  whatsapp_then_email: 'WhatsApp → Email',
  call: 'Voice call',
};

export function CampaignDraftCard({ draft, currency = 'ARS' }: CampaignDraftCardProps) {
  const [state, setState] = useState<'idle' | 'creating' | 'created' | 'error' | 'dismissed'>(
    'idle'
  );
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleApprove = async () => {
    setState('creating');
    setError(null);
    try {
      const res = await fetch('/api/agent/campaigns/approve', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ draft }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const { campaign } = (await res.json()) as { campaign: { id: string } };
      setState('created');
      router.push(`/campaigns/${campaign.id}`);
    } catch (e) {
      setState('error');
      setError(e instanceof Error ? e.message : 'Unknown error.');
    }
  };

  if (state === 'dismissed') {
    return (
      <div
        className="k-mono my-3 py-2 text-[10px] uppercase"
        style={{ letterSpacing: '0.14em', color: 'var(--fg-subtle)' }}
      >
        · draft dismissed ·
      </div>
    );
  }

  const trigger = formatTrigger(draft.trigger);
  const money = draft.estimated_revenue
    ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
        draft.estimated_revenue
      )
    : '—';
  const metaLine = [
    `${draft.described_audience || 'entire base'}`,
    trigger,
    draft.channels.map((c) => CHANNEL_LABEL[c]).join(' + '),
  ].join(' · ');

  const titlesById = new Map<string, string>();
  draft.workflow.forEach((s) => titlesById.set(s.id, deriveStepTitle(s)));

  return (
    <section
      aria-labelledby={`draft-${draft.name}`}
      className="my-5"
      style={{
        borderTop: '1.5px solid var(--fg)',
        borderBottom: '1.5px solid var(--fg)',
        background: 'var(--bg-raised)',
      }}
    >
      <header
        className="flex items-center justify-between px-6 pt-5 pb-3"
        style={{ borderBottom: '1px solid var(--hairline)' }}
      >
        <div className="k-label" style={{ color: 'var(--k-green)' }}>
          Nomi · campaign design
        </div>
        <div
          className="k-mono text-[10px] uppercase"
          style={{ letterSpacing: '0.14em', color: 'var(--fg-subtle)' }}
        >
          {draft.type === 'one_shot' ? 'one shot' : 'automation'} ·{' '}
          {draft.workflow.length} steps
        </div>
      </header>

      <div className="px-6 pt-5 pb-3">
        <h3
          id={`draft-${draft.name}`}
          className="leading-[1.05] mb-2"
          style={{
            fontFamily:
              'var(--font-kaszek-display), "Archivo Black", system-ui, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(1.35rem, 1.9vw, 1.65rem)',
            letterSpacing: '-0.028em',
            color: 'var(--fg)',
          }}
        >
          {draft.name}
        </h3>
        {draft.goal && (
          <p
            className="k-italic-serif"
            style={{
              fontSize: 15,
              lineHeight: 1.45,
              color: 'var(--fg-muted)',
              maxWidth: '58ch',
            }}
          >
            {draft.goal}
          </p>
        )}
      </div>

      {draft.reasoning && (
        <div
          className="px-6 py-3"
          style={{ borderTop: '1px solid var(--hairline)' }}
        >
          <div
            className="k-label mb-1"
            style={{ color: 'var(--fg-subtle)', fontSize: 10 }}
          >
            Why this, why now
          </div>
          <p
            className="k-italic-serif"
            style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--fg-muted)' }}
          >
            {draft.reasoning}
          </p>
        </div>
      )}

      <div
        className="px-6 py-3 k-mono"
        style={{
          borderTop: '1px solid var(--hairline)',
          fontSize: 11,
          letterSpacing: '0.04em',
          color: 'var(--fg-muted)',
          lineHeight: 1.5,
        }}
      >
        {metaLine}
      </div>

      <div
        className="px-6 pt-4 pb-5"
        style={{ borderTop: '1px solid var(--hairline)' }}
      >
        <div
          className="k-label mb-3"
          style={{ color: 'var(--fg-subtle)', fontSize: 10 }}
        >
          Workflow
        </div>
        <ol className="flex flex-col gap-3" style={{ counterReset: 'step' }}>
          {draft.workflow.map((step, idx) => (
            <WorkflowLine
              key={step.id}
              step={step}
              index={idx + 1}
              titlesById={titlesById}
            />
          ))}
        </ol>
      </div>

      {draft.kpi_labels && draft.kpi_labels.length > 0 && (
        <div
          className="px-6 py-4 flex flex-wrap gap-2"
          style={{ borderTop: '1px solid var(--hairline)' }}
        >
          <div
            className="k-label w-full mb-1"
            style={{ color: 'var(--fg-subtle)', fontSize: 10 }}
          >
            Measured by
          </div>
          {draft.kpi_labels.map((k) => (
            <span
              key={k.key}
              className="k-mono inline-block"
              style={{
                fontSize: 10,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '4px 8px',
                border: '1px solid var(--hairline-strong)',
                color: 'var(--fg)',
                background: 'var(--bg)',
              }}
            >
              {k.label}
            </span>
          ))}
        </div>
      )}

      <div
        className="px-6 py-4 flex items-baseline justify-between"
        style={{ borderTop: '1px solid var(--hairline)' }}
      >
        <div
          className="k-label"
          style={{ color: 'var(--fg-subtle)', fontSize: 10 }}
        >
          Expected revenue
        </div>
        <div
          className="tabular-nums"
          style={{
            fontFamily:
              'var(--font-kaszek-display), "Archivo Black", system-ui, sans-serif',
            fontSize: 'clamp(1.4rem, 2vw, 1.8rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--k-green)',
          }}
        >
          {currency} {money}
        </div>
      </div>

      <footer
        className="px-6 py-5 flex items-center gap-4"
        style={{ borderTop: '1.5px solid var(--fg)' }}
      >
        <button
          type="button"
          onClick={handleApprove}
          disabled={state === 'creating' || state === 'created'}
          className="k-btn k-btn--primary px-5 py-3 inline-flex items-center gap-2"
          style={{
            background: 'var(--accent)',
            color: 'var(--k-cream)',
            fontFamily: 'var(--font-kaszek-sans), Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            border: '1.5px solid var(--k-ink)',
            opacity: state === 'creating' ? 0.75 : 1,
          }}
        >
          {state === 'creating'
            ? 'Creating · · ·'
            : state === 'created'
              ? 'Created'
              : 'Approve and create'}
          {state === 'idle' && <span aria-hidden>→</span>}
        </button>
        <button
          type="button"
          onClick={() => setState('dismissed')}
          disabled={state === 'creating'}
          className="k-mono text-[10px] uppercase underline decoration-dotted underline-offset-4"
          style={{
            letterSpacing: '0.14em',
            color: 'var(--fg-subtle)',
          }}
        >
          Dismiss
        </button>
        {error && (
          <div
            className="k-mono text-[10px] uppercase ml-auto"
            style={{ color: 'var(--accent-dim)', letterSpacing: '0.14em' }}
          >
            error · {error}
          </div>
        )}
      </footer>
    </section>
  );
}

function WorkflowLine({
  step,
  index,
  titlesById,
}: {
  step: WorkflowStep;
  index: number;
  titlesById: Map<string, string>;
}) {
  const indexLabel = String(index).padStart(2, '0');

  if (step.kind === 'send_message') {
    return (
      <li
        className="grid gap-3 items-baseline"
        style={{ gridTemplateColumns: '28px 90px 1fr' }}
      >
        <IndexCell>{indexLabel}</IndexCell>
        <KindCell>Send · {CHANNEL_LABEL[step.channel]}</KindCell>
        <div>
          <div
            style={{
              fontFamily:
                'var(--font-kaszek-sans), Inter, system-ui, sans-serif',
              fontSize: 14.5,
              fontWeight: 600,
              color: 'var(--fg)',
              lineHeight: 1.3,
              letterSpacing: '-0.005em',
            }}
          >
            {step.title ?? titlesById.get(step.id)}
          </div>
          {step.content_brief && (
            <div
              className="k-italic-serif mt-1"
              style={{
                fontSize: 13,
                lineHeight: 1.4,
                color: 'var(--fg-muted)',
              }}
            >
              “{step.content_brief}”
            </div>
          )}
        </div>
      </li>
    );
  }

  if (step.kind === 'wait') {
    return (
      <li
        className="grid gap-3 items-baseline"
        style={{ gridTemplateColumns: '28px 90px 1fr' }}
      >
        <IndexCell>{indexLabel}</IndexCell>
        <KindCell>Wait</KindCell>
        <div
          className="k-mono tabular-nums"
          style={{
            fontSize: 13,
            color: 'var(--fg)',
            letterSpacing: '0.02em',
          }}
        >
          {formatHours(step.hours)}
        </div>
      </li>
    );
  }

  if (step.kind === 'branch') {
    return (
      <li
        className="grid gap-3 items-baseline"
        style={{ gridTemplateColumns: '28px 90px 1fr' }}
      >
        <IndexCell>{indexLabel}</IndexCell>
        <KindCell>Decide</KindCell>
        <ul className="flex flex-col gap-1">
          {step.branches.map((br) => (
            <li
              key={br.matches}
              className="flex items-baseline gap-2"
              style={{
                fontFamily:
                  'var(--font-kaszek-sans), Inter, system-ui, sans-serif',
                fontSize: 13.5,
                color: 'var(--fg)',
              }}
            >
              <span
                className="k-mono"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--fg-subtle)',
                  minWidth: 68,
                }}
              >
                if {br.matches}
              </span>
              <span aria-hidden style={{ color: 'var(--fg-subtle)' }}>
                →
              </span>
              <span>{titlesById.get(br.next) ?? br.next}</span>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  if (step.kind === 'end') {
    return (
      <li
        className="grid gap-3 items-baseline"
        style={{ gridTemplateColumns: '28px 90px 1fr' }}
      >
        <IndexCell>{indexLabel}</IndexCell>
        <KindCell>End</KindCell>
        <div
          className="k-mono"
          style={{
            fontSize: 11,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color:
              step.outcome === 'escalated'
                ? 'var(--accent)'
                : 'var(--fg-muted)',
          }}
        >
          {step.outcome === 'escalated' ? '✕ route to team' : '✓ completed'}
        </div>
      </li>
    );
  }

  if (step.kind === 'make_call') {
    return (
      <li
        className="grid gap-3 items-baseline"
        style={{ gridTemplateColumns: '28px 90px 1fr' }}
      >
        <IndexCell>{indexLabel}</IndexCell>
        <KindCell>Call</KindCell>
        <div
          style={{
            fontFamily:
              'var(--font-kaszek-sans), Inter, system-ui, sans-serif',
            fontSize: 14.5,
            fontWeight: 600,
            color: 'var(--fg)',
          }}
        >
          Voice call
        </div>
      </li>
    );
  }

  return null;
}

function IndexCell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="k-mono tabular-nums"
      style={{
        fontSize: 11,
        letterSpacing: '0.08em',
        color: 'var(--fg-subtle)',
      }}
    >
      {children}
    </div>
  );
}

function KindCell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="k-mono"
      style={{
        fontSize: 10,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--k-green)',
        paddingTop: 2,
      }}
    >
      {children}
    </div>
  );
}

function deriveStepTitle(step: WorkflowStep): string {
  if (step.kind === 'send_message') {
    if (step.title) return step.title;
    return humanize(step.id);
  }
  if (step.kind === 'wait') return `Wait ${formatHours(step.hours)}`;
  if (step.kind === 'branch') return 'Decide';
  if (step.kind === 'end')
    return step.outcome === 'escalated' ? 'Route to team' : 'End';
  if (step.kind === 'make_call') return 'Voice call';
  return '';
}

function humanize(id: string): string {
  return id
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function formatHours(h: number): string {
  if (h < 1) return `${Math.round(h * 60)}m`;
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  return `${d} ${d === 1 ? 'day' : 'days'}`;
}

function formatTrigger(trigger: CampaignDraft['trigger']): string {
  if (trigger.type === 'manual') return 'manual · one shot';
  if (trigger.type === 'schedule') return `schedule · ${trigger.at}`;
  return `event · ${trigger.event}${
    trigger.delay_hours ? ` · +${trigger.delay_hours}h` : ''
  }`;
}
