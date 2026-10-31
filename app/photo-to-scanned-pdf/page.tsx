import type { Metadata } from 'next';
import { ScanCleanupTool } from '@/components/ScanCleanupTool';
import { ScanCleanupContent } from '@/components/ScanCleanupContent';
import { ToolPage } from '@/components/tool/ToolPage';
import { requireTool } from '@/lib/data/tools';
import { buildToolMetadata } from '@/lib/utils/toolMetadata';
import { buildToolSchema } from '@/lib/utils/toolSchema';

const tool = requireTool('photo-to-scanned-pdf');

export const metadata: Metadata = buildToolMetadata(tool);

const schema = buildToolSchema(tool);

export default function PhotoToScannedPdfPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ToolPage toolId={tool.id}>
        <ScanCleanupTool />
        <ScanCleanupContent />
      </ToolPage>
    </>
  );
}
