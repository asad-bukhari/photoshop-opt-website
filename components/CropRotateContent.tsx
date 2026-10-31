import { ContentSheet } from './ContentSheet';

export function CropRotateContent() {
  return (
    <ContentSheet>
      <section id="crop-rotate-basics" aria-labelledby="crop-rotate-basics-title" className="scroll-mt-24 space-y-3">
        <h2 id="crop-rotate-basics-title">Crop with sliders, rotate in steps</h2>
        <p>
          The crop controls remove a percentage from each edge, which is faster and more predictable than dragging a
          box on a phone. The preview shows the result before you download.
        </p>
        <p>
          Rotate 90° cycles through upright, sideways and upside down. Dimensions swap for 90 and 270 degrees, so the
          output stays the right way up.
        </p>
      </section>

      <section id="crop-rotate-format" aria-labelledby="crop-rotate-format-title" className="scroll-mt-24 space-y-3">
        <h2 id="crop-rotate-format-title">Formats and quality</h2>
        <p>
          JPG is the compatible default but cannot keep transparency; transparent pixels become white. PNG is
          lossless and ignores quality. WebP can keep transparency and usually makes a smaller file.
        </p>
        <p>
          Cropping removes pixels in the downloaded file. The original photo on your device is unchanged, so keep it if
          you may need the full frame later.
        </p>
      </section>

      <section id="crop-rotate-limits" aria-labelledby="crop-rotate-limits-title" className="scroll-mt-24 space-y-3">
        <h2 id="crop-rotate-limits-title">What this tool cannot do</h2>
        <ul>
          <li>It does not rotate by a free angle or straighten a tilted horizon.</li>
          <li>It does not correct perspective or detect edges.</li>
          <li>It does not restore detail lost in an earlier compression.</li>
          <li>It does not decode HEIC in browsers that cannot read it.</li>
          <li>It does not upload the image anywhere.</li>
        </ul>
      </section>
    </ContentSheet>
  );
}
