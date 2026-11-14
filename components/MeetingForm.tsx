
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SacramentMeeting } from '@/lib/types';

interface MeetingFormProps {
  meeting?: SacramentMeeting;
}

export default function MeetingForm({ meeting }: MeetingFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');

    const formData = new FormData(event.currentTarget);

    const speakers = String(formData.get('speakers') || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, topic, type] = line.split('|').map((item) => item.trim());

        return {
          name,
          topic,
          type: type === 'musical-number' ? 'musical-number' as const : 'speaker' as const,
        };
      });

    const wardBusiness = String(formData.get('wardBusiness') || '')
      .split('\n')
      .map((description) => description.trim())
      .filter(Boolean)
      .map((description) => ({ description }));

    const announcements = String(formData.get('announcements') || '')
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    const data = {
      date: String(formData.get('date')),
      meetingType: String(formData.get('meetingType')) as SacramentMeeting['meetingType'],
      presiding: String(formData.get('presiding')).trim(),
      conducting: String(formData.get('conducting')).trim(),
      announcements,
      openingHymn: {
        number: Number(formData.get('openingHymnNumber')),
        title: String(formData.get('openingHymnTitle')).trim(),
      },
      openingPrayer: String(formData.get('openingPrayer')).trim(),
      wardBusiness,
      stakeBusiness: formData.get('stakeBusiness') === 'on',
      sacramentHymn: {
        number: Number(formData.get('sacramentHymnNumber')),
        title: String(formData.get('sacramentHymnTitle')).trim(),
      },
      speakers,
      closingHymn: {
        number: Number(formData.get('closingHymnNumber')),
        title: String(formData.get('closingHymnTitle')).trim(),
      },
      closingPrayer: String(formData.get('closingPrayer')).trim(),
    };

    if (speakers.some((speaker) => !speaker.name || !speaker.topic)) {
      setError('Enter each speaker as Name | Topic | speaker, or Name | Topic | musical-number.');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(
        meeting ? `/api/meetings/${meeting.id}` : '/api/meetings',
        {
          method: meeting ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Unable to save meeting.');
      }

      const savedMeeting = result.meeting as SacramentMeeting;

      if (!savedMeeting?.id) {
        throw new Error('The server did not return the saved meeting ID.');
      }

      router.push(`/meetings/${savedMeeting.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setSaving(false);
    }
  }

  const inputClass =
    'w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-600';

  function field(label: string, name: string, defaultValue = '', type = 'text') {
    return (
      <label className="block space-y-1">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <input
          className={inputClass}
          type={type}
          name={name}
          defaultValue={defaultValue}
          required
        />
      </label>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-amber-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        {field('Meeting date', 'date', meeting?.date || '2026-11-15', 'date')}

        <label className="block space-y-1">
          <span className="text-sm font-semibold text-slate-700">Meeting type</span>
          <select
            name="meetingType"
            defaultValue={meeting?.meetingType || 'regular'}
            className={inputClass}
          >
            <option value="regular">Regular</option>
            <option value="testimony">Testimony</option>
            <option value="stake">Stake</option>
            <option value="general">General</option>
          </select>
        </label>

        {field('Presiding', 'presiding', meeting?.presiding || '')}
        {field('Conducting', 'conducting', meeting?.conducting || '')}
        {field('Opening hymn number', 'openingHymnNumber', String(meeting?.openingHymn.number ?? 2), 'number')}
        {field('Opening hymn title', 'openingHymnTitle', meeting?.openingHymn.title || '')}
        {field('Opening prayer', 'openingPrayer', meeting?.openingPrayer || '')}
        {field('Sacrament hymn number', 'sacramentHymnNumber', String(meeting?.sacramentHymn.number ?? 169), 'number')}
        {field('Sacrament hymn title', 'sacramentHymnTitle', meeting?.sacramentHymn.title || '')}
        {field('Closing hymn number', 'closingHymnNumber', String(meeting?.closingHymn.number ?? 30), 'number')}
        {field('Closing hymn title', 'closingHymnTitle', meeting?.closingHymn.title || '')}
        {field('Closing prayer', 'closingPrayer', meeting?.closingPrayer || '')}
      </div>

      <label className="block space-y-1">
        <span className="text-sm font-semibold text-slate-700">Announcements (one per line)</span>
        <textarea
          name="announcements"
          rows={3}
          defaultValue={meeting?.announcements?.join('\n') || ''}
          className={inputClass}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-semibold text-slate-700">Ward business (one item per line)</span>
        <textarea
          name="wardBusiness"
          rows={3}
          defaultValue={meeting?.wardBusiness.map((item) => item.description).join('\n') || ''}
          className={inputClass}
        />
      </label>

      <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
        <input
          type="checkbox"
          name="stakeBusiness"
          defaultChecked={meeting?.stakeBusiness || false}
          className="h-4 w-4"
        />
        Include stake business
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-semibold text-slate-700">Speakers and musical numbers</span>
        <textarea
          name="speakers"
          rows={5}
          placeholder={'Brother John | Faith in Jesus Christ | speaker\nWard Choir | Musical Selection | musical-number'}
          defaultValue={meeting?.speakers.map((speaker) => `${speaker.name} | ${speaker.topic} | ${speaker.type}`).join('\n') || ''}
          className={inputClass}
        />
      </label>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-amber-800 px-6 py-3 font-semibold text-white hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? 'Saving...' : meeting ? 'Update Meeting' : 'Save Meeting'}
      </button>
    </form>
  );
}
