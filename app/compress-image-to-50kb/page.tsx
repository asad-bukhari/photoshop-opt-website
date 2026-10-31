import type { Metadata } from 'next';
import { SizeLandingPageView } from '@/components/SizeLandingPageView';
import { requireTool } from '@/lib/data/tools';
import { buildToolMetadata } from '@/lib/utils/toolMetadata';

const tool = requireTool('compress-image-to-50kb');

export const metadata: Metadata = buildToolMetadata(tool);

export default function Page() {
  return <SizeLandingPageView slug={tool.slug} />;
}
