import type {
  PdfBuildOptions,
  PdfBuildResult,
  PdfImageInput,
  PdfImageQuality,
  PdfMargin,
  PdfPageSize,
  PdfOrientation,
  PdfRotation
} from '../types';
import { loadImageFile } from './loadImage';

export const PAGE_SIZE_PT: Record<Exclude<PdfPageSize, 'fit'>, { width: number; height: number }> = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 },
  legal: { width: 612, height: 1008 }
};

export const MARGIN_PT: Record<PdfMargin, number> = {
  none: 0,
  small: 18,
  normal: 36
};

export const MAX_IMAGE_DIMENSION = 4000;

const JPEG_QUALITY: Record<PdfImageQuality, number> = {
  original: 0.95,
  high: 0.85,
  small: 0.6
};

export function getJpegQuality(quality: PdfImageQuality): number {
  return JPEG_QUALITY[quality];
}

export function shouldDownscale(width: number, height: number): boolean {
  return Math.max(width, height) > MAX_IMAGE_DIMENSION;
}

export function getScaledDimensions(width: number, height: number): { width: number; height: number } {
  if (!shouldDownscale(width, height)) return { width, height };
  const scale = MAX_IMAGE_DIMENSION / Math.max(width, height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale))
  };
}

export function resolvePageSize(
  pageSize: PdfPageSize,
  orientation: PdfOrientation,
  imageWidth: number,
  imageHeight: number,
  marginPt: number
): { width: number; height: number } {
  if (pageSize === 'fit') {
    return {
      width: imageWidth + marginPt * 2,
      height: imageHeight + marginPt * 2
    };
  }

  const base = PAGE_SIZE_PT[pageSize];
  const landscape =
    orientation === 'landscape' || (orientation === 'auto' && imageWidth > imageHeight);

  return landscape ? { width: base.height, height: base.width } : { width: base.width, height: base.height };
}

export function computeImagePlacement(
  pageWidth: number,
  pageHeight: number,
  imageWidth: number,
  imageHeight: number,
  marginPt: number
): { x: number; y: number; width: number; height: number } {
  const contentWidth = Math.max(1, pageWidth - marginPt * 2);
  const contentHeight = Math.max(1, pageHeight - marginPt * 2);
  const scale = Math.min(contentWidth / imageWidth, contentHeight / imageHeight);
  const width = imageWidth * scale;
  const height = imageHeight * scale;

  return {
    x: (pageWidth - width) / 2,
    y: (pageHeight - height) / 2,
    width,
    height
  };
}

export function nextRotation(rotation: PdfRotation): PdfRotation {
  return ((rotation + 90) % 360) as PdfRotation;
}

interface PreparedImage {
  bytes: Uint8Array;
  width: number;
  height: number;
  downscaled: boolean;
}

function rotatedSize(width: number, height: number, rotation: PdfRotation): { width: number; height: number } {
  return rotation === 90 || rotation === 270 ? { width: height, height: width } : { width, height };
}

async function prepareImage(
  file: File,
  quality: PdfImageQuality,
  rotation: PdfRotation
): Promise<PreparedImage> {
  const image = await loadImageFile(file);
  const downscaled = shouldDownscale(image.width, image.height);
  const scaled = getScaledDimensions(image.width, image.height);
  const finalSize = rotatedSize(scaled.width, scaled.height, rotation);

  const canvas = document.createElement('canvas');
  canvas.width = finalSize.width;
  canvas.height = finalSize.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable.');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(image, -scaled.width / 2, -scaled.height / 2, scaled.width, scaled.height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error('The image could not be encoded.'))),
      'image/jpeg',
      getJpegQuality(quality)
    );
  });

  return {
    bytes: new Uint8Array(await blob.arrayBuffer()),
    width: canvas.width,
    height: canvas.height,
    downscaled
  };
}

export async function buildImagesPdf(
  images: PdfImageInput[],
  options: PdfBuildOptions,
  onProgress?: (completed: number, total: number) => void
): Promise<PdfBuildResult> {
  if (images.length === 0) throw new Error('Add at least one image.');

  const { PDFDocument } = await import('pdf-lib');
  const pdf = await PDFDocument.create();
  const marginPt = MARGIN_PT[options.margin];
  let downscaledCount = 0;

  for (let index = 0; index < images.length; index++) {
    const item = images[index];
    const prepared = await prepareImage(item.file, options.quality, item.rotation);
    if (prepared.downscaled) downscaledCount++;

    const pageSize = resolvePageSize(
      options.pageSize,
      options.orientation,
      prepared.width,
      prepared.height,
      marginPt
    );
    const page = pdf.addPage([pageSize.width, pageSize.height]);
    const embedded = await pdf.embedJpg(prepared.bytes);
    const placement = computeImagePlacement(
      pageSize.width,
      pageSize.height,
      prepared.width,
      prepared.height,
      marginPt
    );

    page.drawImage(embedded, {
      x: placement.x,
      y: placement.y,
      width: placement.width,
      height: placement.height
    });

    onProgress?.(index + 1, images.length);
  }

  const bytes = await pdf.save();
  return {
    blob: new Blob([bytes], { type: 'application/pdf' }),
    pageCount: pdf.getPageCount(),
    downscaledCount,
    bytes: bytes.length
  };
}
