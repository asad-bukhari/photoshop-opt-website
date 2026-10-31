import type { PdfFileInfo, PdfMergeResult, PdfSplitResult } from '../types';

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function looksEncrypted(error: unknown): boolean {
  return /encrypt/i.test(messageOf(error));
}

export async function inspectPdfFile(file: File): Promise<PdfFileInfo> {
  const { PDFDocument } = await import('pdf-lib');
  try {
    const document = await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
    return { pageCount: document.getPageCount(), encrypted: false };
  } catch (error) {
    if (looksEncrypted(error)) {
      return { pageCount: 0, encrypted: true };
    }
    throw new Error(`${file.name} could not be read as a PDF.`);
  }
}

export interface ParsedPageRanges {
  pages: number[];
  errors: string[];
}

export function parsePageRanges(input: string, pageCount: number): ParsedPageRanges {
  const tokens = input
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);

  if (tokens.length === 0) {
    return { pages: [], errors: ['Enter at least one page or range.'] };
  }

  const pages: number[] = [];
  const errors: string[] = [];
  const seen = new Set<number>();

  const addPage = (page: number) => {
    if (seen.has(page)) return;
    seen.add(page);
    pages.push(page);
  };

  for (const token of tokens) {
    const single = /^(\d+)$/.exec(token);
    const range = /^(\d+)\s*-\s*(\d+)$/.exec(token);

    if (single) {
      const page = Number(single[1]);
      if (page < 1 || page > pageCount) {
        errors.push(`${token} is outside 1-${pageCount}.`);
      } else {
        addPage(page);
      }
      continue;
    }

    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);

      if (start > end) {
        errors.push(`${token} is reversed. Use ${end}-${start}.`);
        continue;
      }
      if (start < 1 || end > pageCount) {
        errors.push(`${token} is outside 1-${pageCount}.`);
        continue;
      }

      for (let page = start; page <= end; page++) addPage(page);
      continue;
    }

    errors.push(`${token} is not a page or range.`);
  }

  if (pages.length === 0 && errors.length === 0) {
    errors.push('Enter at least one valid page.');
  }

  return { pages, errors };
}

async function loadPdfDocument(file: File) {
  const { PDFDocument } = await import('pdf-lib');
  try {
    return await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
  } catch (error) {
    if (looksEncrypted(error)) {
      throw new Error(`${file.name} is protected. Remove it or use an unprotected copy.`);
    }
    throw new Error(`${file.name} could not be read as a PDF.`);
  }
}

async function buildSubset(source: Awaited<ReturnType<typeof loadPdfDocument>>, indices: number[], name: string): Promise<PdfSplitResult> {
  const { PDFDocument } = await import('pdf-lib');
  const output = await PDFDocument.create();
  const copied = await output.copyPages(source, indices);
  copied.forEach((page) => output.addPage(page));
  const bytes = await output.save();
  return {
    blob: new Blob([bytes], { type: 'application/pdf' }),
    pageCount: output.getPageCount(),
    bytes: bytes.length,
    name
  };
}

export async function extractPdfPages(file: File, pages: number[]): Promise<PdfSplitResult> {
  if (pages.length === 0) throw new Error('Select at least one page.');

  const source = await loadPdfDocument(file);
  const pageCount = source.getPageCount();
  if (pages.some((page) => page < 1 || page > pageCount)) {
    throw new Error(`Pages must be between 1 and ${pageCount}.`);
  }

  const base = file.name.replace(/\.pdf$/i, '');
  return buildSubset(source, pages.map((page) => page - 1), `${base}_pages.pdf`);
}

export async function splitPdfEveryN(file: File, pagesPerFile: number): Promise<PdfSplitResult[]> {
  if (!Number.isInteger(pagesPerFile) || pagesPerFile < 1) {
    throw new Error('Pages per file must be at least 1.');
  }

  const source = await loadPdfDocument(file);
  const pageCount = source.getPageCount();
  const base = file.name.replace(/\.pdf$/i, '');
  const results: PdfSplitResult[] = [];

  for (let start = 0, part = 1; start < pageCount; start += pagesPerFile, part++) {
    const end = Math.min(pageCount, start + pagesPerFile);
    const indices = Array.from({ length: end - start }, (_, offset) => start + offset);
    results.push(await buildSubset(source, indices, `${base}_part-${part}.pdf`));
  }

  return results;
}

export async function mergePdfFiles(
  files: File[],
  onProgress?: (completed: number, total: number) => void
): Promise<PdfMergeResult> {
  if (files.length === 0) throw new Error('Add at least one PDF.');

  const { PDFDocument } = await import('pdf-lib');
  const merged = await PDFDocument.create();

  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    const source = await loadPdfDocument(file);
    const pages = await merged.copyPages(source, source.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
    onProgress?.(index + 1, files.length);
  }

  const bytes = await merged.save();
  return {
    blob: new Blob([bytes], { type: 'application/pdf' }),
    pageCount: merged.getPageCount(),
    bytes: bytes.length
  };
}
