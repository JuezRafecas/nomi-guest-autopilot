import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { IntegrationsClient } from './IntegrationsClient';

export default function IntegrationsPage() {
  return (
    <AppShell>
      <Header />
      <IntegrationsClient />
    </AppShell>
  );
}
