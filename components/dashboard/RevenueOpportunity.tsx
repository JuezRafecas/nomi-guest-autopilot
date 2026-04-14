'use client';

import { motion } from 'framer-motion';
import { Numeral } from '@/components/ui/Numeral';

export function RevenueOpportunity({
  totalAtStake,
  dormantCount,
  avgTicket,
}: {
  totalAtStake: number;
  dormantCount: number;
  avgTicket: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="relative py-16 md:py-24"
      style={{
        borderTop: '2px solid var(--fg)',
        borderBottom: '2px solid var(--fg)',
        background: 'var(--bg)',
      }}
    >
      <div className="editorial-container grid grid-cols-1 md:grid-cols-[auto_1fr] gap-12 items-end">
        <div>
          <div
            className="mb-4 text-[10.5px] uppercase font-[600]"
            style={{
              letterSpacing: '0.18em',
              color: 'var(--k-green, #0e5e48)',
              fontFamily: 'var(--font-kaszek-sans), Inter, system-ui, sans-serif',
            }}
          >
            Plata esperando
          </div>
          <div
            className="k-digit-outlined tabular-nums"
            style={{ fontSize: 'clamp(3.5rem, 9vw, 7.5rem)' }}
          >
            <Numeral value={totalAtStake} animated format="ars" />
          </div>
        </div>

        <div className="flex flex-col gap-8 pb-4 max-w-[48ch]">
          <p
            className="k-italic-serif leading-snug"
            style={{
              fontSize: 'clamp(1.15rem, 1.55vw, 1.5rem)',
              color: 'var(--fg-muted)',
            }}
          >
            recuperable en los próximos 90 días si se acciona sobre los{' '}
            <span style={{ color: 'var(--fg)', fontStyle: 'normal', fontWeight: 600 }}>
              {dormantCount}
            </span>{' '}
            comensales que dejaron de venir. Ticket promedio{' '}
            <span
              className="font-mono"
              style={{ fontStyle: 'normal', fontSize: '0.8em', color: 'var(--fg)' }}
            >
              ${(avgTicket / 1000).toFixed(0)}K
            </span>
            .
          </p>

          <button
            type="button"
            className="k-btn k-btn--primary inline-flex items-center gap-3 self-start"
            style={{
              border: '2px solid var(--fg)',
              height: 48,
              padding: '0 24px',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              background: 'var(--accent)',
              color: 'var(--bg)',
              fontFamily: 'var(--font-kaszek-sans), Inter, system-ui, sans-serif',
            }}
          >
            Activar reactivación
            <span>→</span>
          </button>
        </div>
      </div>
    </motion.section>
  );
}
