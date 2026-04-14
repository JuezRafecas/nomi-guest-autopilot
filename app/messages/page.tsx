import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Label } from '@/components/ui/Label';
import { Numeral } from '@/components/ui/Numeral';
import { MessageInboxHeader, MessageInboxRow } from '@/components/messages/MessageInboxRow';
import { MOCK_MESSAGES } from '@/lib/mock';

export default function MessagesPage() {
  const pending = MOCK_MESSAGES.filter((m) => m.status === 'pending_approval').length;
  const converted = MOCK_MESSAGES.filter((m) => m.status === 'converted').length;
  const revenue = MOCK_MESSAGES.reduce((acc, m) => acc + (m.realized_revenue ?? 0), 0);

  return (
    <AppShell>
      <Header />

      <section className="editorial-container pt-16 pb-10">
        <Label className="mb-3">Mensajes</Label>
        <h1
          className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] text-fg max-w-[22ch]"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}
        >
          <span className="italic">{pending}</span> esperando tu aprobación.
        </h1>
      </section>

      <section className="editorial-container pb-12">
        <div className="grid grid-cols-3 border-y border-hairline">
          <Stat label="Pendientes" value={pending} />
          <Stat label="Convirtieron hoy" value={converted} />
          <Stat label="Revenue hoy" value={revenue} format="ars" accent />
        </div>
      </section>

      <section className="editorial-container pb-24">
        <MessageInboxHeader />
        {MOCK_MESSAGES.map((m) => (
          <MessageInboxRow
            key={m.id}
            id={m.id}
            guestName={m.guest_name}
            campaignName={m.campaign_name}
            channel={m.channel}
            preview={m.content}
            status={m.status}
            createdAt={m.created_at}
            revenue={m.realized_revenue ?? undefined}
          />
        ))}
      </section>
    </AppShell>
  );
}

function Stat({
  label,
  value,
  format,
  accent,
}: {
  label: string;
  value: number;
  format?: 'ars';
  accent?: boolean;
}) {
  return (
    <div className="px-8 py-10 border-r border-hairline last:border-r-0">
      <Label className="mb-3">{label}</Label>
      <div className={`font-mono text-3xl md:text-4xl tabular-nums ${accent ? 'text-accent' : 'text-fg'}`}>
        <Numeral value={value} format={format === 'ars' ? 'ars' : 'plain'} />
      </div>
    </div>
  );
}
