
import type { SacramentMeeting } from '@/lib/types';

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  const formattedDate = new Date(
    `${meeting.date}T12:00:00`
  ).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="mx-auto max-w-4xl rounded-xl border border-amber-200 bg-white p-6 shadow-sm sm:p-10">
      <header className="border-b border-amber-200 pb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
          The Church of Jesus Christ of Latter-day Saints
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Sacrament Meeting
        </h1>

        <p className="mt-2 text-slate-600">Lagos Ward</p>

        <p className="mt-1 font-medium text-slate-700">
          {formattedDate}
        </p>

        <p className="mt-2 text-sm capitalize text-amber-800">
          {meeting.meetingType} meeting
        </p>
      </header>

      <section className="grid gap-4 border-b border-slate-200 py-6 sm:grid-cols-2">
        <p><strong>Presiding:</strong> {meeting.presiding}</p>
        <p><strong>Conducting:</strong> {meeting.conducting}</p>
      </section>

      {meeting.announcements && meeting.announcements.length > 0 && (
        <section className="border-b border-slate-200 py-6">
          <h2 className="text-xl font-bold text-slate-900">
            Announcements
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
            {meeting.announcements.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="border-b border-slate-200 py-6">
        <h2 className="text-xl font-bold text-slate-900">
          Opening Hymn
        </h2>
        <p className="mt-2 text-slate-700">
          Hymn #{meeting.openingHymn.number}: {meeting.openingHymn.title}
        </p>

        <h2 className="mt-5 text-lg font-bold text-slate-900">
          Opening Prayer
        </h2>
        <p className="mt-2 text-slate-700">{meeting.openingPrayer}</p>
      </section>

      {meeting.wardBusiness.length > 0 && (
        <section className="border-b border-slate-200 py-6">
          <h2 className="text-xl font-bold text-slate-900">
            Ward Business
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
            {meeting.wardBusiness.map((item, index) => (
              <li key={index}>{item.description}</li>
            ))}
          </ul>
        </section>
      )}

      {meeting.stakeBusiness && (
        <section className="border-b border-slate-200 py-6">
          <h2 className="text-xl font-bold text-slate-900">
            Stake Business
          </h2>
          <p className="mt-2 text-slate-700">
            Stake business and announcements are included in this meeting.
          </p>
        </section>
      )}

      <section className="border-b border-slate-200 py-6">
        <h2 className="text-xl font-bold text-slate-900">
          Sacrament Hymn
        </h2>
        <p className="mt-2 text-slate-700">
          Hymn #{meeting.sacramentHymn.number}: {meeting.sacramentHymn.title}
        </p>
      </section>

      <section className="border-b border-slate-200 py-6">
        <h2 className="text-xl font-bold text-slate-900">
          Speakers and Musical Numbers
        </h2>

        <div className="mt-3 space-y-4">
          {meeting.speakers.map((item, index) => (
            <div key={index}>
              <p className="font-semibold text-slate-800">
                {item.name}
              </p>
              <p className="text-sm capitalize text-slate-600">
                {item.type === 'musical-number'
                  ? 'Musical Number'
                  : 'Speaker'}
                {' — '}
                {item.topic}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-slate-200 py-6">
        <h2 className="text-xl font-bold text-slate-900">
          Closing Hymn
        </h2>
        <p className="mt-2 text-slate-700">
          Hymn #{meeting.closingHymn.number}: {meeting.closingHymn.title}
        </p>

        <h2 className="mt-5 text-lg font-bold text-slate-900">
          Closing Prayer
        </h2>
        <p className="mt-2 text-slate-700">{meeting.closingPrayer}</p>
      </section>

      <footer className="pt-6 text-center text-sm text-slate-500">
        Thank you for attending sacrament meeting.
      </footer>
    </article>
  );
}
