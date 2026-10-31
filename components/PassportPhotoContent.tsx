import { ContentSheet } from './ContentSheet';

export function PassportPhotoContent() {
  return (
    <ContentSheet>
      <section id="passport-sizes" aria-labelledby="passport-sizes-title" className="scroll-mt-24 space-y-3">
        <h2 id="passport-sizes-title">Passport photo sizes</h2>
        <p>
          The tool offers 35 x 45 mm, 2 x 2 inch and a custom size in millimetres. A 35 x 45 mm photo at 300 DPI is
          about 413 x 531 pixels; the sheet is built at that resolution so the printed copy has enough detail.
        </p>
        <p>
          These are common sizes, not a claim about a particular embassy, exam or portal. Use the exact size named on
          the form you are completing.
        </p>
      </section>

      <section id="passport-paper" aria-labelledby="passport-paper-title" className="scroll-mt-24 space-y-3">
        <h2 id="passport-paper-title">Paper sizes and copies</h2>
        <p>
          Choose 4 x 6 inch for a photo-lab print, or A4, Letter or 3R for a home printer. The tool calculates how many
          identical photos fit after the gap and page margin, and centres partial rows.
        </p>
        <p>
          Fill the sheet to use every slot, or choose a smaller number. Thin cut lines are optional and are drawn
          lightly so they can be trimmed away.
        </p>
      </section>

      <section id="passport-print" aria-labelledby="passport-print-title" className="scroll-mt-24 space-y-3">
        <h2 id="passport-print-title">Print at 100% scale</h2>
        <p>
          In the print dialog choose 100% or actual size, not “fit to page”. The PDF page matches the paper you chose.
          Print one sheet and measure a photo with a ruler before printing several copies.
        </p>
        <p>
          Exports are rendered at 300 DPI. If the larger canvas fails on a low-memory phone, the tool falls back to 200
          DPI and says so before you download.
        </p>
      </section>

      <section id="passport-limits" aria-labelledby="passport-limits-title" className="scroll-mt-24 space-y-3">
        <h2 id="passport-limits-title">What this tool cannot do</h2>
        <ul>
          <li>It does not remove or replace the background.</li>
          <li>It does not straighten a tilted photo or edit the face.</li>
          <li>It does not guarantee that a portal or embassy will accept the photo.</li>
          <li>It does not change the original photo file.</li>
          <li>It does not upload the photo anywhere.</li>
        </ul>
      </section>
    </ContentSheet>
  );
}
