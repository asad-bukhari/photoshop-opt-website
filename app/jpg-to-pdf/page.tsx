import type { Metadata } from 'next';
import { ImagesToPdfTool } from '@/components/ImagesToPdfTool';
import { ImagesToPdfContent } from '@/components/ImagesToPdfContent';
import { ToolPage } from '@/components/tool/ToolPage';
import { requireTool } from '@/lib/data/tools';
import { buildToolMetadata } from '@/lib/utils/toolMetadata';
import { buildToolSchema } from '@/lib/utils/toolSchema';

const tool = requireTool('jpg-to-pdf');

export const metadata: Metadata = buildToolMetadata(tool);

const schema = buildToolSchema(tool);

export default function JpgToPdfPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ToolPage toolId={tool.id}>
        <ImagesToPdfTool />
        <ImagesToPdfContent />
      </ToolPage>
    </>
  );
}
