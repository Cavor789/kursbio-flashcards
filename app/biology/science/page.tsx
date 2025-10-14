import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const ORDER = ['Науки', 'Методы', 'Уровни организации', 'Признаки живого'];

function labelFromTitle(title: string) {
  // часть после последней стрелки + убрать уточнение в скобках
  const raw = title.split('→').pop()?.trim() ?? title;
  return raw.replace(/\s*\(.*\)\s*$/, '');
}

export default async function ScienceIndex() {
  const { data } = await supabase
    .from('decks')
    .select('id, title, slug, description, is_public')
    .like('title', 'Общая биология → Биология как наука →%');

  const list = (data ?? [])
    .filter((d: any) => d.is_public)
    .sort((a: any, b: any) => {
      const la = labelFromTitle(a.title);
      const lb = labelFromTitle(b.title);
      const ia = ORDER.indexOf(la);
      const ib = ORDER.indexOf(lb);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return la.localeCompare(lb, 'ru');
    });

  return (
    <section className="space-y-6">
      {/* Хлебные крошки */}
      <div className="text-sm text-gray-600 flex flex-wrap gap-1">
        <Link href="/cards" prefetch={false} className="hover:underline text-[#736ecc]">
          Карточки
        </Link>
        <span className="text-gray-400">/</span>
        <Link href="/biology" prefetch={false} className="hover:underline text-[#736ecc]">
          Общая биология
        </Link>
        <span className="text-gray-400">/</span>
        <span className="font-medium">Биология как наука</span>
      </div>

      <h1 className="text-2xl font-semibold">Биология как наука - темы</h1>

      {/* Раскрывающийся навигатор */}
      <details className="rounded-2xl border p-4 bg-white">
        <summary className="cursor-pointer select-none text-base font-medium">
          Навигация по разделам
        </summary>
        <div className="mt-3 text-sm">
          <div className="text-gray-500">Общая биология</div>
          <div className="ml-3">
            <Link href="/biology" prefetch={false} className="text-[#736ecc] hover:underline">
              Биология как наука
            </Link>
            <div className="mt-2 flex flex-wrap gap-2">
              {list.map((d: any) => (
                <Link
                  key={d.id}
                  href={`/biology/science/${d.slug}`}
                  prefetch={false}
                  className="px-3 py-1 rounded-lg text-sm border bg-gray-50 hover:bg-gray-100"
                >
                  {labelFromTitle(d.title)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </details>

      {/* Плитки 4 тем */}
      {list.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {list.map((d: any) => (
            <Link
              key={d.id}
              href={`/biology/science/${d.slug}`}
              prefetch={false}
              className="block p-5 rounded-2xl border hover:shadow bg-white"
            >
              <div className="text-lg font-medium">{labelFromTitle(d.title)}</div>
              <div className="text-sm text-gray-500 mt-1">
                {d.description || 'Открыть колоду'}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">Темы пока не опубликованы.</div>
      )}

      {/* Кнопка назад */}
      <div className="mt-6">
        <Link
          href="/biology"
          prefetch={false}
          className="inline-block px-4 py-2 rounded-xl border border-[#736ecc] text-[#736ecc] hover:bg-[#736ecc] hover:text-white transition"
        >
          ← Назад к разделу «Общая биология»
        </Link>
      </div>
    </section>
  );
}
