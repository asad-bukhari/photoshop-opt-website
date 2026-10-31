import type { ToolEntry } from '../types';

const BASE_URL = 'https://zaibitools.com';

export function buildToolSchema(tool: ToolEntry): object[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: tool.name,
      url: `${BASE_URL}/${tool.slug}`,
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
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: tool.name, item: `${BASE_URL}/${tool.slug}` }
      ]
    }
  ];
}
