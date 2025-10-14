'use client';

import { useState } from 'react';
import Link from 'next/link';

type Item = { label: string; href?: string };
type Section = { id: string; title: string; items: Item[] };

export default function AccordionNav({ sections }: { sections: Section[] }) {
  const [open, setOpen] = useState<string | null>(sections[0]?.id ?? null);

  return (
    <div className="rounded-2xl border bg-white overflow-hidden">
      {sections.map((s) => {
        const isOpen = open === s.id;
        return (
          <div key={s.id} className="border-b last:border-b-0">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : s.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
              aria-expanded={isOpen}
            >
              <span className="font-medium">{s.title}</span>
              <span className={`transition ${isOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 pt-1">
                <div className="flex flex-wrap gap-2">
                  {s.items.map((it) =>
                    it.href ? (
                      <Link
                        key={it.label}
                        href={it.href}
                        className="px-3 py-1 rounded-lg text-sm border bg-gray-50 hover:bg-gray-100"
                      >
                        {it.label}
                      </Link>
                    ) : (
                      <span
                        key={it.label}
                        className="px-3 py-1 rounded-lg text-sm border bg-gray-100 text-gray-500"
                      >
                        {it.label}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
