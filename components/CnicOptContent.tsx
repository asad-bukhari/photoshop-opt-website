import Link from 'next/link';
import { ContentSheet } from './ContentSheet';
import { FaqList } from './FaqList';
import { CNIC_FAQ_ITEMS } from '@/lib/data/initialData';

export function CnicOptContent() {
  return (
    <ContentSheet>
      <section id="how-to-print-cnic" aria-labelledby="how-to-print-cnic-title" className="scroll-mt-24 space-y-3">
        <h2 id="how-to-print-cnic-title">How to print CNIC front and back on A4</h2>
        <ol>
          <li>Add a photo or scan of the front and the back. Use the sample if you only want to try the layout.</li>
          <li>Keep A4 paper and the Centered stacked layout for a simple front-and-back sheet.</li>
          <li>Check the preview, keep the card scale at 100%, and add a purpose watermark if needed.</li>
          <li>Choose Print, Download PDF or Download PNG, then print at 100% scale.</li>
        </ol>
        <p>
          The sheet is a layout of the images you provide. It does not read, verify or validate the card itself.
        </p>
      </section>

      <section id="cnic-size" aria-labelledby="cnic-size-title" className="scroll-mt-24 space-y-3">
        <h2 id="cnic-size-title">CNIC photocopy size in mm, cm and inches</h2>
        <p>
          A Pakistani CNIC follows the ID-1 card format: 85.60 x 53.98 mm, or 8.56 x 5.40 cm, or about 3.37 x 2.13
          inches. The tool draws each card at about 84.7 x 53.3 mm (500 x 315 px at 150 DPI) on A4.
        </p>
        <h3>CNIC size in pixels at 150 DPI</h3>
        <p>
          At 150 DPI, the card frame is 500 x 315 px, which is about 84.7 x 53.3 mm. That is a close match to ID-1,
          not an exact millimetre-perfect reproduction.
        </p>
        <h3>Why the print scale matters</h3>
        <p>
          A printer setting such as &quot;fit to page&quot; or a reduced scale changes the card size on paper. Choose
          100% scale or actual size. The card scale slider in the tool changes the layout, so leave it at 100% unless
          you need a different size.
        </p>
        <h3>Check the size with a ruler</h3>
        <p>
          Measure the printed card before you submit it. If it is too large or too small, confirm the paper size and
          print scale, then print again.
        </p>
      </section>

      <section id="cnic-pdf" aria-labelledby="cnic-pdf-title" className="scroll-mt-24 space-y-3">
        <h2 id="cnic-pdf-title">CNIC front and back on one page as PDF</h2>
        <p>
          Download PDF builds a single-page PDF of the sheet. The Pakistani grid layout exports two pages: the sheet
          and a duplicate. PDF export loads jsPDF from cdnjs, so it needs a network connection.
        </p>
        <h3>Merge front and back into one PNG</h3>
        <p>
          Download PNG saves the whole sheet as one image with both sides. It is a good option for messaging apps or a
          form that accepts an image. The tool does not export the sheet as JPG.
        </p>
        <h3>Save the sheet as PDF</h3>
        <p>
          Use Download PDF when the form asks for a PDF or when you want a fixed page size. Check the downloaded file
          before you upload it.
        </p>
      </section>

      <section id="print-at-home" aria-labelledby="print-at-home-title" className="scroll-mt-24 space-y-3">
        <h2 id="print-at-home-title">Print CNIC on A4 at home</h2>
        <p>
          Select A4, print at 100% scale, and use plain paper. A colour print keeps the card artwork; the B&amp;W scan
          filter can save ink and make text stand out. Print one test sheet and measure it before printing several
          copies.
        </p>
      </section>

      <section id="copies" aria-labelledby="copies-title" className="scroll-mt-24 space-y-3">
        <h2 id="copies-title">Print 2 or 4 copies on one sheet</h2>
        <p>
          Dual copy places two complete front-and-back sets on the page. Quad copy places four sets. The Pakistani grid
          repeats rows of front and back cards to fill the page.
        </p>
        <h3>Dual copy</h3>
        <p>
          Use Dual copy when you need two copies of the same card on one sheet.
        </p>
        <h3>Quad copy</h3>
        <p>
          Use Quad copy when you need four copies. Check that the cards still fit on the paper at the current scale.
        </p>
        <h3>Pakistani grid layout</h3>
        <p>
          The grid fills the page with repeated rows and exports a two-page PDF. The PNG export shows the one sheet
          that is in the preview.
        </p>
      </section>

      <section id="watermark-purpose" aria-labelledby="watermark-purpose-title" className="scroll-mt-24 space-y-3">
        <h2 id="watermark-purpose-title">CNIC copy for a bank, visa or job form</h2>
        <p>
          A visible purpose label can discourage casual reuse. Turn on Purpose watermark, choose a preset such as FOR
          BANK ACCOUNT VERIFICATION ONLY, and set the opacity. The watermark is off by default and is drawn into the
          sheet before export.
        </p>
        <h3>Bank verification watermark</h3>
        <p>
          Use the bank preset when a bank asks for a copy for account verification. Ask the bank whether it accepts a
          watermarked copy before you submit one.
        </p>
        <h3>Visa and passport watermark</h3>
        <p>
          Use the visa and passport preset for an application copy. Check the receiving office&apos;s requirements; the
          watermark is a label, not a security feature.
        </p>
        <h3>Job application copy</h3>
        <p>
          Use the verification-only preset for a job form. A watermark discourages casual reuse but does not prevent
          copying or editing of the image.
        </p>
      </section>

      <section id="without-photoshop" aria-labelledby="without-photoshop-title" className="scroll-mt-24 space-y-3">
        <h2 id="without-photoshop-title">CNIC photocopy without Photoshop or Word</h2>
        <p>
          You do not need to install an image editor or build a table in Word. Load the two images, choose a layout, and
          print or save the sheet from the browser. The tool runs on a phone, tablet or desktop.
        </p>
        <h3>Use your phone</h3>
        <p>
          The upload and layout controls work in a mobile browser. Save the PDF or PNG and print it from your phone, or
          send the file to a print shop along with the 100% scale instruction.
        </p>
        <h3>No software install</h3>
        <p>
          The page loads in the browser. PDF export is the one feature that needs a network connection because it loads
          jsPDF from a CDN.
        </p>
        <h3>Works in the browser</h3>
        <p>
          The images are drawn into a canvas on your device. The tool does not upload the selected files to a server.
        </p>
      </section>

      <section id="improve-photo" aria-labelledby="improve-photo-title" className="scroll-mt-24 space-y-3">
        <h2 id="improve-photo-title">Improve a phone photo</h2>
        <p>
          The filters are B&amp;W scan, grayscale and color boost. They change contrast and colour; they do not
          straighten, crop or detect the card edges. If the photo is at an angle or has a lot of background, crop it in
          your phone editor first. The tool draws the whole image into a fixed card frame, which can stretch a
          non-standard aspect ratio.
        </p>
      </section>

      <section id="where-files-go" aria-labelledby="where-files-go-title" className="scroll-mt-24 space-y-3">
        <h2 id="where-files-go-title">Where your files go</h2>
        <p>
          The tool reads and draws the images in this browser and does not upload the selected files to a server. The
          site itself loads Google Analytics and third-party ads, which may set cookies; read the{' '}
          <Link href="/privacy">privacy policy</Link> for details.
        </p>
        <p>
          Zaibi Tools is not affiliated with NADRA. Use a copy only with lawful authority. Any ID-1-proportioned card,
          such as a driving licence or bank card, can be placed in the frames; check the printed size against the real
          card.
        </p>
        <p>
          Need to shrink a photo first?{' '}
          <Link href="/image-compressor">Compress an image to 20KB, 50KB or 100KB</Link>.
        </p>
      </section>

      <section id="cnic-faq" aria-labelledby="cnic-faq-title" className="scroll-mt-24 space-y-3">
        <h2 id="cnic-faq-title">Frequently asked questions</h2>
        <FaqList items={CNIC_FAQ_ITEMS} />
      </section>
    </ContentSheet>
  );
}
