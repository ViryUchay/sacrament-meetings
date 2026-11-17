import MeetingCard from '@/components/MeetingCard';
import { getMeetings } from '@/lib/meetings-db';

export default async function MeetingsPage() {
  const meetings = await getMeetings();

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

      {meetings.length > 0 ? (
        <section
          aria-label="Available sacrament meeting programs"
          className="grid gap-6 md:grid-cols-2"
        >
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </section>
      ) : (
        <p className="rounded-lg border border-amber-200 bg-white p-6 text-slate-600">
          No meeting programs are available yet.
        </p>
      )}
    </div>
  );
}