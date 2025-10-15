// app/biology/science/page.tsx
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

type Deck = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  is_public: boolean;
};

const ORDER = ['Науки', 'Методы', 'Уровни организации', 'Признаки живого'] as const;

function labelFromTitle(title: string) {
  const raw = title.split('→').pop()?.trim() ?? title;
  // убираем возможные хвосты в скобках
  return raw.replace(/\s*\(.*\)\s*$/, '');
}

export const metadata = {
  title: 'Биология как наука — Kursbio',
  description: 'Темы: Науки, Методы, Уровни организации, Признаки живого.',
};

export default async function ScienceIndex() {
  // Берём все колоды внутри «Общая биология → Биология как наука»
  const { data } = await supabase
    .from('decks')
    .select('id, title, slug, description, is_public')
    .like('title', 'Общая биология → Биология как наука →%');

  const list: Deck[] = (data || [])
    .filter((d: any) => d.is_public)
    .sort((a: Deck, b: Deck) => {
      const la = labelFromTitle(a.title);
      const lb = labelFromTitle(b.title);
      const ia = ORDER.indexOf(la as any);
      const ib = ORDER.indexOf(lb as any);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return la.localeCompare(lb);
    });

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Биология как наука — темы</h1>

      {list.length === 0 && (
        <div className="text-gray-500">
          Пока пусто. Проверь, что колоды созданы и <i>is_public = true</i>.
        </div>
      )}

      {/* 1 колонка на мобиле, 2 на десктопе */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
        {list.map((d) => (
          <Link
            key={d.id}
            href={`/biology/science/${d.slug}`}
            className="
              w-full md:w-[90%] max-w-[460px]
              h-[40vh]
              rounded-2xl border bg-white shadow-sm hover:shadow-md
              transition-transform duration-300 hover:scale-[1.01]
              p-6 flex flex-col justify-center text-center
            "
          >
            <div className="text-base md:text-sm leading-tight font-medium">
              {labelFromTitle(d.title)}
            </div>
            <div className="text-sm md:text-xs text-gray-500 mt-2 leading-snug">
              {d.description || 'Открыть тему'}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
