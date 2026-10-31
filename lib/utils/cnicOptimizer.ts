import { CnicPrintOptions } from '../types';
import { createObjectUrl, revokeObjectUrl } from './objectUrls';

export async function generateCnicPrintCanvas(
  frontFile: File | string | null,
  backFile: File | string | null,
  options: CnicPrintOptions
): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise(async (resolve, reject) => {
    try {
      let pageWidth = 1240;
      let pageHeight = 1754;

      if (options.paperSize === 'letter') {
        pageWidth = 1275;
        pageHeight = 1650;
      } else if (options.paperSize === 'legal') {
        pageWidth = 1275;
        pageHeight = 2100;
      } else if (options.paperSize === '3r') {
        pageWidth = 525;
        pageHeight = 750;
      }

      const canvas = document.createElement('canvas');
      canvas.width = pageWidth;
      canvas.height = pageHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, pageWidth, pageHeight);

      if (options.borderGrid) {
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1;

        ctx.strokeRect(30, 30, pageWidth - 60, pageHeight - 60);

        ctx.beginPath();
        for (let x = 60; x < pageWidth - 30; x += 100) {
          ctx.moveTo(x, 30);
          ctx.lineTo(x, pageHeight - 30);
        }
        for (let y = 60; y < pageHeight - 30; y += 100) {
          ctx.moveTo(30, y);
          ctx.lineTo(pageWidth - 30, y);
        }
        ctx.stroke();
      }

      const frontImg = frontFile ? await loadImage(frontFile) : null;
      const backImg = backFile ? await loadImage(backFile) : null;

      const cnicBaseWidth = Math.round(500 * options.customScale);
      const cnicBaseHeight = Math.round(315 * options.customScale);

      const drawCard = (img: HTMLImageElement | null, x: number, y: number, w = cnicBaseWidth, h = cnicBaseHeight) => {
        ctx.save();

        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);

        if (img) {
          const cardCanvas = document.createElement('canvas');
          cardCanvas.width = w;
          cardCanvas.height = h;
          const cardCtx = cardCanvas.getContext('2d')!;

          cardCtx.drawImage(img, 0, 0, w, h);

          if (options.filter !== 'original') {
            const imageData = cardCtx.getImageData(0, 0, w, h);
            applyImageFilters(imageData, options);
            cardCtx.putImageData(imageData, 0, 0);
          }

          ctx.drawImage(cardCanvas, x, y);
        } else {
          ctx.fillStyle = '#F8FAFC';
          ctx.fillRect(x, y, w, h);
          ctx.fillStyle = '#64748B';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('[ Image Pending ]', x + w / 2, y + h / 2);
        }

        ctx.restore();
      };

      if (options.layout === 'standard-top-bottom') {
        const centerX = (pageWidth - cnicBaseWidth) / 2;
        const topY = pageHeight * 0.22;
        const bottomY = topY + cnicBaseHeight + 80;

        drawCard(frontImg, centerX, topY);
        drawCard(backImg, centerX, bottomY);
      } else if (options.layout === 'side-by-side') {
        const spacing = 40;
        const totalWidth = cnicBaseWidth * 2 + spacing;
        const startX = (pageWidth - totalWidth) / 2;
        const startY = pageHeight * 0.35;

        drawCard(frontImg, startX, startY);
        drawCard(backImg, startX + cnicBaseWidth + spacing, startY);
      } else if (options.layout === 'dual-copy-a4') {
        const centerX = (pageWidth - cnicBaseWidth) / 2;
        drawCard(frontImg, centerX, pageHeight * 0.12);
        drawCard(backImg, centerX, pageHeight * 0.12 + cnicBaseHeight + 40);

        drawCard(frontImg, centerX, pageHeight * 0.56);
        drawCard(backImg, centerX, pageHeight * 0.56 + cnicBaseHeight + 40);
      } else if (options.layout === 'quad-copy-a4') {
        const col1X = pageWidth * 0.08;
        const col2X = pageWidth * 0.52;

        drawCard(frontImg, col1X, pageHeight * 0.1);
        drawCard(backImg, col1X, pageHeight * 0.1 + cnicBaseHeight + 30);

        drawCard(frontImg, col2X, pageHeight * 0.1);
        drawCard(backImg, col2X, pageHeight * 0.1 + cnicBaseHeight + 30);

        drawCard(frontImg, col1X, pageHeight * 0.55);
        drawCard(backImg, col1X, pageHeight * 0.55 + cnicBaseHeight + 30);

        drawCard(frontImg, col2X, pageHeight * 0.55);
        drawCard(backImg, col2X, pageHeight * 0.55 + cnicBaseHeight + 30);
      } else if (options.layout === 'pakistani-style') {
        const paperWidthPt =
          options.paperSize === 'letter' || options.paperSize === 'legal'
            ? 612
            : options.paperSize === '3r'
              ? 252
              : 595;

        const pt = pageWidth / paperWidthPt;
        const cardRatio = 68 / 99.5;
        let cardW = Math.round(99.5 * 2.83465 * pt);
        let cardH = Math.round(cardW * cardRatio);
        const margin = Math.round(10 * pt);
        const spacing = Math.round(10 * pt);

        const maxColWidth = (pageWidth - 2 * margin - spacing) / 2;
        if (cardW > maxColWidth) {
          const shrink = maxColWidth / cardW;
          cardW = Math.round(cardW * shrink);
          cardH = Math.round(cardH * shrink);
        }

        const xMargin = Math.round((pageWidth - (cardW * 2 + spacing)) / 2);
        const rows = Math.max(1, Math.floor((pageHeight - 2 * margin + spacing) / (cardH + spacing)));

        for (let r = 0; r < rows; r++) {
          const y = margin + r * (cardH + spacing);
          drawCard(frontImg, xMargin, y, cardW, cardH);
          drawCard(backImg, xMargin + cardW + spacing, y, cardW, cardH);
        }
      }

      if (options.enableWatermark && options.watermarkText) {
        ctx.save();
        const angle = (-25 * Math.PI) / 180;
        const text = options.watermarkText.toUpperCase();
        ctx.font = 'bold 32px sans-serif';
        ctx.fillStyle = `rgba(220, 38, 38, ${options.watermarkOpacity})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const fontSize = 32;
        const textWidth = ctx.measureText(text).width;
        const colStep = Math.ceil(textWidth + 90);
        const rowStep = Math.ceil(fontSize + 110);
        const radius = Math.ceil(Math.hypot(pageWidth, pageHeight) / 2);

        ctx.translate(pageWidth / 2, pageHeight / 2);
        ctx.rotate(angle);

        for (let x = -radius; x <= radius; x += colStep) {
          for (let y = -radius; y <= radius; y += rowStep) {
            ctx.fillText(text, x, y);
          }
        }
        ctx.restore();
      }

      ctx.fillStyle = '#475569';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Prepared with cnic-copy-print-opt | Proprietary tool by Asad Bukhari`, 35, pageHeight - 25);

      if (options.dateStamp) {
        ctx.textAlign = 'right';
        ctx.fillText(
          `Print Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`,
          pageWidth - 35,
          pageHeight - 25
        );
      }

      const dataUrl = canvas.toDataURL('image/png', 0.95);
      resolve({ dataUrl, width: pageWidth, height: pageHeight });
    } catch (err) {
      reject(err);
    }
  });
}

function loadImage(src: File | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const ownedUrl = src instanceof File ? createObjectUrl(src) : null;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (ownedUrl) revokeObjectUrl(ownedUrl);
      resolve(img);
    };
    img.onerror = () => {
      if (ownedUrl) revokeObjectUrl(ownedUrl);
      reject(new Error('Failed to load CNIC image source'));
    };
    img.src = typeof src === 'string' ? src : ownedUrl ?? '';
  });
}

function clamp255(value: number): number {
  return value < 0 ? 0 : value > 255 ? 255 : value;
}

function computeOtsuThreshold(values: Float32Array, count: number): number {
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

function applyImageFilters(imageData: ImageData, options: CnicPrintOptions) {
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

function applyUnsharpMask(d: Uint8ClampedArray, w: number, h: number, amount: number) {
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
