import type { Metadata } from 'next';
import { ImageConvertTool } from '@/components/ImageConvertTool';
import { ImageConvertContent } from '@/components/ImageConvertContent';
import { ToolPage } from '@/components/tool/ToolPage';
import { requireTool } from '@/lib/data/tools';
import { buildToolMetadata } from '@/lib/utils/toolMetadata';
import { buildToolSchema } from '@/lib/utils/toolSchema';

const tool = requireTool('image-converter');

export const metadata: Metadata = buildToolMetadata(tool);

const schema = buildToolSchema(tool);

export default function ImageConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ToolPage toolId={tool.id}>
        <ImageConvertTool />
        <ImageConvertContent />
      </ToolPage>
    </>
  );
}
