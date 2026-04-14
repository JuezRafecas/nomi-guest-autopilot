'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNavTrigger } from './MobileNavTrigger';

interface AppShellProps {
  children: React.ReactNode;
  pendingCount?: number;
}

export function AppShell({ children, pendingCount }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative z-10">
      <a href="#main" className="skip-link">Saltar al contenido</a>
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        pendingCount={pendingCount}
      />
      <main id="main" className="flex-1 min-w-0">
        <MobileNavTrigger onOpen={() => setMobileOpen(true)} />
        {children}
      </main>
    </div>
  );
}
