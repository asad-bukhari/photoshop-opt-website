import { ContentSheet } from './ContentSheet';

export function ImagesToPdfContent() {
  return (
    <ContentSheet>
      <section id="formats" aria-labelledby="formats-title" className="scroll-mt-24 space-y-3">
        <h2 id="formats-title">JPG, PNG and WebP to PDF</h2>
        <p>
          The tool accepts JPG, PNG and WebP images, plus AVIF when your browser can decode it. Each image is drawn onto
          its own PDF page, so a set of phone photos becomes a multi-page document without a server.
        </p>
        <p>
          Images are re-encoded as JPEG. Transparent PNG areas become white, and small text may soften at the Small
          quality setting.
        </p>
      </section>

      <section id="page-setup" aria-labelledby="page-setup-title" className="scroll-mt-24 space-y-3">
        <h2 id="page-setup-title">Page size, orientation and margins</h2>
        <p>
          Choose A4, Letter, Legal or fit to image. Auto orientation turns each fixed-size page to match its image;
          portrait and landscape force every page. Fit to image uses each image’s own size plus the margin you choose.
        </p>
        <p>
          Margins are measured in points inside the PDF: none, small (18 pt) or normal (36 pt). The image is scaled to
          fit the remaining area and centred without changing its aspect ratio.
        </p>
      </section>

      <section id="pdf-quality" aria-labelledby="pdf-quality-title" className="scroll-mt-24 space-y-3">
        <h2 id="pdf-quality-title">Quality and file size</h2>
        <p>
          Original re-encodes at JPEG quality 0.95 and keeps the most detail. High uses 0.85 and Small uses 0.6. These
          are quality levels, not a target file size; a set of detailed photos can still produce a large PDF.
        </p>
        <p>
          Images longer than 4000 px on the long side are scaled down before they enter the PDF. The result panel says
          how many images were resized. Phone photos are usually larger than this cap.
        </p>
      </section>

      <section id="pdf-limits" aria-labelledby="pdf-limits-title" className="scroll-mt-24 space-y-3">
        <h2 id="pdf-limits-title">What this tool cannot do</h2>
        <ul>
          <li>It does not run OCR, so text in a photo or scan is not searchable.</li>
          <li>It does not add or remove PDF passwords, signatures or bookmarks.</li>
          <li>It does not decode HEIC in browsers that cannot read it; convert the photo to JPG first.</li>
          <li>It does not compress an existing PDF; it builds a new PDF from images.</li>
          <li>It keeps transparency only by turning it into a white background.</li>
        </ul>
      </section>
    </ContentSheet>
  );
}
