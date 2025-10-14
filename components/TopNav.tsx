'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TopNav({ section, topic }:{
  section?: string|null; topic?: string|null
}) {
  const r = useRouter();
  return (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <button onClick={() => r.back()} className="btn btn-ghost">← Назад</button>
        <Link href="/" className="text-sm text-gray-600 hover:underline">Все колоды</Link>
        <span className="text-gray-400">/</span>
        <Link href="/biology/science" className="text-sm text-gray-600 hover:underline">
          Общая биология / Биология как наука
        </Link>
        {topic && (
          <>
            <span className="text-gray-400">/</span>
            <span className="text-sm font-medium">{topic}</span>
          </>
        )}
      </div>
    </div>
  );
}
