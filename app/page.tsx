import type { Metadata } from 'next';
import { HomeHub } from '@/components/HomeHub';

export const metadata: Metadata = {
  title: { absolute: 'Zaibi Tools — Image Compressor & CNIC Print Tool' },
  description:
    'Compress images to 20KB, 50KB or 100KB and print CNIC front and back on one A4 page. Free tools that run in your browser.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Zaibi Tools — Image Compressor & CNIC Print Tool',
    description:
      'Compress images to 20KB, 50KB or 100KB and print CNIC front and back on one A4 page. Free tools that run in your browser.',
    url: '/'
  }
};

export default function HomePage() {
  return <HomeHub />;
}
