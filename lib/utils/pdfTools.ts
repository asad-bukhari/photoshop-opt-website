import type { PdfFileInfo, PdfMergeResult } from '../types';

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

export async function mergePdfFiles(
  files: File[],
  onProgress?: (completed: number, total: number) => void
): Promise<PdfMergeResult> {
  if (files.length === 0) throw new Error('Add at least one PDF.');

  const { PDFDocument } = await import('pdf-lib');
  const merged = await PDFDocument.create();

  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    let source;

    try {
      source = await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
    } catch (error) {
      if (looksEncrypted(error)) {
        throw new Error(`${file.name} is protected. Remove it or use an unprotected copy.`);
      }
      throw new Error(`${file.name} could not be read as a PDF.`);
    }

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
