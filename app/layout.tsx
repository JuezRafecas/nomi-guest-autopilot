import type { Metadata } from 'next';
import {
  Fraunces,
  Instrument_Sans,
  JetBrains_Mono,
  Bricolage_Grotesque,
  Inter,
} from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  axes: ['SOFT', 'WONK', 'opsz'],
  display: 'swap',
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-kaszek-display',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-kaszek-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  ),
  title: 'Revenue Autopilot · Push to Prod Hackathon 2026',
  description:
    'Diagnóstico y recuperación de revenue para restaurantes. Presentado en el Kaszek × Anthropic Push to Prod Hackathon — Buenos Aires, 14 de Abril 2026.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Revenue Autopilot · Push to Prod Hackathon',
    description:
      'Diagnóstico autónomo de revenue para restaurantes — Kaszek × Anthropic Hackathon 2026.',
    images: ['/brand/push-to-prod-og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Revenue Autopilot · Push to Prod Hackathon',
    description:
      'Diagnóstico autónomo de revenue para restaurantes — Kaszek × Anthropic Hackathon 2026.',
    images: ['/brand/push-to-prod-og.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${instrumentSans.variable} ${jetbrainsMono.variable} ${bricolage.variable} ${inter.variable}`}
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
