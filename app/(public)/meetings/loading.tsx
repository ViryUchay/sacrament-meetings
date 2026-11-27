export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-64 items-center justify-center"
    >
      <div className="text-center">
        <div
          className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-800"
          aria-hidden="true"
        />

        <p className="mt-4 font-medium text-slate-700">
          Loading meeting programs...
        </p>
      </div>
    </div>
  );
}