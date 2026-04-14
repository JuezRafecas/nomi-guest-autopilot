export function Header({ title, subtitle }: { title?: string; subtitle?: string }) {
  const today = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header style={{ borderBottom: '1.5px solid var(--fg)' }}>
      <div className="editorial-container flex items-center justify-between py-5">
        <div className="flex items-center gap-4">
          <span className="k-event-pill">Live · Hoy</span>
          {title && (
            <div>
              <div
                className="text-[10px] uppercase font-[600]"
                style={{
                  letterSpacing: '0.18em',
                  color: 'var(--k-green, #0e5e48)',
                  fontFamily: 'var(--font-kaszek-sans), Inter, system-ui, sans-serif',
                }}
              >
                {subtitle ?? 'Diagnóstico'}
              </div>
              <h1
                className="text-[22px] leading-tight"
                style={{
                  fontFamily: 'var(--font-kaszek-display), "Archivo Black", system-ui, sans-serif',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: 'var(--fg)',
                }}
              >
                {title}
              </h1>
            </div>
          )}
        </div>
        <div
          className="font-mono text-[10px] uppercase"
          style={{ letterSpacing: '0.14em', color: 'var(--fg-subtle)' }}
        >
          {today}
        </div>
      </div>
    </header>
  );
}
