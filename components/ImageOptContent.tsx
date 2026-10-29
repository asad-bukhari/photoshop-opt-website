import Link from 'next/link';
import { ContentSheet } from './ContentSheet';
import { FaqList } from './FaqList';
import { IMAGE_FAQ_ITEMS } from '@/lib/data/initialData';

export function ImageOptContent() {
  return (
    <ContentSheet>
      <section id="how-to-compress" aria-labelledby="how-to-compress-title" className="scroll-mt-24 space-y-3">
        <h2 id="how-to-compress-title">How to compress an image</h2>
        <ol>
          <li>Choose JPG, WebP or PNG as the output format and enter a target size in KB.</li>
          <li>Add one or more images with the file picker or by dragging them onto the upload area.</li>
          <li>Select Compress images. Processing runs in your browser, one image at a time.</li>
          <li>Check the comparison slider, then download each result.</li>
        </ol>
        <p>
          PNG is lossless, so the PNG export ignores the target size. Choose JPG or WebP when you need to reach a KB
          limit.
        </p>
      </section>

      <section id="compress-jpg" aria-labelledby="compress-jpg-title" className="scroll-mt-24 space-y-3">
        <h2 id="compress-jpg-title">Compress a JPG to 20KB, 50KB or 100KB</h2>
        <p>
          Enter the limit in the target size field and select Compress images. JPG and WebP outputs can be tuned toward
          the target by lowering quality and, if needed, resolution. The result depends on the image content: a photo
          with fine detail may need a smaller resolution than a simple graphic.
        </p>
        <h3>Compress a photo to 20KB</h3>
        <p>
          A 20 KB limit is strict for a large photo. Expect a smaller image or some visible softness. Check the result
          with the comparison slider before you submit it to a portal.
        </p>
        <h3>Compress a photo to 50KB</h3>
        <p>
          50 KB is a common limit for profile photos and document uploads. Start with JPG, then try WebP if the site
          accepts it.
        </p>
        <h3>Compress a photo to 100KB</h3>
        <p>
          100 KB usually leaves more detail for screens and printed previews. Enter 100 as the target and download the
          result.
        </p>
        <h3>Compress to 200KB or 1MB</h3>
        <p>
          Enter 200 for 200 KB, or 1024 for 1 MB. The target field accepts any value from 1 to 10,240 KB.
        </p>
      </section>

      <section id="compress-png" aria-labelledby="compress-png-title" className="scroll-mt-24 space-y-3">
        <h2 id="compress-png-title">Compress a PNG to 20KB</h2>
        <p>
          The PNG export is lossless and ignores the target size, so it cannot be tuned to 20 KB. To reach a KB limit,
          convert the image to JPG or WebP instead. Both formats re-encode the pixels and can reduce the file size.
        </p>
        <h3>Why PNG ignores the target size</h3>
        <p>
          PNG compression is lossless: the encoder keeps the pixel data and only reduces redundancy. There is no quality
          setting to lower, so the target size does not change the output.
        </p>
        <h3>Convert PNG to JPG or WebP to hit a KB limit</h3>
        <p>
          Choose JPG for maximum compatibility or WebP for smaller web files. Transparent areas become solid in JPG;
          WebP can keep transparency.
        </p>
      </section>

      <section id="compress-multiple" aria-labelledby="compress-multiple-title" className="scroll-mt-24 space-y-3">
        <h2 id="compress-multiple-title">Compress several images at once</h2>
        <p>
          Select multiple files in the picker or drop a group onto the upload area. The tool processes them one at a
          time in your browser and lists each result with its before and after size.
        </p>
        <h3>Batch select images</h3>
        <p>
          All selected files use the same format, target size and preset for that run. Change the settings and compress
          again if one file needs different values.
        </p>
        <h3>Process images one at a time</h3>
        <p>
          Processing is sequential, not multi-threaded. Very large or numerous images can take longer and use more
          memory on a phone.
        </p>
      </section>

      <section id="job-visa-exam" aria-labelledby="job-visa-exam-title" className="scroll-mt-24 space-y-3">
        <h2 id="job-visa-exam-title">Compress an image for a job, visa or exam form</h2>
        <p>
          Read the upload limit on the form first. Job, visa and exam portals commonly ask for 20 KB, 50 KB or 100 KB,
          and many accept JPG only. Set that value, choose the accepted format, and download the result.
        </p>
        <h3>JPG or WebP for an upload form</h3>
        <p>
          Choose JPG when the form lists only JPEG or JPG. Choose WebP only when the form accepts it; some older portals
          reject WebP even though browsers display it.
        </p>
        <h3>Check the result before you submit</h3>
        <p>
          Confirm the downloaded size is under the limit and the face or text is still readable. The comparison slider
          shows the original and compressed versions side by side.
        </p>
      </section>

      <section id="convert-formats" aria-labelledby="convert-formats-title" className="scroll-mt-24 space-y-3">
        <h2 id="convert-formats-title">Convert PNG to WebP or WebP to JPG</h2>
        <p>
          Pick the output format before you compress. The browser decodes the source image and re-encodes it in the
          selected format. This tool exports JPG, PNG and WebP; it does not export AVIF.
        </p>
        <h3>PNG to WebP</h3>
        <p>
          WebP is usually smaller than PNG at a similar visual quality and can keep transparency. It is a good default
          for websites that accept it.
        </p>
        <h3>WebP to JPG</h3>
        <p>
          JPG works with older software and most upload forms. Transparency is lost, so the transparent area becomes a
          solid colour.
        </p>
        <h3>JPG to WebP</h3>
        <p>
          WebP can reduce the file size of a photo while keeping reasonable quality. Check the comparison before you
          replace the original.
        </p>
      </section>

      <section id="remove-exif" aria-labelledby="remove-exif-title" className="scroll-mt-24 space-y-3">
        <h2 id="remove-exif-title">Remove EXIF location data</h2>
        <p>
          Phone photos often include EXIF metadata such as GPS coordinates, camera model and timestamps. Re-encoding
          through the Canvas API drops that metadata automatically. There is no separate EXIF switch because every
          export is re-encoded.
        </p>
        <p>
          Use this before sharing a photo publicly or sending it to a third party. Keep the original file if you need
          its metadata for your own records.
        </p>
      </section>

      <section id="resize-presets" aria-labelledby="resize-presets-title" className="scroll-mt-24 space-y-3">
        <h2 id="resize-presets-title">Resize for Instagram and passport photos</h2>
        <p>
          Presets set a fixed output size and crop the image to fill the frame. They do not offer free width and height
          fields. Choose Original aspect ratio to keep the source proportions.
        </p>
        <h3>Passport photo 600x600 px</h3>
        <p>
          The passport preset produces a 600 x 600 px square. Check the photo requirements of the office that will
          receive it; this tool does not validate background, pose or face size.
        </p>
        <h3>Instagram 1080x1080</h3>
        <p>
          The square preset crops to 1080 x 1080 px, suitable for feed posts.
        </p>
        <h3>Instagram Story 1080x1920</h3>
        <p>
          The story preset crops to a vertical 1080 x 1920 px frame.
        </p>
        <h3>LinkedIn banner 1584x396</h3>
        <p>
          The LinkedIn preset crops to a wide 1584 x 396 px banner. Check the crop in the preview before downloading.
        </p>
      </section>

      <section id="where-files-go" aria-labelledby="where-files-go-title" className="scroll-mt-24 space-y-3">
        <h2 id="where-files-go-title">Where your files go</h2>
        <p>
          The tool reads and re-encodes your images in this browser. It does not upload the selected files to a server.
          The site itself loads Google Analytics and third-party ads, which may set cookies; read the{' '}
          <Link href="/privacy">privacy policy</Link> for details.
        </p>
        <p>
          Need to print an ID card instead?{' '}
          <Link href="/cnic-photocopy">Print CNIC front and back on one A4 page</Link>.
        </p>
      </section>

      <section id="image-faq" aria-labelledby="image-faq-title" className="scroll-mt-24 space-y-3">
        <h2 id="image-faq-title">Frequently asked questions</h2>
        <FaqList items={IMAGE_FAQ_ITEMS} />
      </section>
    </ContentSheet>
  );
}
