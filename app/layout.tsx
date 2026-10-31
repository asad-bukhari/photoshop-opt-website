import type { Metadata, Viewport } from 'next';
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
  metadataBase: new URL('https://zaibitools.com'),
  title: {
    default: 'Zaibi Tools — Image, Photo, PDF & Print Tools',
    template: '%s | Zaibi Tools'
  },
  description:
    'Compress images, resize photos and signatures to exact pixels and KB, convert, merge or split PDFs, and print CNIC or passport photo sheets. Free browser tools.',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'Zaibi Tools',
    title: 'Zaibi Tools — Image, Photo, PDF & Print Tools',
    description:
      'Compress images, resize photos and signatures to exact pixels and KB, convert, merge or split PDFs, and print CNIC or passport photo sheets. Free browser tools.'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f7f5ef',
  colorScheme: 'light'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-3QKCPR8SR3"
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-3QKCPR8SR3');"
          }}
        />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
