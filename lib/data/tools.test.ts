import { describe, expect, it } from 'vitest';
import { getLiveTools, getNavTools, getToolBySlug } from './tools';

describe('tool registry', () => {
  it('keeps landing pages out of the navigation', () => {
    const navSlugs = getNavTools().map((tool) => tool.slug);
    expect(navSlugs).toContain('image-compressor');
    expect(navSlugs).toContain('photo-signature-resizer');
    expect(navSlugs).toContain('cnic-photocopy');
    expect(navSlugs).not.toContain('compress-image-to-20kb');
    expect(navSlugs).not.toContain('compress-image-to-50kb');
    expect(navSlugs).not.toContain('compress-image-to-100kb');
  });

  it('includes the landing pages in the live set for the sitemap', () => {
    const landingSlugs = getLiveTools()
      .filter((tool) => tool.kind === 'landing')
      .map((tool) => tool.slug);
    expect(landingSlugs).toEqual([
      'compress-image-to-20kb',
      'compress-image-to-50kb',
      'compress-image-to-100kb'
    ]);
  });

  it('resolves the landing pages', () => {
    expect(getToolBySlug('compress-image-to-20kb')?.kind).toBe('landing');
    expect(getToolBySlug('missing-page')).toBeUndefined();
  });
});
