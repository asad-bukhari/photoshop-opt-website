import type {
  ScanCrop,
  ScanFilterMode,
  ScanPageInput,
  ScanPageSettings,
  ScanPdfResult,
  ScanRotation
} from '../types';
import { applyImageFilters, clamp255 } from './imageFilters';
import { computeCropRect, rotatedDimensions } from './cropRect';

export const SCAN_DPI = 150;
export const SCAN_PAGE_WIDTH_MM = 210;
export const SCAN_PAGE_HEIGHT_MM = 297;
export const SCAN_MARGIN_MM = 6;
export const MAX_SCAN_SOURCE = 2400;

export const DEFAULT_SCAN_SETTINGS: ScanPageSettings = {
  rotation: 0,
  filter: 'original',
  crop: { left: 0, right: 0, top: 0, bottom: 0 }
};

export { computeCropRect, rotatedDimensions } from './cropRect';

export function applyScanFilter(imageData: ImageData, filter: ScanFilterMode): void {
  if (filter === 'original') return;

  if (filter === 'brighten') {
    const data = imageData.data;
    for (let index = 0; index < data.length; index += 4) {
      data[index] = clamp255(data[index] * 1.12 + 12);
      data[index + 1] = clamp255(data[index + 1] * 1.12 + 12);
      data[index + 2] = clamp255(data[index + 2] * 1.12 + 12);
    }
    return;
  }

  if (filter === 'grayscale') {
    applyImageFilters(imageData, {
      filter: 'grayscale',
      brightness: 0,
      contrast: 0,
      sharpness: 0
    });
    return;
  }

  applyImageFilters(imageData, {
    filter: 'high-contrast-bw',
    brightness: 0,
    contrast: 0,
    sharpness: 20
  });
}

function mmToPx(mm: number, dpi: number): number {
  return Math.round((mm / 25.4) * dpi);
}

export function renderScanPage(
  image: HTMLImageElement,
  settings: ScanPageSettings,
  dpi = SCAN_DPI
): HTMLCanvasElement {
  const crop = computeCropRect(image.width, image.height, settings.crop);
  const croppedWidth = Math.max(1, Math.round(crop.sw));
  const croppedHeight = Math.max(1, Math.round(crop.sh));

  const sourceScale = Math.min(1, MAX_SCAN_SOURCE / Math.max(croppedWidth, croppedHeight));
  const workWidth = Math.max(1, Math.round(croppedWidth * sourceScale));
  const workHeight = Math.max(1, Math.round(croppedHeight * sourceScale));

  const cropped = document.createElement('canvas');
  cropped.width = workWidth;
  cropped.height = workHeight;
  const croppedCtx = cropped.getContext('2d');
  if (!croppedCtx) throw new Error('Canvas 2D context unavailable.');
  croppedCtx.drawImage(image, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, workWidth, workHeight);

  const imageData = croppedCtx.getImageData(0, 0, workWidth, workHeight);
  applyScanFilter(imageData, settings.filter);
  croppedCtx.putImageData(imageData, 0, 0);

  const rotatedSize = rotatedDimensions(workWidth, workHeight, settings.rotation);
  const rotated = document.createElement('canvas');
  rotated.width = rotatedSize.width;
  rotated.height = rotatedSize.height;
  const rotatedCtx = rotated.getContext('2d');
  if (!rotatedCtx) throw new Error('Canvas 2D context unavailable.');
  rotatedCtx.fillStyle = '#ffffff';
  rotatedCtx.fillRect(0, 0, rotated.width, rotated.height);
  rotatedCtx.translate(rotated.width / 2, rotated.height / 2);
  rotatedCtx.rotate((settings.rotation * Math.PI) / 180);
  rotatedCtx.drawImage(cropped, -workWidth / 2, -workHeight / 2);

  const pageWidth = mmToPx(SCAN_PAGE_WIDTH_MM, dpi);
  const pageHeight = mmToPx(SCAN_PAGE_HEIGHT_MM, dpi);
  const margin = mmToPx(SCAN_MARGIN_MM, dpi);
  const page = document.createElement('canvas');
  page.width = pageWidth;
  page.height = pageHeight;
  const ctx = page.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable.');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, pageWidth, pageHeight);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const scale = Math.min(
    (pageWidth - margin * 2) / rotated.width,
    (pageHeight - margin * 2) / rotated.height
  );
  const drawWidth = rotated.width * scale;
  const drawHeight = rotated.height * scale;
  ctx.drawImage(rotated, (pageWidth - drawWidth) / 2, (pageHeight - drawHeight) / 2, drawWidth, drawHeight);

  return page;
}

function canvasToJpegDataUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/jpeg', 0.88);
}

export async function buildScanPdf(
  pages: ScanPageInput[],
  onProgress?: (completed: number, total: number) => void
): Promise<ScanPdfResult> {
  if (pages.length === 0) throw new Error('Add at least one document photo.');

  const { PDFDocument } = await import('pdf-lib');
  const pdf = await PDFDocument.create();
  const widthPt = (SCAN_PAGE_WIDTH_MM / 25.4) * 72;
  const heightPt = (SCAN_PAGE_HEIGHT_MM / 25.4) * 72;

  for (let index = 0; index < pages.length; index++) {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      const url = URL.createObjectURL(pages[index].file);
      element.onload = () => {
        URL.revokeObjectURL(url);
        resolve(element);
      };
      element.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('A document photo could not be opened.'));
      };
      element.src = url;
    });

    const canvas = renderScanPage(image, pages[index].settings, SCAN_DPI);
    const dataUrl = canvasToJpegDataUrl(canvas);
    const binary = atob(dataUrl.split(',')[1]);
    const bytes = new Uint8Array(binary.length);
    for (let byteIndex = 0; byteIndex < binary.length; byteIndex++) {
      bytes[byteIndex] = binary.charCodeAt(byteIndex);
    }

    const embedded = await pdf.embedJpg(bytes);
    const page = pdf.addPage([widthPt, heightPt]);
    page.drawImage(embedded, { x: 0, y: 0, width: widthPt, height: heightPt });
    onProgress?.(index + 1, pages.length);
  }

  const saved = await pdf.save();
  return {
    blob: new Blob([saved], { type: 'application/pdf' }),
    pageCount: pdf.getPageCount(),
    bytes: saved.length
  };
}
