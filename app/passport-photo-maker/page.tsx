import type { Metadata } from 'next';
import { PassportPhotoTool } from '@/components/PassportPhotoTool';
import { PassportPhotoContent } from '@/components/PassportPhotoContent';
import { ToolPage } from '@/components/tool/ToolPage';
import { requireTool } from '@/lib/data/tools';
import { buildToolMetadata } from '@/lib/utils/toolMetadata';
import { buildToolSchema } from '@/lib/utils/toolSchema';

const tool = requireTool('passport-photo-maker');

export const metadata: Metadata = buildToolMetadata(tool);

const schema = buildToolSchema(tool);

export default function PassportPhotoMakerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ToolPage toolId={tool.id}>
        <PassportPhotoTool />
        <PassportPhotoContent />
      </ToolPage>
    </>
  );
}
