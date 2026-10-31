"use client";

/** Opens the browser's print dialog, where "Save as PDF" gives a clean copy of the CV. */
export function PrintButton() {
  return (
    <button type="button" className="button printButton" onClick={() => window.print()}>
      Print or save as PDF
    </button>
  );
}
