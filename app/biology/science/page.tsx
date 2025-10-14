// app/biology/science/page.tsx
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import TopNav from '@/components/TopNav';

export const dynamic = 'force-dynamic';

// порядок отображения тем
const ORDER = ['Науки', 'Методы', 'Уровни организации', 'Признаки живого'];

function topicFromTitle(title: string) {
  const raw = title.split('→').pop()?.trim() ?? title.trim();
  return raw.replace(/\s*\(.*\)\s*$/, '');
}

export default async function ScienceIndex() {
  const { data: decks } = await supabase
    .from('decks')
    .select('id, title, slug, description, is_public')
    .like('title', 'Общая биология → Биология как наука →%');

  const list = (decks || [])
    .filter((d: any) => d.is_public)
    .sort((a: any, b: any) => {
      const ta = topicFromTitle(a.title);
      const tb = topicFromTitle(b.title);
      const ia = ORDER.indexOf(ta);
      const ib = ORDER.indexOf(tb);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return ta.localeCompare(tb);
    });

  return (
    <main>
      <TopNav />
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Хлебные крошки */}
        <div className="text-sm text-gray-600">
          <Link href="/" className="hover:underline">Колоды</Link>
          <span className="text-gray-400"> / </span>
          <Link href="/biology" className="hover:underline">Общая биология</Link>
          <span className="text-gray-400"> / </span>
          <span className="font-medium">Биология как наука</span>
        </div>

        <h1 className="text-2xl font-semibold">Биология как наука — темы</h1>

        {/* РАСКРЫВАЮЩИЙСЯ СПИСОК НАВЕРХУ */}
        <details className="rounded-2xl border p-4 bg-white">
          <summary className="cursor-pointer select-none text-base font-medium">
            Навигация по разделам
          </summary>
          <div className="mt-3 space-y-2">
            <div className="text-sm text-gray-500">Общая биология</div>
            <div className="ml-3">
              <Link href="/biology" className="text-[#736ecc] hover:underline">
                Биология как наука
              </Link>
              <div className="mt-2 flex flex-wrap gap-2">
                {list.map((d: any) => {
                  const label = topicFromTitle(d.title);
                  return (
                    <Link
                      key={d.id}
                      href={`/biology/science/${d.slug}`}
                      className="px-3 py-1 rounded-lg text-sm border bg-gray-50 hover:bg-gray-100"
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </details>

        {/* Плитки тем */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {list.map((d: any) => {
            const label = topicFromTitle(d.title);
            return (
              <Link
                key={d.id}
                href={`/biology/science/${d.slug}`}
                className="block p-5 rounded-2xl border hover:shadow"
              >
                <div className="text-lg font-medium">{label}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {d.description || 'Открыть колоду'}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
