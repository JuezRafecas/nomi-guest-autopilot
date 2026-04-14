import { CampaignsClient } from './CampaignsClient';
import { getCampaigns } from '@/lib/api';

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();
  return <CampaignsClient campaigns={campaigns} />;
}
