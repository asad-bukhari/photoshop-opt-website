import { notFound } from 'next/navigation';
import { ImageOptTool } from './ImageOptTool';
import { SizeLandingContent } from './SizeLandingContent';
import { ToolPage } from './tool/ToolPage';
import { getToolBySlug } from '@/lib/data/tools';
import { getSizeLandingPage } from '@/lib/data/sizeLandingPages';
import { buildToolSchema } from '@/lib/utils/toolSchema';

export function SizeLandingPageView({ slug }: { slug: string }) {
  const tool = getToolBySlug(slug);
  const page = getSizeLandingPage(slug);
  if (!tool || !page) notFound();

  const schema = buildToolSchema(tool);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ToolPage toolId={tool.id}>
        <ImageOptTool initialTargetKB={page.targetKB} embedded />
        <SizeLandingContent page={page} />
      </ToolPage>
    </>
  );
}
