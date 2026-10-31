import { ContentSheet } from './ContentSheet';

export function SplitPdfContent() {
  return (
    <ContentSheet>
      <section id="split-modes" aria-labelledby="split-modes-title" className="scroll-mt-24 space-y-3">
        <h2 id="split-modes-title">Extract pages or split every N pages</h2>
        <p>
          Extract mode writes the pages you select into one new PDF. It is useful for pulling a signed page, an
          appendix or a single form out of a longer document.
        </p>
        <p>
          Every-N mode cuts the whole PDF into smaller files. A 10-page PDF split every 3 pages gives files with 3, 3,
          3 and 1 pages. The original file is never changed.
        </p>
      </section>

      <section id="page-range-syntax" aria-labelledby="page-range-syntax-title" className="scroll-mt-24 space-y-3">
        <h2 id="page-range-syntax-title">Page range syntax</h2>
        <p>
          Separate entries with commas and use a hyphen for a range: <strong>1-3, 5, 8-10</strong>. Spaces around the
          hyphen and comma are ignored. A reversed range such as 8-3 is rejected with a suggested correction.
        </p>
        <p>
          Pages outside the document are rejected, and duplicate pages are removed. The new PDF follows the order you
          enter, so 3, 1 puts page 3 before page 1.
        </p>
      </section>

      <section id="split-protected" aria-labelledby="split-protected-title" className="scroll-mt-24 space-y-3">
        <h2 id="split-protected-title">Protected and broken PDFs</h2>
        <p>
          A password-protected PDF is skipped. The tool does not crack or remove passwords. Save an unprotected copy in
          the app that created it, then add that copy. A broken file is reported and no output is produced.
        </p>
      </section>

      <section id="split-limits" aria-labelledby="split-limits-title" className="scroll-mt-24 space-y-3">
        <h2 id="split-limits-title">What this tool cannot do</h2>
        <ul>
          <li>It does not create a ZIP; multiple outputs download one at a time.</li>
          <li>It does not remove PDF passwords or encryption.</li>
          <li>It does not compress the output or reduce image quality.</li>
          <li>It does not show page thumbnails; it lists page counts instead.</li>
          <li>It does not change the original PDF.</li>
        </ul>
      </section>
    </ContentSheet>
  );
}
