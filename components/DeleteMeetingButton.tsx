
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteMeetingButtonProps {
  meetingId: number;
}

export default function DeleteMeetingButton({
  meetingId,
}: DeleteMeetingButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  async function handleDelete() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this meeting program?'
    );

    if (!confirmed) return;

    setDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/meetings/${meetingId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Unable to delete meeting.');
      }

      router.push('/meetings');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to delete meeting.'
      );
      setDeleting(false);
    }
  }

  return (
    <div className="text-center">
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="rounded-lg bg-red-700 px-5 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-60"
      >
        {deleting ? 'Deleting...' : 'Delete Meeting'}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
