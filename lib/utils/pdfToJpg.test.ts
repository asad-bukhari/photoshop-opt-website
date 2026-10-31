import { describe, expect, it } from 'vitest';
import { getJpegQuality, getPageImageName, PDF_IMAGE_SCALES } from './pdfToJpg';

describe('pdf to jpg helpers', () => {
  it('maps quality presets', () => {
    expect(getJpegQuality('high')).toBe(0.92);
    expect(getJpegQuality('small')).toBe(0.7);
  });

  it('builds stable page names', () => {
    expect(getPageImageName('scan.pdf', 1)).toBe('scan_page-001.jpg');
    expect(getPageImageName('My File.PDF', 12)).toBe('My File_page-012.jpg');
  });

  it('offers the expected scales', () => {
    expect(PDF_IMAGE_SCALES).toEqual([1, 1.5, 2]);
  });
});
