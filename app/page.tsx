import type { Metadata } from 'next';
import { HomeHub } from '@/components/HomeHub';

export const metadata: Metadata = {
  title: { absolute: 'Zaibi Tools — Images, Photo Resizer & PDF' },
  description:
    'Compress images, resize photos and signatures to exact pixels and KB, convert images to PDF, and print CNIC copies. Free browser tools.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Zaibi Tools — Images, Photo Resizer & PDF',
    description:
      'Compress images, resize photos and signatures to exact pixels and KB, convert images to PDF, and print CNIC copies. Free browser tools.',
    url: '/'
  }
};

export default function HomePage() {
  return <HomeHub />;
}
