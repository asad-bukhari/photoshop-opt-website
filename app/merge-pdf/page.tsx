import type { Metadata } from 'next';
import { MergePdfTool } from '@/components/MergePdfTool';
import { MergePdfContent } from '@/components/MergePdfContent';
import { ToolPage } from '@/components/tool/ToolPage';
import { requireTool } from '@/lib/data/tools';
import { buildToolMetadata } from '@/lib/utils/toolMetadata';
import { buildToolSchema } from '@/lib/utils/toolSchema';

const tool = requireTool('merge-pdf');

export const metadata: Metadata = buildToolMetadata(tool);

const schema = buildToolSchema(tool);

export default function MergePdfPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ToolPage toolId={tool.id}>
        <MergePdfTool />
        <MergePdfContent />
      </ToolPage>
    </>
  );
}
