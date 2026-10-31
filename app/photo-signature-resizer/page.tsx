import type { Metadata } from 'next';
import { PhotoResizeTool } from '@/components/PhotoResizeTool';
import { PhotoResizeContent } from '@/components/PhotoResizeContent';
import { ToolPage } from '@/components/tool/ToolPage';
import { getToolBySlug } from '@/lib/data/tools';

const registryTool = getToolBySlug('photo-signature-resizer');

if (!registryTool) {
  throw new Error('The photo-signature-resizer registry entry is missing.');
}

const tool = registryTool;

export const metadata: Metadata = {
  title: tool.metaTitle,
  description: tool.metaDescription,
  alternates: { canonical: `/${tool.slug}` },
  openGraph: {
    title: tool.metaTitle,
    description: tool.metaDescription,
    url: `/${tool.slug}`
  }
};

const schema = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    url: `https://zaibitools.com/${tool.slug}`,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    description: tool.metaDescription,
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer }
    }))
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zaibitools.com' },
      { '@type': 'ListItem', position: 2, name: tool.name, item: `https://zaibitools.com/${tool.slug}` }
    ]
  }
];

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
