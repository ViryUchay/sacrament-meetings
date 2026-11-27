
import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import PrintButton from '@/components/PrintButton';
import DeleteMeetingButton from '@/components/DeleteMeetingButton';
import { getMeetingById } from '@/lib/meetings-db';

interface MeetingPageProps {
  params: Promise<{ id: string }>;
}

function MeetingLoading() {
  return <p className="p-6 text-slate-600">Loading meeting program...</p>;
}

async function MeetingContent({ params }: MeetingPageProps) {
  const { id } = await params;
  const meetingId = Number(id);

  if (!Number.isInteger(meetingId) || meetingId <= 0) {
    notFound();
  }

  const meeting = await getMeetingById(meetingId);

  if (!meeting) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/meetings"
        className="inline-flex rounded-md px-3 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100"
      >
        ← Back to All Meetings
      </Link>

      <MeetingDetail meeting={meeting} />

      <div className="flex flex-wrap justify-center gap-3 print:hidden">
        <Link
          href={`/meetings/${meeting.id}/edit`}
          className="rounded-lg bg-amber-700 px-5 py-3 font-semibold text-white hover:bg-amber-800"
        >
          Edit Meeting
        </Link>

        <DeleteMeetingButton meetingId={meeting.id} />
      </div>

      <div className="text-center print:hidden">
        <PrintButton />
      </div>
    </div>
  );
}

export default function MeetingPage({ params }: MeetingPageProps) {
  return (
    <Suspense fallback={<MeetingLoading />}>
      <MeetingContent params={params} />
    </Suspense>
  );
}
