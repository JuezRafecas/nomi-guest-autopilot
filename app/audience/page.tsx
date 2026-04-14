import { AudienceClient } from './AudienceClient';
import { getGuests, getKpis, getSegments } from '@/lib/api';

export default async function AudiencePage() {
  const [summaries, guests, kpis] = await Promise.all([
    getSegments(),
    getGuests(),
    getKpis(),
  ]);

  return <AudienceClient summaries={summaries} guests={guests} totalGuests={kpis.total_guests} />;
}
