import type { Metadata } from 'next';
import { Space_Grotesk, Archivo, IBM_Plex_Mono } from 'next/font/google';
import { SiteShell } from '@/components/SiteShell';
import './globals.css';

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap'
});

const body = Archivo({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap'
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    default: 'Zaibi Tools — Image & CNIC Optimization Suite',
    template: '%s | Zaibi Tools'
  },
  description:
    'Proprietary browser-only suite for batch image optimization  and CNIC / ID document copy & print layout alignment . Files never leave your device.',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'Zaibi Tools — Image & CNIC Optimization Suite',
    description:
      'Proprietary browser-only suite for batch image optimization and CNIC document print layout alignment.'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
