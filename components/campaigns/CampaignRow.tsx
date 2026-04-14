'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { SEGMENT_HEX, formatARS } from '@/lib/constants';
import { describeAudience } from '@/lib/audience';
import { CampaignStatusBadge } from './CampaignStatusBadge';
import { Numeral } from '@/components/ui/Numeral';
import type { Campaign } from '@/lib/types';
import { TEMPLATES } from '@/lib/templates';

export function CampaignRow({ campaign, index = 0 }: { campaign: Campaign; index?: number }) {
  const tpl = campaign.template_key ? TEMPLATES[campaign.template_key] : null;
  const accent = tpl?.accent ?? 'active';
  const hex = SEGMENT_HEX[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.06 * index, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/campaigns/${campaign.id}` as const}
        className="group relative block border-b border-hairline transition-colors duration-200 hover:bg-bg-raised"
      >
        <span
          className="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-200 group-hover:w-[6px]"
          style={{ backgroundColor: hex }}
          aria-hidden
        />

        <div className="grid grid-cols-[minmax(0,1.8fr)_100px_90px_100px_140px_auto] items-center gap-6 pl-8 pr-6 py-7">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-1.5">
              <CampaignStatusBadge status={campaign.status} animated />
              <span className="text-[10px] uppercase tracking-label text-fg-subtle">
                {campaign.type === 'automation' ? 'Automación' : 'Campaña puntual'}
              </span>
            </div>
            <h3
              className="font-display text-2xl leading-tight text-fg truncate"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}
            >
              {campaign.name}
            </h3>
            <p
              className="mt-1 font-display italic text-[13px] text-fg-muted leading-snug max-w-[62ch] truncate"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {describeAudience(campaign.audience_filter)}
            </p>
          </div>

          <div className="text-right">
            <div className="font-mono text-xl text-fg tabular-nums">
              <Numeral value={campaign.metrics.sent} />
            </div>
            <div className="text-[10px] uppercase tracking-label text-fg-subtle">enviados</div>
          </div>

          <div className="text-right">
            <div className="font-mono text-xl text-fg tabular-nums">
              {(campaign.metrics.response_rate * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] uppercase tracking-label text-fg-subtle">respuesta</div>
          </div>

          <div className="text-right">
            <div className="font-mono text-xl text-fg tabular-nums">
              {(campaign.metrics.conversion_rate * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] uppercase tracking-label text-fg-subtle">conversión</div>
          </div>

          <div className="text-right">
            <div className="font-mono text-xl text-accent tabular-nums">
              {formatARS(campaign.metrics.revenue_attributed)}
            </div>
            <div className="text-[10px] uppercase tracking-label text-fg-subtle">revenue</div>
          </div>

          <div className="text-right">
            <span className="text-[11px] uppercase tracking-[0.12em] text-fg-muted group-hover:text-accent transition-colors">
              Abrir &nbsp;→
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
