
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-amber-100 px-6 py-12 text-center sm:px-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-800">
          Welcome to Lagos Ward
        </p>

        <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-5xl">
          Sacrament Meeting Planner
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-700">
          Organize, view, and manage sacrament meeting programs.
          Find meeting schedules, hymns, prayers, announcements,
          speakers, and other program details in one place.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/meetings"
            className="rounded-lg bg-amber-800 px-6 py-3 font-semibold text-white hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
          >
            View All Meetings
          </Link>

          <Link
            href="/meetings/current"
            className="rounded-lg border border-amber-800 px-6 py-3 font-semibold text-amber-900 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
          >
            Current Meeting
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900">
          About the Planner
        </h2>

        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          This application provides an organized way to prepare
          and review sacrament meeting programs. Members can view
          meeting information, including opening and closing hymns,
          prayers, ward business, sacrament hymns, speakers, and
          musical numbers.
        </p>
      </section>

      <section className="grid gap-5 sm:grid-cols-3">
        <article className="rounded-xl border border-amber-200 bg-white p-6">
          <h3 className="text-lg font-bold text-slate-900">
            Meeting Schedules
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Browse current and previous meeting programs.
          </p>
        </article>

        <article className="rounded-xl border border-amber-200 bg-white p-6">
          <h3 className="text-lg font-bold text-slate-900">
            Program Details
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Review hymns, prayers, announcements, and speakers.
          </p>
        </article>

        <article className="rounded-xl border border-amber-200 bg-white p-6">
          <h3 className="text-lg font-bold text-slate-900">
            Easy Access
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Navigate meeting programs from any supported device.
          </p>
        </article>
      </section>
    </div>
  );
}
