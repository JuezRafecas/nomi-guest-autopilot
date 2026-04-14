'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNavTrigger } from './MobileNavTrigger';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative z-10">
      <a href="#main" className="skip-link">Saltar al contenido</a>
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <main id="main" className="flex-1 min-w-0">
        <MobileNavTrigger onOpen={() => setMobileOpen(true)} />
        {children}
      </main>
    </div>
  );
}
