'use client';

import { motion } from 'framer-motion';
import { Numeral } from '@/components/ui/Numeral';

interface Props {
  score: number;
  activeCount: number;
  totalCount: number;
  diagnosis: string;
}

export function HealthScore({ score, activeCount, totalCount, diagnosis }: Props) {
  const circumference = 2 * Math.PI * 88;
  const offset = circumference - (score / 100) * circumference;
  const severity = score < 25 ? 'crítica' : score < 50 ? 'en riesgo' : 'estable';

  return (
    <section className="flex flex-col">
      <div
        className="mb-6 text-[10.5px] uppercase font-[600]"
        style={{
          letterSpacing: '0.18em',
          color: 'var(--k-green, #0e5e48)',
          fontFamily: 'var(--font-kaszek-sans), Inter, system-ui, sans-serif',
        }}
      >
        Diagnóstico · Salud de la base
      </div>

      <div className="relative flex items-start gap-6">
        <svg
          width="180"
          height="180"
          viewBox="0 0 200 200"
          className="shrink-0 -rotate-90"
          aria-hidden
        >
          <circle
            cx="100"
            cy="100"
            r="88"
            stroke="var(--hairline-strong)"
            strokeWidth="2"
            fill="none"
          />
          <motion.circle
            cx="100"
            cy="100"
            r="88"
            stroke="var(--accent)"
            strokeWidth="3"
            fill="none"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1], delay: 0.2 }}
            strokeLinecap="butt"
          />
        </svg>

        <div className="flex flex-col">
          <div className="flex items-start">
            <span
              className="tabular-nums"
              style={{
                fontFamily: 'var(--font-kaszek-display), "Archivo Black", system-ui, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(3.8rem, 7.6vw, 6rem)',
                letterSpacing: '-0.05em',
                color: 'var(--fg)',
                lineHeight: 0.85,
              }}
            >
              <Numeral value={score} animated decimals={1} />
            </span>
            <span
              className="ml-2 mt-2 font-[600]"
              style={{
                fontSize: '1.2rem',
                color: 'var(--fg-subtle)',
              }}
            >
              %
            </span>
          </div>
          <div
            className="mt-5 flex items-center gap-2 font-mono text-[11px]"
            style={{ color: 'var(--fg-muted)', letterSpacing: '0.06em' }}
          >
            <Numeral value={activeCount} />
            <span style={{ color: 'var(--fg-faint)' }}>/</span>
            <Numeral value={totalCount} />
            <span
              className="uppercase text-[10px] ml-1"
              style={{ letterSpacing: '0.16em', color: 'var(--fg-subtle)' }}
            >
              comensales activos
            </span>
          </div>
          <span
            className="k-event-pill mt-5 self-start"
            style={{ textTransform: 'uppercase' }}
          >
            Salud {severity}
          </span>
        </div>
      </div>

      <p
        className="mt-8 k-italic-serif leading-snug"
        style={{
          fontSize: 'clamp(1.05rem, 1.4vw, 1.3rem)',
          color: 'var(--fg-muted)',
          maxWidth: '28ch',
        }}
      >
        {diagnosis}
      </p>
    </section>
  );
}
