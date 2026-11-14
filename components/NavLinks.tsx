
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="border-b border-slate-200 bg-slate-50"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-6 py-3">
        {links.map((link) => {
          const isActive =
            link.href === '/'
              ? pathname === '/'
              : link.href === '/meetings'
                ? pathname === '/meetings'
                : pathname === '/meetings/current';

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? 'page' : undefined}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-amber-700 text-white'
                  : 'text-slate-700 hover:bg-amber-100'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
