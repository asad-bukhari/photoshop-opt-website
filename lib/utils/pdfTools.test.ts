import { PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { extractPdfPages, inspectPdfFile, mergePdfFiles, parsePageRanges, splitPdfEveryN } from './pdfTools';

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
async function makeCustomPdf(widths: number[]): Promise<File> {
  const document = await PDFDocument.create();
  widths.forEach((width) => document.addPage([width, 300]));
  const bytes = await document.save();
  return new File([bytes], 'custom.pdf', { type: 'application/pdf' });
}

describe('parsePageRanges', () => {
  it('parses single pages and ranges with spaces', () => {
    expect(parsePageRanges('1-3, 5, 8 - 10', 10)).toEqual({
      pages: [1, 2, 3, 5, 8, 9, 10],
      errors: []
    });
  });

  it('removes duplicates and keeps the first order', () => {
    expect(parsePageRanges('3, 1, 3, 1-2', 5)).toEqual({ pages: [3, 1, 2], errors: [] });
  });

  it('rejects reversed ranges', () => {
    const result = parsePageRanges('5-3', 10);
    expect(result.pages).toEqual([]);
    expect(result.errors[0]).toContain('reversed');
  });

  it('rejects out-of-range pages', () => {
    expect(parsePageRanges('0, 11', 10).errors).toHaveLength(2);
    expect(parsePageRanges('9-12', 10).errors[0]).toContain('outside 1-10');
  });

  it('rejects empty and malformed input', () => {
    expect(parsePageRanges('  ', 10).errors[0]).toContain('at least one');
    expect(parsePageRanges('one', 10).errors[0]).toContain('not a page');
  });
});

describe('extractPdfPages', () => {
  it('extracts pages in the requested order', async () => {
    const source = await makeCustomPdf([100, 200, 300, 400, 500]);
    const result = await extractPdfPages(source, [3, 1]);

    expect(result.pageCount).toBe(2);
    const output = await PDFDocument.load(await result.blob.arrayBuffer());
    expect(output.getPage(0).getWidth()).toBeCloseTo(300);
    expect(output.getPage(1).getWidth()).toBeCloseTo(100);
  });

  it('rejects an empty page list and out-of-range pages', async () => {
    const source = await makePdf(2);
    await expect(extractPdfPages(source, [])).rejects.toThrow('at least one page');
    await expect(extractPdfPages(source, [3])).rejects.toThrow('between 1 and 2');
  });
});

describe('splitPdfEveryN', () => {
  it('splits into chunks of N pages', async () => {
    const source = await makePdf(5);
    const parts = await splitPdfEveryN(source, 2);

    expect(parts.map((part) => part.pageCount)).toEqual([2, 2, 1]);
    expect(parts.map((part) => part.name)).toEqual(['5-pages_part-1.pdf', '5-pages_part-2.pdf', '5-pages_part-3.pdf']);
  });

  it('rejects an invalid chunk size', async () => {
    await expect(splitPdfEveryN(await makePdf(1), 0)).rejects.toThrow('at least 1');
  });
});
