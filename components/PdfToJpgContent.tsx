import { ContentSheet } from './ContentSheet';

export function PdfToJpgContent() {
  return (
    <ContentSheet>
      <section id="pdf-to-jpg-use" aria-labelledby="pdf-to-jpg-use-title" className="scroll-mt-24 space-y-3">
        <h2 id="pdf-to-jpg-use-title">When to turn PDF pages into images</h2>
        <p>
          A JPG page is useful for a preview, a slide, a messaging app or a form that accepts an image but not a PDF.
          Each page is rendered on its own, so a 5-page PDF gives you five separate images.
        </p>
        <p>
          The page is drawn at the scale you choose. Text in a scan or a document page stays an image; this tool does
          not extract text or run OCR.
        </p>
      </section>

      <section id="pdf-to-jpg-quality" aria-labelledby="pdf-to-jpg-quality-title" className="scroll-mt-24 space-y-3">
        <h2 id="pdf-to-jpg-quality-title">Scale and quality</h2>
        <p>
          1x is roughly 72 DPI, 1.5x is roughly 108 DPI and 2x is roughly 144 DPI for a standard page. Use 2x when the
          reader needs to see small text; use 1x when a small preview is enough.
        </p>
        <p>
          High JPEG quality (0.92) keeps more detail. Small (0.70) reduces the file size but can add softness around
          letters and thin lines. Both settings render the same page dimensions at a given scale.
        </p>
      </section>

      <section id="pdf-to-jpg-protected" aria-labelledby="pdf-to-jpg-protected-title" className="scroll-mt-24 space-y-3">
        <h2 id="pdf-to-jpg-protected-title">Protected and large PDFs</h2>
        <p>
          Password-protected PDFs are skipped with a message. The tool does not remove encryption. Save an unprotected
          copy first if you own the file. A long PDF can take a while and use a lot of memory because every rendered
          page is kept until you download it.
        </p>
      </section>

      <section id="pdf-to-jpg-limits" aria-labelledby="pdf-to-jpg-limits-title" className="scroll-mt-24 space-y-3">
        <h2 id="pdf-to-jpg-limits-title">What this tool cannot do</h2>
        <ul>
          <li>It does not create a ZIP; each JPG downloads separately.</li>
          <li>It does not run OCR or make the text searchable.</li>
          <li>It does not remove PDF passwords or encryption.</li>
          <li>It does not edit the PDF or convert it to Word.</li>
          <li>It does not upload the PDF anywhere.</li>
        </ul>
      </section>
    </ContentSheet>
  );
}
