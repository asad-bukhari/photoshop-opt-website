import { ContentSheet } from './ContentSheet';

export function PhotoResizeContent() {
  return (
    <ContentSheet>
      <section id="photo-sizes" aria-labelledby="photo-sizes-title" className="scroll-mt-24 space-y-3">
        <h2 id="photo-sizes-title">Photo and signature sizes in pixels</h2>
        <p>
          At 300 DPI, a 35 x 45 mm photo is 413 x 531 pixels, a 2 x 2 inch photo is 600 x 600 pixels, and a 30 x 40 mm
          photo is 354 x 472 pixels. The tool shows the pixel result after you choose a preset or enter a custom size.
        </p>
        <p>
          These are common sizes, not a claim about any particular form. Read the upload rule and use the exact value it
          asks for.
        </p>
      </section>

      <section id="kb-target" aria-labelledby="kb-target-title" className="scroll-mt-24 space-y-3">
        <h2 id="kb-target-title">How the KB target works</h2>
        <p>
          For JPG and WebP, the tool lowers the encoder quality until the file fits your maximum KB. It keeps the pixel
          size you asked for, so a very strict limit can produce a soft image. PNG is lossless and ignores the KB
          target; choose JPG or WebP when a form enforces a size limit.
        </p>
        <p>
          A minimum KB is optional. If the file is smaller than the minimum at the chosen pixel size, the tool reports
          it and still lets you download the best result. It does not pad the file with extra data.
        </p>
      </section>

      <section id="signature-tips" aria-labelledby="signature-tips-title" className="scroll-mt-24 space-y-3">
        <h2 id="signature-tips-title">Signature photo tips</h2>
        <p>
          Use a plain white background and dark ink. Keep the whole signature inside the crop, with a little space
          around it. The tool does not remove a background or straighten a skewed photo, so take the photo as straight as
          you can.
        </p>
      </section>

      <section id="limits" aria-labelledby="limits-title" className="scroll-mt-24 space-y-3">
        <h2 id="limits-title">What this tool cannot do</h2>
        <ul>
          <li>It does not write DPI metadata into the file. Upload forms check pixels and file size.</li>
          <li>It does not remove a background or turn a colour background into white.</li>
          <li>It does not decode HEIC photos in browsers that cannot read them; convert the photo to JPG first.</li>
          <li>Stretch mode can distort faces and signatures; use Fill or Fit unless the form demands stretch.</li>
          <li>It does not upload, verify or submit anything to a portal.</li>
        </ul>
      </section>
    </ContentSheet>
  );
}
