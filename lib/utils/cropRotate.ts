import type { CropPercent, ImageConvertFormat, ImageRotation } from '../types';
import { computeCropRect, rotatedDimensions } from './cropRect';
import { clampQuality, getConvertMimeType } from './imageConvert';
import { loadImageFile } from './loadImage';

export interface CropRotateResult {
  blob: Blob;
  width: number;
  height: number;
}

export function renderCropRotate(
  image: HTMLImageElement,
  crop: CropPercent,
  rotation: ImageRotation,
  maxPreviewPx?: number
): HTMLCanvasElement {
  const rect = computeCropRect(image.width, image.height, crop);
  const croppedWidth = Math.max(1, Math.round(rect.sw));
  const croppedHeight = Math.max(1, Math.round(rect.sh));
  const rotated = rotatedDimensions(croppedWidth, croppedHeight, rotation);
  const scale =
    maxPreviewPx && Math.max(rotated.width, rotated.height) > maxPreviewPx
      ? maxPreviewPx / Math.max(rotated.width, rotated.height)
      : 1;

  const width = Math.max(1, Math.round(rotated.width * scale));
  const height = Math.max(1, Math.round(rotated.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable.');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.translate(width / 2, height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(scale, scale);
  ctx.drawImage(
    image,
    rect.sx,
    rect.sy,
    rect.sw,
    rect.sh,
    -croppedWidth / 2,
    -croppedHeight / 2,
    croppedWidth,
    croppedHeight
  );

  return canvas;
}

async function canvasToBlob(canvas: HTMLCanvasElement, format: ImageConvertFormat, quality: number): Promise<Blob> {
  let target = canvas;

  if (format === 'jpeg') {
    target = document.createElement('canvas');
    target.width = canvas.width;
    target.height = canvas.height;
    const ctx = target.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable.');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, target.width, target.height);
    ctx.drawImage(canvas, 0, 0);
  }

  return new Promise((resolve, reject) => {
    target.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('The image could not be encoded.'))),
      getConvertMimeType(format),
      format === 'png' ? undefined : clampQuality(quality)
    );
  });
}

export async function exportCropRotate(
  image: HTMLImageElement,
  crop: CropPercent,
  rotation: ImageRotation,
  format: ImageConvertFormat,
  quality: number
): Promise<CropRotateResult> {
  const canvas = renderCropRotate(image, crop, rotation);
  const blob = await canvasToBlob(canvas, format, quality);
  return { blob, width: canvas.width, height: canvas.height };
}

export async function cropRotateFile(
  file: File,
  crop: CropPercent,
  rotation: ImageRotation,
  format: ImageConvertFormat,
  quality: number
): Promise<CropRotateResult> {
  const image = await loadImageFile(file);
  return exportCropRotate(image, crop, rotation, format, quality);
}
