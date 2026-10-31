import type { Metadata } from 'next';
import { ImageOptTool } from '@/components/ImageOptTool';
import { ImageOptContent } from '@/components/ImageOptContent';
import { RelatedTools } from '@/components/tool/RelatedTools';

export const metadata: Metadata = {
  title: 'Image Compressor to 20KB, 50KB or 100KB',
  description:
    'Compress JPG, PNG or WebP images to 20KB, 50KB, 100KB or a custom size. Convert to WebP and remove EXIF location data in your browser.',
  alternates: { canonical: '/image-compressor' },
  openGraph: {
    title: 'Image Compressor to 20KB, 50KB or 100KB',
    description:
      'Compress JPG, PNG or WebP images to a target size, convert to WebP and remove EXIF location data in your browser.',
    url: '/image-compressor'
  }
};

export default function ImageCompressorPage() {
  return (
    <div className="space-y-12">
      <ImageOptTool />
      <ImageOptContent />
      <RelatedTools toolId="image-compressor" />
    </div>
  );
}
