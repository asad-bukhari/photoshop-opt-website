import type { ImageConvertFormat } from '../types';
import { loadImageFile } from './loadImage';

const MIME: Record<ImageConvertFormat, string> = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp'
};

const EXTENSION: Record<ImageConvertFormat, string> = {
  jpeg: 'jpg',
  png: 'png',
  webp: 'webp'
};

export function getConvertMimeType(format: ImageConvertFormat): string {
  return MIME[format];
}

export function getConvertExtension(format: ImageConvertFormat): string {
  return EXTENSION[format];
}

export function clampQuality(quality: number): number {
  return Math.min(1, Math.max(0.3, quality));
}

export interface ConvertedImage {
  blob: Blob;
  width: number;
  height: number;
  format: ImageConvertFormat;
}

export async function convertImageElement(
  image: HTMLImageElement,
  format: ImageConvertFormat,
  quality: number
): Promise<ConvertedImage> {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable.');

  if (format === 'jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, 0, 0);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error('The image could not be encoded.'))),
      getConvertMimeType(format),
      format === 'png' ? undefined : clampQuality(quality)
    );
  });

  return { blob, width: canvas.width, height: canvas.height, format };
}

export async function convertImageFile(
  file: File,
  format: ImageConvertFormat,
  quality: number
): Promise<ConvertedImage> {
  const image = await loadImageFile(file);
  return convertImageElement(image, format, quality);
}
