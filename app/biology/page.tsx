import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// порядок тем
const ORDER = ['Науки', 'Методы', 'Уровни организации', 'Признаки живого'];

function topicFromTitle(title: string) {
  const parts = title.split('→');
  const raw = parts[parts.length - 1].trim();
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
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-sm text-gray-600">
        <Link href="/" className="hover:underline">Главная</Link>
        <span className="text-gray-400"> / </span>
        <span className="font-medium">Биология как наука — темы</span>
      </div>

      <h1 className="text-2xl font-semibold">Биология как наука — темы</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {list.map((d: any) => {
          const label = topicFromTitle(d.title);
          return (
            <Link
              key={d.id}
              href={`/biology/science/${d.slug}`}
              className="p-5 rounded-2xl border hover:shadow block"
            >
              <div className="text-lg font-medium">{label}</div>
              <div className="text-sm text-gray-500 mt-1">
                {d.description || 'Открыть колоду'}
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
