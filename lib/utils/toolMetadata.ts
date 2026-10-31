import type { Metadata } from 'next';
import type { ToolEntry } from '../types';

export function buildToolMetadata(tool: ToolEntry): Metadata {
  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    alternates: { canonical: `/${tool.slug}` },
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      url: `/${tool.slug}`
    }
  };
}
