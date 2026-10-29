import type { MetadataRoute } from 'next';

const BASE_URL = 'https://zaibitools.com';
const LAST_MODIFIED = new Date('2026-10-29');

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 1
    },
    {
      url: `${BASE_URL}/image-compressor`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${BASE_URL}/cnic-photocopy`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.9
    },
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
