export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-baseline gap-[3px] ${className ?? ''}`}>
      <span
        className="k-italic-serif text-[20px] leading-none"
        style={{ color: 'var(--fg)', letterSpacing: '-0.03em' }}
      >
        Revenue
      </span>
      <span
        className="text-[20px] leading-none font-[800]"
        style={{
          fontFamily: 'var(--font-kaszek-display), "Archivo Black", system-ui, sans-serif',
          color: 'var(--accent)',
          letterSpacing: '-0.04em',
        }}
      >
        Autopilot
      </span>
      <span
        aria-hidden
        className="inline-block"
        style={{
          width: 6,
          height: 6,
          backgroundColor: 'var(--k-green, #0e5e48)',
          transform: 'translateY(-2px)',
        }}
      />
    </div>
  );
}
