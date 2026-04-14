import { MessagesClient } from './MessagesClient';
import { getMessages } from '@/lib/api';

export default async function MessagesPage() {
  const messages = await getMessages();
  return <MessagesClient messages={messages} />;
}
