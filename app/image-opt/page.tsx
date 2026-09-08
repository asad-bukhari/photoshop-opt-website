import type { Metadata } from 'next';
import { ImageOptTool } from '@/components/ImageOptTool';

export const metadata: Metadata = {
  title: 'Batch Image Optimizer & WebP Converter',
  description:
    'Compress JPEG, PNG, WebP & AVIF images up to 80% without quality loss. EXIF metadata stripper and social media preset crops. 100% in-browser.'
};

export default function ImageOptPage() {
  return <ImageOptTool />;
}
