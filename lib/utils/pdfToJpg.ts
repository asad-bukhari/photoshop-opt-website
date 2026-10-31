import type { PDFDocumentProxy } from 'pdfjs-dist';

export type PdfImageScale = 1 | 1.5 | 2;
export type PdfJpegQuality = 'high' | 'small';

export const PDF_IMAGE_SCALES: PdfImageScale[] = [1, 1.5, 2];

const JPEG_QUALITY: Record<PdfJpegQuality, number> = {
  high: 0.92,
  small: 0.7
};

export function getJpegQuality(quality: PdfJpegQuality): number {
  return JPEG_QUALITY[quality];
}

export function getPageImageName(fileName: string, pageNumber: number): string {
  const base = fileName.replace(/\.pdf$/i, '');
  return `${base}_page-${String(pageNumber).padStart(3, '0')}.jpg`;
}

export interface LoadedPdf {
  document: PDFDocumentProxy;
  destroy: () => Promise<void>;
}

export async function loadPdfForImages(file: File): Promise<LoadedPdf> {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });

  try {
    const document = await loadingTask.promise;
    return {
      document,
      destroy: () => loadingTask.destroy()
    };
  } catch (error) {
    await loadingTask.destroy();
    const name = (error as { name?: string }).name;
    if (name === 'PasswordException') {
      throw new Error(`${file.name} is protected. Remove the password in a PDF app, then try again.`);
    }
    throw new Error(`${file.name} could not be read as a PDF.`);
  }
}

export interface PdfPageImage {
  pageNumber: number;
  blob: Blob;
  bytes: number;
  width: number;
  height: number;
  name: string;
}

export async function renderPdfPageToJpeg(
  pdf: PDFDocumentProxy,
  fileName: string,
  pageNumber: number,
  scale: PdfImageScale,
  quality: PdfJpegQuality
): Promise<PdfPageImage> {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const width = Math.max(1, Math.floor(viewport.width));
  const height = Math.max(1, Math.floor(viewport.height));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable.');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  await page.render({ canvas, viewport }).promise;

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error('The page image could not be encoded.'))),
      'image/jpeg',
      getJpegQuality(quality)
    );
  });

  page.cleanup();

  return {
    pageNumber,
    blob,
    bytes: blob.size,
    width,
    height,
    name: getPageImageName(fileName, pageNumber)
  };
}
