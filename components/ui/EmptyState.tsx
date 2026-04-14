import Link from 'next/link';

interface Props {
  title: string;
  hint: string;
  cta?: { label: string; href: string };
  icon?: React.ReactNode;
}

/**
 * Editorial empty state — italic display title + muted hint + optional CTA.
 * Matches the section-level rhythm so lists never show "nothing" without context.
 */
export function EmptyState({ title, hint, cta, icon }: Props) {
  return (
    <div className="px-8 py-20 text-center flex flex-col items-center">
      {icon ? (
        <div className="mb-5 opacity-60" aria-hidden>
          {icon}
        </div>
      ) : (
        <div
          aria-hidden
          className="mb-5 w-10 h-10 relative"
          style={{
            background: 'var(--bg-sunken)',
            border: '1px solid var(--hairline-strong)',
          }}
        >
          <span
            className="absolute inset-0 flex items-center justify-center text-[14px]"
            style={{ color: 'var(--fg-subtle)' }}
          >
            ∅
          </span>
        </div>
      )}
      <div
        className="font-display text-[28px] md:text-[32px] text-fg leading-tight mb-2"
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}
      >
        <span className="italic">{title}</span>
      </div>
      <p
        className="k-italic-serif text-fg-muted leading-snug max-w-[48ch]"
        style={{ fontSize: '15px' }}
      >
        {hint}
      </p>
      {cta && (
        <Link
          href={cta.href as '/dashboard'}
          className="mt-6 inline-flex items-center gap-2 text-[10.5px] uppercase font-[600] px-4 py-2.5 transition-colors k-outline-cta"
          style={{
            letterSpacing: '0.16em',
            border: '1px solid var(--fg)',
            color: 'var(--fg)',
            fontFamily: 'var(--font-kaszek-sans), Inter, system-ui, sans-serif',
          }}
        >
          {cta.label}
          <span>→</span>
        </Link>
      )}
    </div>
  );
}
