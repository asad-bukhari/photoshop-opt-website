import type { Metadata } from 'next';
import { HomeHub } from '@/components/HomeHub';

export const metadata: Metadata = {
  title: { absolute: 'Zaibi Tools — Image, Photo, PDF & Print Tools' },
  description:
    'Compress images, resize photos and signatures, crop or rotate images, scan document photos, convert PDF pages to JPG, and print CNIC or passport sheets. Free browser tools.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Zaibi Tools — Image, Photo, PDF & Print Tools',
    description:
      'Compress images, resize photos and signatures, crop or rotate images, scan document photos, convert PDF pages to JPG, and print CNIC or passport sheets. Free browser tools.',
    url: '/'
  }
};

export default function HomePage() {
  return <HomeHub />;
}
