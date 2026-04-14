import { CampaignsClient } from './CampaignsClient';
import { getCampaigns, getMessages } from '@/lib/api';

export default async function CampaignsPage() {
  const [campaigns, messages] = await Promise.all([getCampaigns(), getMessages()]);
  const pendingCount = messages.filter((m) => m.status === 'pending_approval').length;
  return <CampaignsClient campaigns={campaigns} pendingCount={pendingCount} />;
}
