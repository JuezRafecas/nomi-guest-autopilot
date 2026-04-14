import { cn } from '@/lib/cn';
import { CAMPAIGN_STATUS_LABEL, CAMPAIGN_STATUS_TONE } from '@/lib/campaigns';
import type { CampaignStatus } from '@/lib/types';

const TONE: Record<'positive' | 'warning' | 'muted' | 'neutral', string> = {
  positive: 'text-segment-active',
  warning: 'text-segment-at_risk',
  neutral: 'text-segment-new',
  muted: 'text-fg-subtle',
};

const DOT_BG: Record<'positive' | 'warning' | 'muted' | 'neutral', string> = {
  positive: 'bg-segment-active',
  warning: 'bg-segment-at_risk',
  neutral: 'bg-segment-new',
  muted: 'bg-fg-subtle',
};

export function CampaignStatusBadge({
  status,
  className,
  animated = false,
}: {
  status: CampaignStatus;
  className?: string;
  animated?: boolean;
}) {
  const tone = CAMPAIGN_STATUS_TONE[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-[10px] uppercase tracking-label font-sans',
        TONE[tone],
        className
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          DOT_BG[tone],
          animated && tone === 'positive' && 'animate-pulse'
        )}
      />
      {CAMPAIGN_STATUS_LABEL[status]}
    </span>
  );
}
