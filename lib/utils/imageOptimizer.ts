import { ImageOptimizationOptions, ProcessedImageItem, SocialPreset } from '../types';

const EXTENSION_MAP: Record<string, string> = {
  jpeg: 'jpg',
  webp: 'webp',
  png: 'png',
  avif: 'avif'
};

function renderToCanvas(img: HTMLImageElement, width: number, height: number, preset: SocialPreset): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context unavailable');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (preset !== 'original') {
    const scale = Math.max(width / img.width, height / img.height);
    const x = width / 2 - (img.width / 2) * scale;
    const y = height / 2 - (img.height / 2) * scale;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  } else {
    ctx.drawImage(img, 0, 0, width, height);
  }

  return canvas;
}

function estimateDataUrlSize(dataUrl: string): number {
  const base64Length = dataUrl.split(',')[1].length;
  return Math.round(base64Length * 0.75);
}

interface TuneResult {
  dataUrl: string;
  overTarget: boolean;
}

function tuneToTarget(canvas: HTMLCanvasElement, mimeType: string, targetBytes: number): TuneResult {
  const encodeAt = (q: number) => canvas.toDataURL(mimeType, q);
  let lo = 0.05;
  let hi = 1.0;
  let bestDataUrl: string | null = null;

  for (let i = 0; i < 8; i++) {
    const q = (lo + hi) / 2;
    const dataUrl = encodeAt(q);
    if (estimateDataUrlSize(dataUrl) <= targetBytes) {
      bestDataUrl = dataUrl;
      lo = q;
    } else {
      hi = q;
    }
  }

  if (bestDataUrl) {
    return { dataUrl: bestDataUrl, overTarget: false };
  }
  return { dataUrl: encodeAt(0.05), overTarget: true };
}

export async function processImageFile(
  file: File,
  options: ImageOptimizationOptions,
  onProgress?: (progress: number) => void
): Promise<ProcessedImageItem> {
  const startTime = performance.now();
  const id = Math.random().toString(36).substring(2, 9);

  if (onProgress) onProgress(15);

  return new Promise((resolve, reject) => {
    const img = new Image();
    const originalUrl = URL.createObjectURL(file);

    img.onload = async () => {
      if (onProgress) onProgress(45);

      try {
        let targetWidth = img.width;
        let targetHeight = img.height;

        if (options.preset === 'instagram-square') {
          targetWidth = 1080;
          targetHeight = 1080;
        } else if (options.preset === 'instagram-story') {
          targetWidth = 1080;
          targetHeight = 1920;
        } else if (options.preset === 'linkedin-banner') {
          targetWidth = 1584;
          targetHeight = 396;
        } else if (options.preset === 'passport-photo') {
          targetWidth = 600;
          targetHeight = 600;
        } else if (options.preset === 'ecommerce-thumbnail') {
          targetWidth = 800;
          targetHeight = 800;
        } else if (options.maxWidth || options.maxHeight) {
          const maxW = options.maxWidth || img.width;
          const maxH = options.maxHeight || img.height;
          const ratio = Math.min(maxW / img.width, maxH / img.height, 1);
          targetWidth = Math.round(img.width * ratio);
          targetHeight = Math.round(img.height * ratio);
        }

        if (onProgress) onProgress(75);

        const targetBytes = Math.max(1, options.targetSizeKB) * 1024;

        let mimeType = 'image/jpeg';
        if (options.format === 'webp') mimeType = 'image/webp';
        else if (options.format === 'png') mimeType = 'image/png';
        else if (options.format === 'avif') mimeType = 'image/webp';

        let optimizedDataUrl: string;
        let optimizedWidth = targetWidth;
        let optimizedHeight = targetHeight;

        if (options.format === 'png') {
          optimizedDataUrl = renderToCanvas(img, targetWidth, targetHeight, options.preset).toDataURL('image/png', 1);
        } else {
          const minDimension = 32;
          const shrinkFactor = 0.85;
          let width = targetWidth;
          let height = targetHeight;
          let bestDataUrl = '';

          for (;;) {
            const canvas = renderToCanvas(img, width, height, options.preset);
            const result = tuneToTarget(canvas, mimeType, targetBytes);
            bestDataUrl = result.dataUrl;

            if (!result.overTarget) {
              optimizedWidth = width;
              optimizedHeight = height;
              break;
            }

            if (width <= minDimension || height <= minDimension) {
              optimizedWidth = width;
              optimizedHeight = height;
              break;
            }

            width = Math.max(minDimension, Math.round(width * shrinkFactor));
            height = Math.max(minDimension, Math.round(height * shrinkFactor));
          }

          optimizedDataUrl = bestDataUrl;
        }

        const optimizedSize = estimateDataUrlSize(optimizedDataUrl);
        const originalSize = file.size;

        const savedBytes = Math.max(0, originalSize - optimizedSize);
        const savedPercentage = Math.round((savedBytes / originalSize) * 100 * 10) / 10;
        const endTime = performance.now();

        if (onProgress) onProgress(100);

        resolve({
          id,
          name:
            file.name.replace(/\.[^/.]+$/, '') +
            `_opt.${EXTENSION_MAP[options.format] || options.format}`,
          originalSize,
          optimizedSize,
          savedBytes,
          savedPercentage,
          originalWidth: img.width,
          originalHeight: img.height,
          optimizedWidth,
          optimizedHeight,
          originalDataUrl: originalUrl,
          optimizedDataUrl,
          format: options.format,
          processingTimeMs: Math.round(endTime - startTime),
          status: 'completed',
          progress: 100
        });
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image file. Please upload a valid image (JPEG, PNG, WebP).'));
    };

    img.src = originalUrl;
  });
}
