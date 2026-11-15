import type { ReactNode } from 'react';
import Link from 'next/link';

export default function MeetingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <nav
        aria-label="Meeting navigation"
        className="mb-8 flex flex-wrap gap-3 border-b border-amber-200 pb-4"
      >
        <Link
          href="/meetings"
          className="rounded-md px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-600"
        >
          All Meetings
        </Link>

        <Link
          href="/meetings/current"
          className="rounded-md px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-600"
        >
          Current Meeting
        </Link>
      </nav>

      {children}
    </div>
  );
}