
'use client';

import { useEffect, useState } from 'react';

export default function Header() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  }, []);

  return (
    <header className="border-b border-amber-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 px-6 py-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
            The Church of Jesus Christ of Latter-day Saints
          </p>

          <h1 className="text-2xl font-bold text-slate-900">
            Sacrament Meeting Planner
          </h1>

          <p className="text-sm text-slate-600">Lagos Ward</p>
        </div>

        <p className="text-sm text-slate-600" aria-live="polite">
          {currentDate}
        </p>
      </div>
    </header>
  );
}
