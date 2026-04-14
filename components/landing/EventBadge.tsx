export function EventBadge() {
  return (
    <div className="inline-flex items-center gap-3 pl-3 pr-4 py-2 border border-[#e4dfd2] bg-[#f1ede3]/80 backdrop-blur-sm rounded-full">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#e6784c] opacity-60 animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e6784c]" />
      </span>
      <span className="k-label text-[10.5px] text-[#0e5e48]">
        Push to Prod Hackathon
      </span>
      <span className="h-3 w-px bg-[#d6cfbc]" />
      <span className="k-mono text-[10.5px] uppercase tracking-[0.14em] text-[#605e5a]">
        14.04.2026 · Buenos Aires
      </span>
    </div>
  );
}
