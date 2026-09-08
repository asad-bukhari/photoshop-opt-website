import type { Metadata } from 'next';
import { CnicOptTool } from '@/components/CnicOptTool';

export const metadata: Metadata = {
  title: 'cnic-copy-print-opt — CNIC Front & Back A4 Print Optimizer',
  description:
    'Align CNIC front & back identity cards onto a single A4 page with document enhancement, B&W scan mode, and anti-fraud watermark overlays. 100% in-browser.'
};

export default function CnicOptPage() {
  return <CnicOptTool />;
}
