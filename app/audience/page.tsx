import { AudienceClient } from './AudienceClient';
import { getGuests, getKpis, getMessages, getSegments } from '@/lib/api';

export default async function AudiencePage() {
  const [summaries, guests, kpis, messages] = await Promise.all([
    getSegments(),
    getGuests({ sort: 'visits', limit: 2000 }),
    getKpis(),
    getMessages(),
  ]);
  const pendingCount = messages.filter((m) => m.status === 'pending_approval').length;

  return (
    <AudienceClient
      summaries={summaries}
      guests={guests}
      totalGuests={kpis.total_guests}
      pendingCount={pendingCount}
    />
  );
}
