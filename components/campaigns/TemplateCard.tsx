'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/Label';
import { SEGMENT_HEX } from '@/lib/constants';
import type { CampaignTemplate } from '@/lib/types';

const TYPE_LABEL = {
  automation: 'Automación',
  one_shot: 'Puntual',
} as const;

export function TemplateCard({
  template,
  index = 0,
}: {
  template: CampaignTemplate;
  index?: number;
}) {
  const hex = SEGMENT_HEX[template.accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.06 * index, ease: [0.16, 1, 0.3, 1] }}
      className="group relative border border-hairline bg-bg-raised hover:bg-bg-elevated transition-colors duration-200 flex flex-col"
    >
      {/* Accent bar */}
      <span
        className="absolute top-0 left-0 right-0 h-[3px] transition-all duration-200 group-hover:h-[6px]"
        style={{ backgroundColor: hex }}
        aria-hidden
      />

      <div className="p-8 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <Label>{TYPE_LABEL[template.type]}</Label>
          <span className="text-[10px] uppercase tracking-label" style={{ color: hex }}>
            {template.accent.replace('_', ' ')}
          </span>
        </div>

        <h3
          className="font-display text-[26px] leading-tight text-fg mb-3"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}
        >
          {template.name}
        </h3>

        <p
          className="font-display italic text-[15px] text-fg-muted leading-snug mb-6"
          style={{ fontVariationSettings: '"opsz" 14, "SOFT" 100' }}
        >
          {template.description}
        </p>

        <div className="mt-auto pt-6 border-t border-hairline">
          <Label className="mb-3">KPIs que optimiza</Label>
          <ul className="space-y-1">
            {template.kpi_labels.map((kpi) => (
              <li
                key={kpi.key}
                className="flex items-center gap-2 text-[12px] text-fg-muted font-mono"
              >
                <span
                  className="h-[2px] w-3"
                  style={{ backgroundColor: hex }}
                  aria-hidden
                />
                {kpi.label}
              </li>
            ))}
          </ul>
        </div>

        <Link
          href={`/campaigns/new?template=${template.key}` as const}
          className="mt-8 inline-flex items-center justify-between border border-hairline px-4 py-3 hover:border-accent hover:text-accent transition-colors duration-150 text-[11px] uppercase tracking-[0.12em]"
        >
          Usar plantilla
          <span>→</span>
        </Link>
      </div>
    </motion.div>
  );
}
