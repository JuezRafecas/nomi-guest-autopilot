export function ActivityTicker({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div
      className="py-3.5 overflow-hidden relative"
      style={{
        borderTop: '2px solid var(--fg)',
        borderBottom: '2px solid var(--fg)',
        background: 'var(--bg-sunken)',
      }}
    >
      <div
        className="flex gap-12 whitespace-nowrap k-marquee hover:[animation-play-state:paused]"
        style={{ width: 'max-content' }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-4 font-mono text-[10.5px] uppercase"
            style={{
              letterSpacing: '0.18em',
              color: 'var(--fg)',
            }}
          >
            <span
              aria-hidden
              className="inline-block"
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: 'var(--accent)',
                boxShadow: '0 0 0 2px var(--fg)',
              }}
            />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
