import { ContentSheet } from './ContentSheet';

export function ScanCleanupContent() {
  return (
    <ContentSheet>
      <section id="scan-basics" aria-labelledby="scan-basics-title" className="scroll-mt-24 space-y-3">
        <h2 id="scan-basics-title">From phone photo to A4 PDF</h2>
        <p>
          Each photo becomes one A4 page. The document is fitted inside a small white margin on the page. Use one clear
          photo per page and keep the camera as square to the paper as you can.
        </p>
        <p>
          The export is rendered at 150 DPI. That keeps a multi-page document manageable on a phone while staying
          readable on screen and on a normal home printer.
        </p>
      </section>

      <section id="scan-editing" aria-labelledby="scan-editing-title" className="scroll-mt-24 space-y-3">
        <h2 id="scan-editing-title">Crop, rotate and filter each page</h2>
        <p>
          Select a page in the list, then use the four crop sliders to remove the background around the document. The
          rotate button turns that page in 90-degree steps. The preview updates before you export.
        </p>
        <p>
          Grayscale removes colour casts and is a good default for text. B&amp;W scan pushes the page toward black and
          white, which can make faint text clearer but can also lose light pencil marks. Brighten lifts dark pixels for
          a photo taken in poor light.
        </p>
      </section>

      <section id="scan-no-edge-detection" aria-labelledby="scan-no-edge-detection-title" className="scroll-mt-24 space-y-3">
        <h2 id="scan-no-edge-detection-title">No automatic edge detection</h2>
        <p>
          This version does not find the page edges, correct perspective or deskew a tilted photo. Those features need a
          heavier on-device model or server processing, and the tool is intentionally simple and local.
        </p>
        <p>
          For the cleanest result, put the paper on a plain surface, fill the photo with the page, avoid shadows and
          keep the camera parallel to the paper. Then use the crop sliders to trim the remaining background.
        </p>
      </section>

      <section id="scan-limits" aria-labelledby="scan-limits-title" className="scroll-mt-24 space-y-3">
        <h2 id="scan-limits-title">What this tool cannot do</h2>
        <ul>
          <li>It does not detect edges or correct perspective automatically.</li>
          <li>It does not run OCR, so the PDF text is not searchable.</li>
          <li>It does not remove shadows, replace the background or restore a blurry photo.</li>
          <li>It does not create a PDF from an existing PDF; use the merge or split tools instead.</li>
          <li>It does not upload the photos anywhere.</li>
        </ul>
      </section>
    </ContentSheet>
  );
}
