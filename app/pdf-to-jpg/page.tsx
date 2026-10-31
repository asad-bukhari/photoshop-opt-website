import type { Metadata } from 'next';
import { PdfToJpgTool } from '@/components/PdfToJpgTool';
import { PdfToJpgContent } from '@/components/PdfToJpgContent';
import { ToolPage } from '@/components/tool/ToolPage';
import { requireTool } from '@/lib/data/tools';
import { buildToolMetadata } from '@/lib/utils/toolMetadata';
import { buildToolSchema } from '@/lib/utils/toolSchema';

const tool = requireTool('pdf-to-jpg');

export const metadata: Metadata = buildToolMetadata(tool);

const schema = buildToolSchema(tool);

export default function PdfToJpgPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ToolPage toolId={tool.id}>
        <PdfToJpgTool />
        <PdfToJpgContent />
      </ToolPage>
    </>
  );
}
