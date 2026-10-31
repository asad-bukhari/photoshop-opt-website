import type { CnicFilterMode } from '../types';

export interface ImageFilterOptions {
  filter: CnicFilterMode;
  brightness: number;
  contrast: number;
  sharpness: number;
}

export function clamp255(value: number): number {
  return value < 0 ? 0 : value > 255 ? 255 : value;
}

export function computeOtsuThreshold(values: Float32Array, count: number): number {
  const hist = new Uint32Array(256);
  for (let i = 0; i < count; i++) {
    hist[Math.min(255, Math.max(0, Math.round(values[i])))]++;
  }

  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * hist[i];

  let sumB = 0;
  let weightB = 0;
  let best = 127;
  let bestVariance = 0;

  for (let i = 0; i < 256; i++) {
    weightB += hist[i];
    if (weightB === 0) continue;

    const weightF = count - weightB;
    if (weightF === 0) break;

    sumB += i * hist[i];
    const meanB = sumB / weightB;
    const meanF = (sum - sumB) / weightF;
    const between = weightB * weightF * (meanB - meanF) * (meanB - meanF);

    if (between > bestVariance) {
      bestVariance = between;
      best = i;
    }
  }

  return best;
}

export function applyImageFilters(imageData: ImageData, options: ImageFilterOptions) {
  const d = imageData.data;
  const w = imageData.width;
  const h = imageData.height;

  if (options.filter === 'original') return;

  const bMult = 1 + options.brightness / 100;
  const cFactor = (259 * (options.contrast + 255)) / (255 * (259 - options.contrast));

  const n = w * h;
  const mono = options.filter === 'grayscale' || options.filter === 'high-contrast-bw';
  const lumas = mono ? new Float32Array(n) : null;
  let lo = 255;
  let hi = 0;

  for (let i = 0, p = 0; i < d.length; i += 4, p++) {
    let r = clamp255(cFactor * (d[i] - 128) + 128);
    let g = clamp255(cFactor * (d[i + 1] - 128) + 128);
    let b = clamp255(cFactor * (d[i + 2] - 128) + 128);

    r = clamp255(r * bMult);
    g = clamp255(g * bMult);
    b = clamp255(b * bMult);

    if (mono && lumas) {
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      lumas[p] = lum;
      if (lum < lo) lo = lum;
      if (lum > hi) hi = lum;
    } else if (options.filter === 'enhanced') {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const sat = 1.18;
      d[i] = clamp255(gray + (r - gray) * sat);
      d[i + 1] = clamp255(gray + (g - gray) * sat);
      d[i + 2] = clamp255(gray + (b - gray) * sat);
    } else {
      d[i] = r;
      d[i + 1] = g;
      d[i + 2] = b;
    }
  }

  if (mono && lumas) {
    if (options.filter === 'high-contrast-bw') {
      const threshold = computeOtsuThreshold(lumas, n);
      const softness = 24;

      for (let i = 0, p = 0; i < d.length; i += 4, p++) {
        const v = clamp255(255 / (1 + Math.exp(-(lumas[p] - threshold) / softness)));
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
      }
    } else {
      const span = Math.max(1, hi - lo);
      const scale = (245 - 10) / span;

      for (let i = 0, p = 0; i < d.length; i += 4, p++) {
        const v = clamp255(10 + (lumas[p] - lo) * scale);
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
      }
    }
  }

  if (options.sharpness > 0) {
    applyUnsharpMask(d, w, h, (options.sharpness / 100) * 1.4);
  }
}

export function applyUnsharpMask(d: Uint8ClampedArray, w: number, h: number, amount: number) {
  const src = d.slice();

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;

      let r = 0;
      let g = 0;
      let b = 0;

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const px = Math.min(w - 1, Math.max(0, x + kx));
          const py = Math.min(h - 1, Math.max(0, y + ky));
          const j = (py * w + px) * 4;
          r += src[j];
          g += src[j + 1];
          b += src[j + 2];
        }
      }

      r /= 9;
      g /= 9;
      b /= 9;

      d[i] = clamp255(src[i] + amount * (src[i] - r));
      d[i + 1] = clamp255(src[i + 1] + amount * (src[i + 1] - g));
      d[i + 2] = clamp255(src[i + 2] + amount * (src[i + 2] - b));
    }
  }
}
