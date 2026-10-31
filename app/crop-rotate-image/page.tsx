import type { Metadata } from 'next';
import { CropRotateTool } from '@/components/CropRotateTool';
import { CropRotateContent } from '@/components/CropRotateContent';
import { ToolPage } from '@/components/tool/ToolPage';
import { requireTool } from '@/lib/data/tools';
import { buildToolMetadata } from '@/lib/utils/toolMetadata';
import { buildToolSchema } from '@/lib/utils/toolSchema';

const tool = requireTool('crop-rotate-image');

export const metadata: Metadata = buildToolMetadata(tool);

const schema = buildToolSchema(tool);

export default function CropRotateImagePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ToolPage toolId={tool.id}>
        <CropRotateTool />
        <CropRotateContent />
      </ToolPage>
    </>
  );
}
