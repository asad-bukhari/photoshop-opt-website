import type { CnicPaperSize } from '../types';

export const PAPER_SIZE_MM: Record<CnicPaperSize, { w: number; h: number }> = {
  a4: { w: 210, h: 297 },
  letter: { w: 215.9, h: 279.4 },
  legal: { w: 215.9, h: 355.6 },
  '3r': { w: 88.9, h: 127 }
};

export function loadJsPdfLibrary(): Promise<any> {
  return new Promise((resolve, reject) => {
    const win = window as any;
    if (win.jspdf?.jsPDF) {
      resolve(win.jspdf.jsPDF);
      return;
    }

    const existing = document.querySelector('script[src*="jspdf.umd.min.js"]') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(win.jspdf.jsPDF), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load PDF library')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    script.onload = () => resolve(win.jspdf?.jsPDF);
    script.onerror = () => reject(new Error('Failed to load PDF library'));
    document.head.appendChild(script);
  });
}

export function canvasToJpegDataUrl(dataUrl: string, quality = 0.92): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext('2d')!.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => reject(new Error('Failed to read sheet image'));
    img.src = dataUrl;
  });
}
