
'use client';

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-lg bg-amber-800 px-6 py-3 font-semibold text-white hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
    >
      Print Meeting Program
    </button>
  );
}
