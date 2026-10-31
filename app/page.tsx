import type { Metadata } from 'next';
import { HomeHub } from '@/components/HomeHub';

export const metadata: Metadata = {
  title: { absolute: 'Zaibi Tools — Image, Photo Resizer & CNIC Print' },
  description:
    'Compress images, resize photos and signatures to exact pixels and KB, and print CNIC front and back on one A4 page. Free browser tools.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Zaibi Tools — Image, Photo Resizer & CNIC Print',
    description:
      'Compress images, resize photos and signatures to exact pixels and KB, and print CNIC front and back on one A4 page. Free browser tools.',
    url: '/'
  }
};

export default function HomePage() {
  return <HomeHub />;
}
