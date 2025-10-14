'use client';
import Link from 'next/link';

export default function DeckHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
      <div className="text-sm text-gray-500 mb-1">{subtitle}</div>
      <h1 className="text-xl font-semibold">{title}</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href="https://t.me/kursbio/11017"
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary"
        >
          Забрать конспект
        </a>
        <a
          href="https://kursbio.com/godege"
          target="_blank"
          rel="noreferrer"
          className="btn btn-white"
        >
          Записаться на годовой курс
        </a>
        <a
          href="https://kursbio.com/book"
          target="_blank"
          rel="noreferrer"
          className="btn btn-white"
        >
          Приобрести конспекты
        </a>
      </div>
    </div>
  );
}
