import type { Metadata } from 'next';
import { CnicOptTool } from '@/components/CnicOptTool';
import { CnicOptContent } from '@/components/CnicOptContent';
import { RelatedTools } from '@/components/tool/RelatedTools';

export const metadata: Metadata = {
  title: 'Print CNIC Front and Back on One A4 Page',
  description:
    'Put CNIC front and back on one A4 page at card size. Choose a layout, improve a phone photo, add a watermark, then print or save PDF.',
  alternates: { canonical: '/cnic-photocopy' },
  openGraph: {
    title: 'Print CNIC Front and Back on One A4 Page',
    description:
      'Put CNIC front and back on one A4 page at card size. Choose a layout, improve a phone photo, add a watermark, then print or save PDF.',
    url: '/cnic-photocopy'
  }
};

export default function CnicPhotocopyPage() {
  return (
    <div className="space-y-12">
      <CnicOptTool />
      <CnicOptContent />
      <RelatedTools toolId="cnic-photocopy" />
    </div>
  );
}
