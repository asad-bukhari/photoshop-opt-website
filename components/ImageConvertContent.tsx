import { ContentSheet } from './ContentSheet';

export function ImageConvertContent() {
  return (
    <ContentSheet>
      <section id="convert-formats" aria-labelledby="convert-formats-title" className="scroll-mt-24 space-y-3">
        <h2 id="convert-formats-title">JPG, PNG and WebP</h2>
        <p>
          JPG is the most compatible choice for forms and older software. PNG is lossless and keeps sharp edges, which
          suits screenshots and diagrams. WebP is usually smaller for web pages and can keep transparency.
        </p>
        <p>
          The output is a new file. The original is not changed, and the conversion drops EXIF metadata such as GPS
          location.
        </p>
      </section>

      <section id="convert-transparency" aria-labelledby="convert-transparency-title" className="scroll-mt-24 space-y-3">
        <h2 id="convert-transparency-title">Transparency and quality</h2>
        <p>
          PNG and WebP can keep transparent pixels. JPG cannot, so transparent areas become white. The quality slider
          applies to JPG and WebP only; PNG is lossless and ignores it.
        </p>
        <p>
          Lower quality reduces the file size but can add softness around text and edges. Check the preview and the
          reported size before you submit the file.
        </p>
      </section>

      <section id="convert-limits" aria-labelledby="convert-limits-title" className="scroll-mt-24 space-y-3">
        <h2 id="convert-limits-title">What this tool cannot do</h2>
        <ul>
          <li>It does not decode HEIC in browsers that cannot read it; convert to JPG first.</li>
          <li>It does not export AVIF.</li>
          <li>It does not resize, crop or rotate; use the photo resizer or the crop and rotate tool.</li>
          <li>It does not restore detail lost in an earlier compression.</li>
          <li>It does not upload the image anywhere.</li>
        </ul>
      </section>
    </ContentSheet>
  );
}
