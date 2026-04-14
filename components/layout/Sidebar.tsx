'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Logo } from './Logo';
import { cn } from '@/lib/cn';
import { MOCK_RESTAURANT } from '@/lib/mock';

const NAV = [
  { href: '/campaigns', label: 'Campañas' },
  { href: '/templates', label: 'Plantillas' },
  { href: '/audience', label: 'Audiencia' },
  { href: '/messages', label: 'Mensajes', badgeKey: 'pending' as const },
  { href: '/integrations', label: 'Integraciones' },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  pendingCount?: number;
}

export function Sidebar({ mobileOpen = false, onMobileClose, pendingCount = 0 }: SidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onMobileClose?.();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [mobileOpen, onMobileClose]);

  return (
    <>
      {/* Mobile scrim */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onMobileClose}
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] animate-[fade-up_.2s_ease-out]"
        />
      )}

      <aside
        aria-label="Navegación principal"
        className={cn(
          'flex w-[232px] shrink-0 flex-col min-h-screen',
          'md:sticky md:top-0',
          'fixed md:static inset-y-0 left-0 z-50',
          'transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] md:transition-none',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
        style={{
          background: 'var(--bg-sunken)',
          borderRight: '1px solid var(--hairline)',
        }}
      >
        <div
          className="px-7 py-7 flex items-start justify-between gap-3"
          style={{ borderBottom: '1px solid var(--hairline)' }}
        >
          <div>
            <Link
              href="/dashboard"
              className="inline-block"
              onClick={onMobileClose}
            >
              <Logo />
            </Link>
            <div
              className="mt-3 font-mono text-[9.5px] uppercase"
              style={{ letterSpacing: '0.16em', color: 'var(--fg-subtle)' }}
            >
              v0.1 · Fabric Sushi
            </div>
          </div>
          {onMobileClose && (
            <button
              type="button"
              onClick={onMobileClose}
              aria-label="Cerrar menú"
              className="md:hidden -mr-2 -mt-1 p-2 hover:bg-[var(--bg-raised)] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <path d="M3 3 L13 13 M13 3 L3 13" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="square" />
              </svg>
            </button>
          )}
        </div>

        <nav className="flex-1 px-4 py-8">
          <ul className="space-y-0.5">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + '/');
              const showBadge = item.badgeKey === 'pending' && pendingCount > 0;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href as '/dashboard'}
                    onClick={onMobileClose}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group flex items-center gap-3 pl-3 pr-3 py-2.5 text-[11px] uppercase font-[600] transition-colors',
                      'hover:bg-[var(--bg-raised)]'
                    )}
                    style={{
                      letterSpacing: '0.18em',
                      color: active ? 'var(--fg)' : 'var(--fg-subtle)',
                      fontFamily: 'var(--font-kaszek-sans), Inter, system-ui, sans-serif',
                    }}
                  >
                    <span
                      aria-hidden
                      className="shrink-0 transition-all"
                      style={{
                        width: active ? 3 : 2,
                        height: active ? 14 : 10,
                        backgroundColor: active ? 'var(--accent)' : 'transparent',
                        border: active ? 'none' : '1px solid var(--fg-faint)',
                        borderRadius: 0,
                      }}
                    />
                    <span className="flex-1">{item.label}</span>
                    {showBadge && (
                      <span
                        role="status"
                        aria-label={`${pendingCount} mensajes pendientes de aprobación`}
                        className="k-pulse inline-flex items-center justify-center tabular-nums"
                        style={{
                          minWidth: 20,
                          height: 18,
                          padding: '0 6px',
                          fontFamily: 'var(--font-kaszek-display), "Archivo Black", system-ui, sans-serif',
                          fontSize: 10,
                          letterSpacing: '0.02em',
                          color: 'var(--bg)',
                          background: 'var(--accent)',
                        }}
                      >
                        {pendingCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          className="px-7 py-6"
          style={{ borderTop: '1px solid var(--hairline)' }}
        >
          <div
            className="text-[10px] uppercase mb-2 font-[600]"
            style={{
              letterSpacing: '0.18em',
              color: 'var(--k-green, #0e5e48)',
              fontFamily: 'var(--font-kaszek-sans), Inter, system-ui, sans-serif',
            }}
          >
            Restaurante
          </div>
          <div
            className="k-italic-serif text-[18px] leading-tight"
            style={{ color: 'var(--fg)' }}
          >
            {MOCK_RESTAURANT.name}
          </div>
          <div
            className="font-mono text-[10px] mt-1"
            style={{ color: 'var(--fg-subtle)', letterSpacing: '0.08em' }}
          >
            {MOCK_RESTAURANT.slug}
          </div>
        </div>
      </aside>
    </>
  );
}
