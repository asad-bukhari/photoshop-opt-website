import type { PassportGrid, PassportSheetSettings } from '../types';
import { PASSPORT_PAPERS } from '../data/passportSheet';
import { computeSourceCrop } from './photoResizer';
import { dataUrlToBlob } from './download';

export const PASSPORT_DPI = 300;
export const PASSPORT_FALLBACK_DPI = 200;

export function computeGrid(
  paperWidthMm: number,
  paperHeightMm: number,
  photoWidthMm: number,
  photoHeightMm: number,
  gapMm: number,
  marginMm: number
): PassportGrid {
  const gap = Math.max(0, gapMm);
  const margin = Math.max(0, marginMm);
  const usableWidth = paperWidthMm - margin * 2;
  const usableHeight = paperHeightMm - margin * 2;

  const columns =
    photoWidthMm > 0 && usableWidth >= photoWidthMm
      ? Math.floor((usableWidth + gap) / (photoWidthMm + gap))
      : 0;
  const rows =
    photoHeightMm > 0 && usableHeight >= photoHeightMm
      ? Math.floor((usableHeight + gap) / (photoHeightMm + gap))
      : 0;

  const capacity = Math.max(0, columns * rows);
  const widthMm = columns > 0 ? columns * photoWidthMm + (columns - 1) * gap : 0;
  const heightMm = rows > 0 ? rows * photoHeightMm + (rows - 1) * gap : 0;
  const startX = (paperWidthMm - widthMm) / 2;
  const startY = (paperHeightMm - heightMm) / 2;

  const positions: { xMm: number; yMm: number }[] = [];
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      positions.push({
        xMm: startX + column * (photoWidthMm + gap),
        yMm: startY + row * (photoHeightMm + gap)
      });
    }
  }

  return {
    columns,
    rows,
    capacity,
    positions,
    widthMm,
    heightMm,
    paperWidthMm,
    paperHeightMm,
    photoWidthMm,
    photoHeightMm,
    gapMm: gap
  };
}

export function resolveCopies(settings: PassportSheetSettings, capacity: number): number {
  if (capacity <= 0) return 0;
  if (settings.copiesMode === 'auto') return capacity;
  return Math.min(capacity, Math.max(1, Math.floor(settings.copies)));
}

export function selectPositions(grid: PassportGrid, copies: number): { xMm: number; yMm: number }[] {
  const selected: { xMm: number; yMm: number }[] = [];
  let remaining = Math.min(copies, grid.capacity);

  for (let row = 0; row < grid.rows && remaining > 0; row++) {
    const inRow = Math.min(grid.columns, remaining);
    const rowWidth = inRow * grid.photoWidthMm + (inRow - 1) * grid.gapMm;
    const startX = (grid.paperWidthMm - rowWidth) / 2;
    const yMm = grid.positions[row * grid.columns]?.yMm ?? 0;

    for (let index = 0; index < inRow; index++) {
      selected.push({ xMm: startX + index * (grid.photoWidthMm + grid.gapMm), yMm });
    }
    remaining -= inRow;
  }

  return selected;
}

export function getPassportGrid(settings: PassportSheetSettings): PassportGrid {
  const paper = PASSPORT_PAPERS[settings.paperSize];
  return computeGrid(
    paper.widthMm,
    paper.heightMm,
    settings.photoWidthMm,
    settings.photoHeightMm,
    settings.gapMm,
    settings.marginMm
  );
}

export interface PassportRenderResult {
  canvas: HTMLCanvasElement;
  grid: PassportGrid;
  copies: number;
  dpi: number;
}

export function renderPassportSheet(
  image: HTMLImageElement,
  settings: PassportSheetSettings,
  dpi: number
): PassportRenderResult {
  const grid = getPassportGrid(settings);
  const copies = resolveCopies(settings, grid.capacity);

  if (copies === 0) {
    throw new Error('The photo does not fit on this paper with the current gap and margin. Reduce them or choose a larger paper.');
  }

  const pxPerMm = dpi / 25.4;
  const width = Math.max(1, Math.round(grid.paperWidthMm * pxPerMm));
  const height = Math.max(1, Math.round(grid.paperHeightMm * pxPerMm));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx || canvas.width !== width || canvas.height !== height) {
    throw new Error('The sheet canvas could not be created on this device.');
  }

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const photoWidthPx = grid.photoWidthMm * pxPerMm;
  const photoHeightPx = grid.photoHeightMm * pxPerMm;
  const crop = computeSourceCrop(
    image.width,
    image.height,
    Math.round(photoWidthPx),
    Math.round(photoHeightPx),
    'fill',
    settings.zoom,
    0,
    0
  );

  const positions = selectPositions(grid, copies);
  positions.forEach((position) => {
    const x = position.xMm * pxPerMm;
    const y = position.yMm * pxPerMm;
    ctx.drawImage(image, crop.sx, crop.sy, crop.sw, crop.sh, x, y, photoWidthPx, photoHeightPx);

    if (settings.cutLines) {
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = Math.max(1, dpi / 300);
      ctx.strokeRect(x, y, photoWidthPx, photoHeightPx);
    }
  });

  return { canvas, grid, copies, dpi };
}

export function renderPassportWithFallback(
  image: HTMLImageElement,
  settings: PassportSheetSettings
): PassportRenderResult {
  try {
    return renderPassportSheet(image, settings, PASSPORT_DPI);
  } catch {
    return renderPassportSheet(image, settings, PASSPORT_FALLBACK_DPI);
  }
}

export async function createPassportPdf(
  sheetDataUrl: string,
  paperWidthMm: number,
  paperHeightMm: number
): Promise<Blob> {
  const { PDFDocument } = await import('pdf-lib');
  const imageBytes = await dataUrlToBlob(sheetDataUrl).arrayBuffer();
  const pdf = await PDFDocument.create();
  const widthPt = (paperWidthMm / 25.4) * 72;
  const heightPt = (paperHeightMm / 25.4) * 72;
  const page = pdf.addPage([widthPt, heightPt]);
  const image = await pdf.embedJpg(imageBytes);
  page.drawImage(image, { x: 0, y: 0, width: widthPt, height: heightPt });
  const bytes = await pdf.save();
  return new Blob([bytes], { type: 'application/pdf' });
}
