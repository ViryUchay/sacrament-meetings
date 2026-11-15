
import Link from 'next/link';
import type { SacramentMeeting } from '@/lib/types';

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const formattedDate = new Date(
    `${meeting.date}T12:00:00`
  ).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="rounded-xl border border-amber-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold capitalize text-amber-800">
          {meeting.meetingType} meeting
        </span>

        <span className="text-sm text-slate-500">
          Meeting #{meeting.id}
        </span>
      </div>

      <h2 className="mt-4 text-xl font-bold text-slate-900">
        {formattedDate}
      </h2>

      <div className="mt-3 space-y-1 text-sm text-slate-600">
        <p>
          <strong>Presiding:</strong> {meeting.presiding}
        </p>

        <p>
          <strong>Conducting:</strong> {meeting.conducting}
        </p>

        <p>
          <strong>Speakers and musical numbers:</strong>{' '}
          {meeting.speakers.length}
        </p>
      </div>

      <Link
       prefetch={false}
  href={`/meetings/${meeting.id}`}
        className="mt-5 inline-flex rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
      >
        View Meeting Program
      </Link>
    </article>
  );
}
