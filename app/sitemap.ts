import type { MetadataRoute } from 'next';
import { getLiveTools, toolHref } from '@/lib/data/tools';

const BASE_URL = 'https://zaibitools.com';
const LAST_MODIFIED = new Date('2026-10-30');

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 1
    },
    ...getLiveTools().map((tool) => ({
      url: `${BASE_URL}${toolHref(tool)}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.9
    })),
    {
      url: `${BASE_URL}/privacy`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.3
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.3
    }
  ];
}
