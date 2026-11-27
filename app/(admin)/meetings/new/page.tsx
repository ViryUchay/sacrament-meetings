
import MeetingForm from '@/components/MeetingForm';

export default function NewMeetingPage() {
  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
          Lagos Ward
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Create Meeting Program
        </h1>

        <p className="mt-3 text-slate-600">
          Enter the details for the new sacrament meeting.
        </p>
      </section>

      <MeetingForm />
    </div>
  );
}
