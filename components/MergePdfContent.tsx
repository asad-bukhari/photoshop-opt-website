import { ContentSheet } from './ContentSheet';

export function MergePdfContent() {
  return (
    <ContentSheet>
      <section id="merge-order" aria-labelledby="merge-order-title" className="scroll-mt-24 space-y-3">
        <h2 id="merge-order-title">How the merge order works</h2>
        <p>
          Each file is added to the output in the order shown in the list. If you add a cover page PDF, a main document
          and an appendix PDF, put them in that order before merging.
        </p>
        <p>
          The list shows each file’s page count and size. Page thumbnails are not available in this version, so check
          the file names before merging. To reorder pages inside one PDF, split that file first.
        </p>
      </section>

      <section id="protected-pdfs" aria-labelledby="protected-pdfs-title" className="scroll-mt-24 space-y-3">
        <h2 id="protected-pdfs-title">Protected and broken PDFs</h2>
        <p>
          A password-protected PDF is skipped with a message. This tool does not guess passwords or remove protection.
          Open the file in the app that created it, save an unprotected copy, then add that copy.
        </p>
        <p>
          A file that is not a valid PDF is also reported and not added. Check that the download finished and that the
          file opens in a PDF viewer before you try again.
        </p>
      </section>

      <section id="large-pdfs" aria-labelledby="large-pdfs-title" className="scroll-mt-24 space-y-3">
        <h2 id="large-pdfs-title">Large PDFs and memory</h2>
        <p>
          The merge runs in your browser, one file at a time. A 50 MB scan or a large batch can take a while and use a
          lot of memory on an older phone. Keep the page open until the merge finishes, and download the result before
          closing the tab.
        </p>
      </section>

      <section id="merge-limits" aria-labelledby="merge-limits-title" className="scroll-mt-24 space-y-3">
        <h2 id="merge-limits-title">What this tool cannot do</h2>
        <ul>
          <li>It does not remove PDF passwords or encryption.</li>
          <li>It does not compress the merged file.</li>
          <li>It does not add bookmarks, page numbers or a table of contents.</li>
          <li>It does not show page thumbnails or let you reorder pages inside a file.</li>
          <li>It does not upload the files anywhere.</li>
        </ul>
      </section>
    </ContentSheet>
  );
}
