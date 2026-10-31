import type { ReactNode } from 'react';
import { ResponsiveAd } from '@/components/ResponsiveAd';
import { HowToSteps } from './HowToSteps';
import { RelatedTools } from './RelatedTools';
import { ToolFaq } from './ToolFaq';
import { ToolHero } from './ToolHero';
import { getToolById } from '@/lib/data/tools';

export function ToolPage({ toolId, children }: { toolId: string; children: ReactNode }) {
  const tool = getToolById(toolId);
  if (!tool) return null;

  return (
    <div className="space-y-10">
      <ToolHero tool={tool} />
      <div>{children}</div>
      <ResponsiveAd />
      <HowToSteps steps={tool.howToSteps} />
      <ToolFaq items={tool.faq} />
      <RelatedTools toolId={tool.id} />
    </div>
  );
}
