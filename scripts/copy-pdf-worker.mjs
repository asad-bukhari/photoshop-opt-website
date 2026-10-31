import { copyFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const source = require.resolve('pdfjs-dist/build/pdf.worker.min.mjs');

await mkdir('public', { recursive: true });
await copyFile(source, 'public/pdf.worker.min.mjs');
console.log('Copied the pdf.js worker to public/pdf.worker.min.mjs');
