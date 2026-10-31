import type { CnicPaperSize } from '../types';
import { PAPER_SIZE_MM } from './pdfExport';

export function printSheet(
  dataUrl: string,
  paperSize: CnicPaperSize,
  pageCount: number,
  title = 'CNIC print sheet - Zaibi Tools'
): boolean {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return false;

  const { w, h } = PAPER_SIZE_MM[paperSize];

  const pages = Array.from(
    { length: pageCount },
    () => `<div class="page"><img src="${dataUrl}" alt="CNIC print sheet" /></div>`
  ).join('');

  printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            html, body { margin: 0; padding: 0; background: #fff; }
            .page {
              width: ${w}mm;
              height: ${h}mm;
              display: flex;
              align-items: center;
              justify-content: center;
              page-break-after: always;
              break-after: page;
              overflow: hidden;
            }
            .page:last-child { page-break-after: auto; break-after: auto; }
            .page img { width: 100%; height: 100%; object-fit: contain; }
            @page { size: ${w}mm ${h}mm; margin: 0; }
          </style>
        </head>
        <body>
          ${pages}
        </body>
      </html>
    `);
  printWindow.document.close();

  const images = printWindow.document.images;
  if (images.length === 0) {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    return true;
  }

  let ready = 0;
  Array.from(images).forEach((img) => {
    const finish = () => {
      ready++;
      if (ready === images.length) {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    };
    if (img.complete) finish();
    else {
      img.onload = finish;
      img.onerror = finish;
    }
  });

  return true;
}
