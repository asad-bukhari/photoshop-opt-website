import { CnicPrintOptions } from '../types';

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

      const drawCard = (img: HTMLImageElement | null, x: number, y: number, label: string) => {
        ctx.save();

        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, cnicBaseWidth, cnicBaseHeight);

        if (img) {
          const cardCanvas = document.createElement('canvas');
          cardCanvas.width = cnicBaseWidth;
          cardCanvas.height = cnicBaseHeight;
          const cardCtx = cardCanvas.getContext('2d')!;

          cardCtx.drawImage(img, 0, 0, cnicBaseWidth, cnicBaseHeight);

          const imageData = cardCtx.getImageData(0, 0, cnicBaseWidth, cnicBaseHeight);
          applyImageFilters(imageData, options);
          cardCtx.putImageData(imageData, 0, 0);

          ctx.drawImage(cardCanvas, x, y);
        } else {
          ctx.fillStyle = '#F8FAFC';
          ctx.fillRect(x, y, cnicBaseWidth, cnicBaseHeight);
          ctx.fillStyle = '#64748B';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`[ ${label} Image Pending ]`, x + cnicBaseWidth / 2, y + cnicBaseHeight / 2);
        }

        ctx.fillStyle = '#1E293B';
        ctx.font = '500 13px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(label, x + 4, y - 8);

        ctx.restore();
      };

      if (options.layout === 'standard-top-bottom') {
        const centerX = (pageWidth - cnicBaseWidth) / 2;
        const topY = pageHeight * 0.22;
        const bottomY = topY + cnicBaseHeight + 80;

        drawCard(frontImg, centerX, topY, 'CNIC FRONT SIDE');
        drawCard(backImg, centerX, bottomY, 'CNIC BACK SIDE');
      } else if (options.layout === 'side-by-side') {
        const spacing = 40;
        const totalWidth = cnicBaseWidth * 2 + spacing;
        const startX = (pageWidth - totalWidth) / 2;
        const startY = pageHeight * 0.35;

        drawCard(frontImg, startX, startY, 'CNIC FRONT SIDE');
        drawCard(backImg, startX + cnicBaseWidth + spacing, startY, 'CNIC BACK SIDE');
      } else if (options.layout === 'dual-copy-a4') {
        const centerX = (pageWidth - cnicBaseWidth) / 2;
        drawCard(frontImg, centerX, pageHeight * 0.12, 'SET 1 - CNIC FRONT');
        drawCard(backImg, centerX, pageHeight * 0.12 + cnicBaseHeight + 40, 'SET 1 - CNIC BACK');

        drawCard(frontImg, centerX, pageHeight * 0.56, 'SET 2 - CNIC FRONT');
        drawCard(backImg, centerX, pageHeight * 0.56 + cnicBaseHeight + 40, 'SET 2 - CNIC BACK');
      } else if (options.layout === 'quad-copy-a4') {
        const col1X = pageWidth * 0.08;
        const col2X = pageWidth * 0.52;

        drawCard(frontImg, col1X, pageHeight * 0.1, 'COPY 1 - FRONT');
        drawCard(backImg, col1X, pageHeight * 0.1 + cnicBaseHeight + 30, 'COPY 1 - BACK');

        drawCard(frontImg, col2X, pageHeight * 0.1, 'COPY 2 - FRONT');
        drawCard(backImg, col2X, pageHeight * 0.1 + cnicBaseHeight + 30, 'COPY 2 - BACK');

        drawCard(frontImg, col1X, pageHeight * 0.55, 'COPY 3 - FRONT');
        drawCard(backImg, col1X, pageHeight * 0.55 + cnicBaseHeight + 30, 'COPY 3 - BACK');

        drawCard(frontImg, col2X, pageHeight * 0.55, 'COPY 4 - FRONT');
        drawCard(backImg, col2X, pageHeight * 0.55 + cnicBaseHeight + 30, 'COPY 4 - BACK');
      }

      if (options.enableWatermark && options.watermarkText) {
        ctx.save();
        ctx.rotate((-25 * Math.PI) / 180);
        ctx.fillStyle = `rgba(220, 38, 38, ${options.watermarkOpacity})`;
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';

        const text = options.watermarkText.toUpperCase();

        for (let x = -pageWidth; x < pageWidth * 2; x += 380) {
          for (let y = -pageHeight; y < pageHeight * 2; y += 180) {
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
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load CNIC image source'));

    if (src instanceof File) {
      img.src = URL.createObjectURL(src);
    } else {
      img.src = src;
    }
  });
}

function applyImageFilters(imageData: ImageData, options: CnicPrintOptions) {
  const d = imageData.data;
  const bMult = 1 + options.brightness / 100;
  const cFactor = (259 * (options.contrast + 255)) / (255 * (259 - options.contrast));

  for (let i = 0; i < d.length; i += 4) {
    let r = d[i];
    let g = d[i + 1];
    let b = d[i + 2];

    r = Math.min(255, Math.max(0, cFactor * (r - 128) + 128));
    g = Math.min(255, Math.max(0, cFactor * (g - 128) + 128));
    b = Math.min(255, Math.max(0, cFactor * (b - 128) + 128));

    r = Math.min(255, Math.max(0, r * bMult));
    g = Math.min(255, Math.max(0, g * bMult));
    b = Math.min(255, Math.max(0, b * bMult));

    if (options.filter === 'grayscale') {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      d[i] = gray;
      d[i + 1] = gray;
      d[i + 2] = gray;
    } else if (options.filter === 'high-contrast-bw') {
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      const threshold = 160;
      const val = luminance > threshold ? 255 : 0;
      d[i] = val;
      d[i + 1] = val;
      d[i + 2] = val;
    } else if (options.filter === 'enhanced') {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const enhanced = gray < 180 ? Math.max(0, gray - 35) : Math.min(255, gray + 20);
      d[i] = enhanced;
      d[i + 1] = enhanced;
      d[i + 2] = enhanced;
    } else {
      d[i] = r;
      d[i + 1] = g;
      d[i + 2] = b;
    }
  }
}
