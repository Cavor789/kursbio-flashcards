import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const ORDER = ['Науки', 'Методы', 'Уровни организации', 'Признаки живого'];

function titleToLabel(title: string) {
  // берём часть после последней стрелки и убираем скобки
  const raw = title.split('→').pop()?.trim() ?? title;
  return raw.replace(/\s*\(.*\)\s*$/, '');
}

export default async function ScienceIndex() {
  const { data } = await supabase
    .from('decks')
    .select('id, title, slug, description, is_public')
    .like('title', 'Общая биология → Биология как наука →%');

  const list = (data || [])
    .filter((d: any) => d.is_public)
    .sort((a: any, b: any) => {
      const la = titleToLabel(a.title);
      const lb = titleToLabel(b.title);
      const ia = ORDER.indexOf(la);
      const ib = ORDER.indexOf(lb);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return la.localeCompare(lb);
    });

  return (
    <section className="space-y-6">
      <div className="text-sm text-gray-600">
        <Link href="/cards" className="hover:underline">Карточки</Link>
        <span className="text-gray-400"> / </span>
        <Link href="/biology" className="hover:underline">Общая биология</Link>
        <span className="text-gray-400"> / </span>
        <span className="font-medium">Биология как наука</span>
      </div>

      <h1 className="text-2xl font-semibold">Биология как наука — темы</h1>

      {/* Раскрывающийся навигатор */}
      <details className="rounded-2xl border p-4 bg-white">
        <summary className="cursor-pointer select-none text-base font-medium">
          Навигация по разделам
        </summary>
        <div className="mt-3 text-sm">
          <div className="text-gray-500">Общая биология</div>
          <div className="ml-3">
            <Link href="/biology" className="text-[#736ecc] hover:underline">Биология как наука</Link>
            <div className="mt-2 flex flex-wrap gap-2">
              {list.map((d: any) => (
                <Link
                  key={d.id}
                  href={`/biology/science/${d.slug}`}
                  className="px-3 py-1 rounded-lg text-sm border bg-gray-50 hover:bg-gray-100"
                >
                  {titleToLabel(d.title)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </details>

      {/* Плитки 4 тем */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {list.map((d: any) => (
          <Link
            key={d.id}
            href={`/biology/science/${d.slug}`}
            className="block p-5 rounded-2xl border hover:shadow bg-white"
          >
            <div className="text-lg font-medium">{titleToLabel(d.title)}</div>
            <div className="text-sm text-gray-500 mt-1">{d.description || 'Открыть колоду'}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
