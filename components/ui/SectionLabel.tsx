import { cn } from '@/lib/cn';

/**
 * The small green uppercase eyebrow used above every section heading.
 * Replaces the 6 inline divs that each re-declare the same tokens.
 */
export function SectionLabel({
  children,
  className,
  tone = 'green',
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  tone?: 'green' | 'accent' | 'subtle';
  as?: 'div' | 'span' | 'p';
}) {
  const color =
    tone === 'green'
      ? 'var(--k-green, #0e5e48)'
      : tone === 'accent'
        ? 'var(--accent-dim)'
        : 'var(--fg-subtle)';
  return (
    <Tag
      className={cn('text-[10.5px] uppercase font-[600]', className)}
      style={{
        letterSpacing: '0.18em',
        color,
        fontFamily: 'var(--font-kaszek-sans), Inter, system-ui, sans-serif',
      }}
    >
      {children}
    </Tag>
  );
}
