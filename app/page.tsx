import type { Metadata } from 'next';
import { HomeHub } from '@/components/HomeHub';

export const metadata: Metadata = {
  title: { absolute: 'Zaibi Tools — Image, Photo, PDF & Print Tools' },
  description:
    'Compress images, resize photos and signatures to exact pixels and KB, convert, merge or split PDFs, and print CNIC or passport photo sheets. Free browser tools.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Zaibi Tools — Image, Photo, PDF & Print Tools',
    description:
      'Compress images, resize photos and signatures to exact pixels and KB, convert, merge or split PDFs, and print CNIC or passport photo sheets. Free browser tools.',
    url: '/'
  }
};

export default function HomePage() {
  return <HomeHub />;
}
