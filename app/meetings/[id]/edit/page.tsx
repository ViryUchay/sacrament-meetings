import { connection } from 'next/server';
import { notFound } from 'next/navigation';
import { getMeetingById } from '@/lib/meetings-db';
import MeetingForm from '@/components/MeetingForm';

interface EditMeetingPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMeetingPage({
  params,
}: EditMeetingPageProps) {
  await connection();

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
      <h1 className="text-3xl font-bold text-slate-900">
        Edit Meeting Program
      </h1>
      <MeetingForm meeting={meeting} />
    </div>
  );
}
