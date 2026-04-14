import { TemplatesClient } from './TemplatesClient';
import { getMessages } from '@/lib/api';

export default async function TemplatesPage() {
  const messages = await getMessages();
  const pendingCount = messages.filter((m) => m.status === 'pending_approval').length;
  return <TemplatesClient pendingCount={pendingCount} />;
}
