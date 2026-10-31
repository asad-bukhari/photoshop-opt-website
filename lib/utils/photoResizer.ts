import { formatBytes } from './format';
import { estimateDataUrlSize, tuneToTarget } from './canvasEncode';
import { loadImageFile } from './loadImage';
import type {
  PhotoResizeFit,
  PhotoResizeFormat,
  PhotoResizeResult,
  PhotoResizeSettings,
  PhotoResizeUnit
} from '../types';

export const MAX_OUTPUT_DIMENSION = 6000;
export const MM_PER_INCH = 25.4;

export interface SourceCrop {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

export type SizeTargetStatus = 'ok' | 'over' | 'under' | 'ignored';

export interface SizeTargetEvaluation {
  status: SizeTargetStatus;
  message: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function unitToPixels(value: number, unit: PhotoResizeUnit, dpi: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(dpi)) return 0;
  if (unit === 'px') return Math.round(value);
  if (unit === 'mm') return Math.round((value / MM_PER_INCH) * dpi);
  if (unit === 'cm') return Math.round((value / 2.54) * dpi);
  return Math.round(value * dpi);
}

export function convertUnitValue(value: number, from: PhotoResizeUnit, to: PhotoResizeUnit, dpi: number): number {
  if (from === to) return value;
  const pixels = unitToPixels(value, from, dpi);
  if (to === 'px') return pixels;
  const inches = pixels / dpi;
  if (to === 'in') return Math.round(inches * 100) / 100;
  if (to === 'mm') return Math.round(inches * MM_PER_INCH * 100) / 100;
  return Math.round(inches * 2.54 * 100) / 100;
}

export function getOutputSize(settings: PhotoResizeSettings): { width: number; height: number } {
  return {
    width: unitToPixels(settings.width, settings.unit, settings.dpi),
    height: unitToPixels(settings.height, settings.unit, settings.dpi)
  };
}

export function validateOutputSize(width: number, height: number): string | null {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) {
    return 'Enter a width and height greater than zero.';
  }
  if (width > MAX_OUTPUT_DIMENSION || height > MAX_OUTPUT_DIMENSION) {
    return `The output is ${width} x ${height} px. The tool is limited to ${MAX_OUTPUT_DIMENSION} px on the longest side.`;
  }
  return null;
}

export function computeSourceCrop(
  srcWidth: number,
  srcHeight: number,
  outWidth: number,
  outHeight: number,
  fit: PhotoResizeFit,
  zoom: number,
  offsetX: number,
  offsetY: number
): SourceCrop {
  if (fit !== 'fill') {
    return { sx: 0, sy: 0, sw: srcWidth, sh: srcHeight };
  }

  const baseScale = Math.max(outWidth / srcWidth, outHeight / srcHeight);
  const scale = baseScale * clamp(zoom, 1, 3);
  const visibleWidth = Math.min(srcWidth, outWidth / scale);
  const visibleHeight = Math.min(srcHeight, outHeight / scale);
  const maxX = Math.max(0, srcWidth - visibleWidth);
  const maxY = Math.max(0, srcHeight - visibleHeight);
  const sx = clamp((srcWidth - visibleWidth) / 2 + (clamp(offsetX, -1, 1) * maxX) / 2, 0, maxX);
  const sy = clamp((srcHeight - visibleHeight) / 2 + (clamp(offsetY, -1, 1) * maxY) / 2, 0, maxY);

  return { sx, sy, sw: visibleWidth, sh: visibleHeight };
}

export function computeLabelStripHeight(height: number, percent: number): number {
  return Math.max(1, Math.min(height - 1, Math.round((height * clamp(percent, 5, 40)) / 100)));
}

export function evaluateSizeTarget(
  bytes: number,
  maxKB: number,
  minKB: number,
  format: PhotoResizeFormat
): SizeTargetEvaluation {
  if (format === 'png') {
    return {
      status: 'ignored',
      message: 'PNG is lossless and ignores the KB target. Choose JPG or WebP if the form enforces a size limit.'
    };
  }

  if (maxKB > 0 && bytes > maxKB * 1024) {
    return {
      status: 'over',
      message: `Over the ${maxKB} KB target. The smallest output at this pixel size is ${formatBytes(bytes)}. Lower the pixel size or raise the limit.`
    };
  }

  if (minKB > 0 && bytes < minKB * 1024) {
    return {
      status: 'under',
      message: `Below the ${minKB} KB minimum. The largest output at this pixel size is ${formatBytes(bytes)}. The tool does not pad the file.`
    };
  }

  return { status: 'ok', message: `Within the ${maxKB} KB target.` };
}

function getMimeType(format: PhotoResizeFormat): string {
  if (format === 'png') return 'image/png';
  if (format === 'webp') return 'image/webp';
  return 'image/jpeg';
}

function drawLabel(ctx: CanvasRenderingContext2D, width: number, height: number, settings: PhotoResizeSettings): void {
  const text = [settings.labelName.trim(), settings.labelDate.trim()].filter(Boolean).join('  |  ');
  if (!settings.addLabel || !text) return;

  const stripHeight = computeLabelStripHeight(height, settings.labelStripPercent);
  const top = height - stripHeight;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, top, width, stripHeight);
  ctx.strokeStyle = '#d8d2c6';
  ctx.lineWidth = Math.max(1, height / 1200);
  ctx.beginPath();
  ctx.moveTo(0, top);
  ctx.lineTo(width, top);
  ctx.stroke();

  let fontSize = Math.max(8, Math.round((stripHeight * clamp(settings.labelFontPercent, 20, 80)) / 100));
  const maxWidth = Math.max(1, width - 16);
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (;;) {
    ctx.font = `600 ${fontSize}px sans-serif`;
    if (ctx.measureText(text).width <= maxWidth || fontSize <= 8) break;
    fontSize -= 1;
  }

  ctx.fillText(text, width / 2, top + stripHeight / 2, maxWidth);
}

export function renderPhotoCanvas(
  img: HTMLImageElement,
  settings: PhotoResizeSettings,
  maxPreviewPx?: number
): HTMLCanvasElement {
  const output = getOutputSize(settings);
  const sizeError = validateOutputSize(output.width, output.height);
  if (sizeError) throw new Error(sizeError);

  const previewScale =
    maxPreviewPx && Math.max(output.width, output.height) > maxPreviewPx
      ? maxPreviewPx / Math.max(output.width, output.height)
      : 1;
  const width = Math.max(1, Math.round(output.width * previewScale));
  const height = Math.max(1, Math.round(output.height * previewScale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable.');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (settings.fit === 'stretch') {
    ctx.drawImage(img, 0, 0, width, height);
  } else if (settings.fit === 'fit') {
    const scale = Math.min(width / img.width, height / img.height);
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;
    ctx.drawImage(img, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
  } else {
    const crop = computeSourceCrop(
      img.width,
      img.height,
      output.width,
      output.height,
      settings.fit,
      settings.zoom,
      settings.offsetX,
      settings.offsetY
    );
    ctx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, width, height);
  }

  drawLabel(ctx, width, height, settings);
  return canvas;
}

export async function resizePhotoImage(
  img: HTMLImageElement,
  settings: PhotoResizeSettings
): Promise<PhotoResizeResult> {
  const canvas = renderPhotoCanvas(img, settings);
  const format = settings.format;
  const mimeType = getMimeType(format);

  if (format === 'png') {
    const dataUrl = canvas.toDataURL('image/png');
    return {
      dataUrl,
      width: canvas.width,
      height: canvas.height,
      bytes: estimateDataUrlSize(dataUrl),
      overTarget: false,
      belowMinimum: false
    };
  }

  const targetBytes = Math.max(1, Math.round(settings.targetKB * 1024));
  const tuned = tuneToTarget(canvas, mimeType, targetBytes);
  let dataUrl = tuned.dataUrl;
  let bytes = estimateDataUrlSize(dataUrl);

  if (settings.minKB > 0 && bytes < settings.minKB * 1024) {
    const maxQuality = canvas.toDataURL(mimeType, 1);
    const maxQualityBytes = estimateDataUrlSize(maxQuality);
    if (maxQualityBytes <= targetBytes) {
      dataUrl = maxQuality;
      bytes = maxQualityBytes;
    }
  }

  return {
    dataUrl,
    width: canvas.width,
    height: canvas.height,
    bytes,
    overTarget: settings.targetKB > 0 && bytes > targetBytes,
    belowMinimum: settings.minKB > 0 && bytes < settings.minKB * 1024
  };
}

export async function resizePhotoFile(
  file: File,
  settings: PhotoResizeSettings
): Promise<PhotoResizeResult> {
  const image = await loadImageFile(file);
  return resizePhotoImage(image, settings);
}
