
import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MeetingForm from '@/components/MeetingForm';
import { getMeetingById } from '@/lib/meetings-db';

interface EditMeetingPageProps {
  params: Promise<{ id: string }>;
}

function EditMeetingLoading() {
  return <p className="p-6 text-slate-600">Loading meeting editor...</p>;
}

async function EditMeetingContent({
  params,
}: EditMeetingPageProps) {
  const { id } = await params;
  const meetingId = Number(id);

  if (!Number.isInteger(meetingId) || meetingId <= 0) {
    notFound();
  }

  const meeting = getMeetingById(meetingId);

  if (!meeting) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/meetings/${meeting.id}`}
        className="font-semibold text-amber-800"
      >
        ← Back to Meeting
      </Link>

      <h1 className="text-3xl font-bold text-slate-900">
        Edit Meeting Program
      </h1>

      <MeetingForm meeting={meeting} />
    </div>
  );
}

export default function EditMeetingPage({
  params,
}: EditMeetingPageProps) {
  return (
    <Suspense fallback={<EditMeetingLoading />}>
      <EditMeetingContent params={params} />
    </Suspense>
  );
}
