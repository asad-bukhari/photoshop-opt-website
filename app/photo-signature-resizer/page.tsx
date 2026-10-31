import type { Metadata } from 'next';
import { PhotoResizeTool } from '@/components/PhotoResizeTool';
import { PhotoResizeContent } from '@/components/PhotoResizeContent';
import { ToolPage } from '@/components/tool/ToolPage';
import { requireTool } from '@/lib/data/tools';
import { buildToolSchema } from '@/lib/utils/toolSchema';
import { buildToolMetadata } from '@/lib/utils/toolMetadata';

const tool = requireTool('photo-signature-resizer');

export const metadata = buildToolMetadata(tool);

const schema = buildToolSchema(tool);

export default function PhotoSignatureResizerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ToolPage toolId={tool.id}>
        <PhotoResizeTool />
        <PhotoResizeContent />
      </ToolPage>
    </>
  );
}
