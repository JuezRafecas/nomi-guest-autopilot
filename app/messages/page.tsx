import { MessagesClient } from './MessagesClient';
import { getMessages } from '@/lib/api';

export default async function MessagesPage() {
  const messages = await getMessages();
  const pendingCount = messages.filter((m) => m.status === 'pending_approval').length;
  return <MessagesClient messages={messages} pendingCount={pendingCount} />;
}
