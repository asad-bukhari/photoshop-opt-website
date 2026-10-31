import type { Metadata } from 'next';
import { SplitPdfTool } from '@/components/SplitPdfTool';
import { SplitPdfContent } from '@/components/SplitPdfContent';
import { ToolPage } from '@/components/tool/ToolPage';
import { requireTool } from '@/lib/data/tools';
import { buildToolMetadata } from '@/lib/utils/toolMetadata';
import { buildToolSchema } from '@/lib/utils/toolSchema';

const tool = requireTool('split-pdf');

export const metadata: Metadata = buildToolMetadata(tool);

const schema = buildToolSchema(tool);

export default function SplitPdfPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ToolPage toolId={tool.id}>
        <SplitPdfTool />
        <SplitPdfContent />
      </ToolPage>
    </>
  );
}
