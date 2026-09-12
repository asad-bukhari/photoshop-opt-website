import type { Metadata } from 'next';
import { HomeHub } from '@/components/HomeHub';

export const metadata: Metadata = {
  alternates: { canonical: '/' }
};

export default function HomePage() {
  return <HomeHub />;
}
