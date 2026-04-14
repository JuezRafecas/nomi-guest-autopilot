import { cn } from '@/lib/cn';
import type { Message, MessageStatus } from '@/lib/types';
import { Label } from '@/components/ui/Label';
import { formatARS } from '@/lib/constants';

const STATUS_LABEL: Record<MessageStatus, string> = {
  pending_approval: 'Esperando aprobación',
  approved: 'Aprobado',
  queued: 'En cola',
  sent: 'Enviado',
  delivered: 'Entregado',
  read: 'Leído',
  responded: 'Respondido',
  converted: 'Convirtió',
  failed: 'Falló',
  skipped: 'Omitido',
};

const STATUS_TONE: Record<MessageStatus, string> = {
  pending_approval: 'text-segment-at_risk',
  approved: 'text-segment-new',
  queued: 'text-fg-muted',
  sent: 'text-fg-muted',
  delivered: 'text-fg',
  read: 'text-fg',
  responded: 'text-segment-active',
  converted: 'text-accent',
  failed: 'text-segment-dormant',
  skipped: 'text-fg-subtle',
};

interface Props {
  id: string;
  guestName: string;
  campaignName: string;
  channel: Message['channel'];
  preview: string;
  status: MessageStatus;
  createdAt: string;
  revenue?: number;
}

export function MessageInboxRow({
  id,
  guestName,
  campaignName,
  channel,
  preview,
  status,
  createdAt,
  revenue,
}: Props) {
  const when = new Date(createdAt).toLocaleString('es-AR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,2.2fr)_120px_130px_120px] gap-6 items-center pl-6 pr-6 py-5 border-b border-hairline hover:bg-bg-raised transition-colors duration-150">
      <div className="min-w-0">
        <div
          className="font-display text-[17px] text-fg leading-tight truncate"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30' }}
        >
          {guestName}
        </div>
        <div className="text-[10px] uppercase tracking-label text-fg-subtle mt-1 truncate">
          {campaignName}
        </div>
      </div>

      <div className="font-sans text-[13px] text-fg-muted leading-snug truncate">{preview}</div>

      <div className="text-[10px] uppercase tracking-label text-fg-subtle">
        {channel === 'whatsapp' ? 'WhatsApp' : channel === 'email' ? 'Email' : 'WA → Email'}
      </div>

      <div className={cn('flex items-center gap-2 text-[11px] uppercase tracking-label', STATUS_TONE[status])}>
        <span className="h-1 w-1 rounded-full bg-current" />
        {STATUS_LABEL[status]}
      </div>

      <div className="text-right">
        {revenue != null && revenue > 0 ? (
          <div className="font-mono text-[13px] text-accent tabular-nums">{formatARS(revenue)}</div>
        ) : (
          <div className="font-mono text-[11px] text-fg-subtle tabular-nums">{when}</div>
        )}
      </div>
    </div>
  );
}

export function MessageInboxHeader() {
  return (
    <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,2.2fr)_120px_130px_120px] gap-6 pl-6 pr-6 py-3 border-y border-hairline">
      <Label>Comensal</Label>
      <Label>Preview</Label>
      <Label>Canal</Label>
      <Label>Estado</Label>
      <Label className="text-right">Revenue</Label>
    </div>
  );
}
