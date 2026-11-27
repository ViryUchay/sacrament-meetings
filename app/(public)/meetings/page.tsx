
import Link from 'next/link';
import MeetingCard from '@/components/MeetingCard';
import { getMeetingsPage } from '@/lib/meetings-db';

const PAGE_SIZE = 5;

interface MeetingsPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function MeetingsPage({
  searchParams,
}: MeetingsPageProps) {
  const params = await searchParams;

  const search = (params.search ?? '').trim();
  const requestedPage = Number(params.page ?? '1');

  const page = Number.isInteger(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1;

  const result = await getMeetingsPage(search, page, PAGE_SIZE);

  const { meetings, totalCount, totalPages, currentPage } = result;

  function pageUrl(pageNumber: number) {
    const query = new URLSearchParams();

    if (search) {
      query.set('search', search);
    }

    query.set('page', String(pageNumber));

    return `/meetings?${query.toString()}`;
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
          Lagos Ward
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Sacrament Meeting Programs
        </h1>

        <p className="mt-3 max-w-2xl text-slate-600">
          Browse current and previous sacrament meeting programs,
          including hymns, prayers, announcements, and speakers.
        </p>
      </section>

      <section aria-label="Search meeting programs">
        <form action="/meetings" method="GET" className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="meeting-search" className="sr-only">
            Search meeting programs
          </label>

          <input
            id="meeting-search"
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Search dates, speakers, hymns, or meeting details..."
            className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200"
          />

          <button
            type="submit"
            className="rounded-lg bg-amber-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-800"
          >
            Search
          </button>

          {search && (
            <Link
              href="/meetings"
              className="rounded-lg border border-slate-300 px-6 py-3 text-center font-semibold text-slate-700 hover:bg-slate-100"
            >
              Clear
            </Link>
          )}
        </form>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-900">
            {search ? 'Search Results' : 'All Meeting Programs'}
          </h2>

          <p className="text-sm text-slate-600" aria-live="polite">
            {totalCount} {totalCount === 1 ? 'meeting' : 'meetings'} found
          </p>
        </div>

        {meetings.length > 0 ? (
          <div
            aria-label="Available sacrament meeting programs"
            className="grid gap-6 md:grid-cols-2"
          >
            {meetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-amber-200 bg-white p-6 text-slate-600">
            {search
              ? `No meeting programs matched "${search}". Try another search.`
              : 'No meeting programs are available yet.'}
          </p>
        )}
      </section>

      {totalPages > 1 && (
        <nav
          aria-label="Meeting results pagination"
          className="flex flex-wrap items-center justify-center gap-3 border-t border-slate-200 pt-6"
        >
          {currentPage > 1 ? (
            <Link
              href={pageUrl(currentPage - 1)}
              className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
            >
              Previous
            </Link>
          ) : (
            <span className="rounded-lg border border-slate-200 px-4 py-2 text-slate-400">
              Previous
            </span>
          )}

          <span className="px-3 text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </span>

          {currentPage < totalPages ? (
            <Link
              href={pageUrl(currentPage + 1)}
              className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
            >
              Next
            </Link>
          ) : (
            <span className="rounded-lg border border-slate-200 px-4 py-2 text-slate-400">
              Next
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
