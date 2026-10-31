import { PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { inspectPdfFile, mergePdfFiles } from './pdfTools';

async function makePdf(pageCount: number, width = 200, height = 300): Promise<File> {
  const document = await PDFDocument.create();
  for (let index = 0; index < pageCount; index++) {
    document.addPage([width, height]);
  }
  const bytes = await document.save();
  return new File([bytes], `${pageCount}-pages.pdf`, { type: 'application/pdf' });
}

describe('inspectPdfFile', () => {
  it('reports the page count', async () => {
    const info = await inspectPdfFile(await makePdf(3));
    expect(info).toEqual({ pageCount: 3, encrypted: false });
  });

  it('rejects a broken file', async () => {
    const broken = new File([new Uint8Array([1, 2, 3, 4])], 'broken.pdf', { type: 'application/pdf' });
    await expect(inspectPdfFile(broken)).rejects.toThrow('could not be read');
  });
});

describe('mergePdfFiles', () => {
  it('merges files in order', async () => {
    const first = await makePdf(1, 100, 200);
    const second = await makePdf(2, 300, 400);
    const result = await mergePdfFiles([first, second]);

    expect(result.pageCount).toBe(3);
    expect(result.bytes).toBeGreaterThan(0);

    const merged = await PDFDocument.load(await result.blob.arrayBuffer());
    expect(merged.getPageCount()).toBe(3);
    expect(merged.getPage(0).getWidth()).toBeCloseTo(100);
    expect(merged.getPage(1).getWidth()).toBeCloseTo(300);
    expect(merged.getPage(2).getHeight()).toBeCloseTo(400);
  });

  it('reports progress for every file', async () => {
    const seen: number[] = [];
    await mergePdfFiles([await makePdf(1), await makePdf(1)], (completed, total) => {
      expect(total).toBe(2);
      seen.push(completed);
    });
    expect(seen).toEqual([1, 2]);
  });

  it('rejects a broken file', async () => {
    const broken = new File([new Uint8Array([1, 2, 3])], 'broken.pdf', { type: 'application/pdf' });
    await expect(mergePdfFiles([broken])).rejects.toThrow('could not be read');
  });

  it('rejects an empty list', async () => {
    await expect(mergePdfFiles([])).rejects.toThrow('Add at least one PDF');
  });
});
