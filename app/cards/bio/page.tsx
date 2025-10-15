// app/cards/bio/page.tsx
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
  return raw.replace(/\s*\(.*\)\s*$/, '');
}

export default async function BioCardsPage() {
  // грузим прямо на сервере — без useEffect
  const { data, error } = await supabase
    .from('decks')
    .select('id,title,slug,description,is_public')
    .like('title', 'Общая биология → Биология как наука →%');

  const all: Deck[] = (data || [])
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

  if (error) {
    // безопасная заглушка вместо «белого экрана»
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">Биология как наука — темы</h1>
        <div className="rounded-xl border bg-white p-4 text-sm text-red-600">
          Не удалось загрузить темы. Попробуйте обновить страницу.
        </div>
      </section>
    );
  }

  const topics = ORDER.filter((t) => all.some((d) => labelFromTitle(d.title) === t));

  return (
    <section className="space-y-6">
      {/* крошки — без ссылок, чтобы точно ничего не падало */}
      <div className="text-sm text-gray-600">
        <span className="font-medium">Карточки</span>
        <span className="text-gray-400"> / </span>
        <span className="text-[#736ecc]">Общая биология</span>
      </div>

      <h1 className="text-2xl font-semibold">Биология как наука — темы</h1>

      {/* Фильтры по наличию (без client state) */}
      {topics.length > 0 && (
        <div className="rounded-2xl border bg-white p-4">
          <div className="text-sm text-gray-500">Выберите тему</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {topics.map((t) => (
              <a
                key={t}
                href={`#${encodeURIComponent(t)}`}
                className="px-3 py-1 rounded-lg text-sm border bg-gray-100 hover:bg-gray-200"
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* плитки тем: 1 колонка мобилы / 3 на десктопе */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
        {all.length === 0 && (
          <div className="text-gray-500">Нет тем.</div>
        )}

        {all.map((d) => (
          <Link
            key={d.id}
            href={`/biology/science/${d.slug}`}
            className="
              w-full md:w-[90%] max-w-[460px]
              h-[40vh]
              rounded-2xl border hover:shadow bg-white
              transition-transform duration-300 hover:scale-[1.01]
              p-6 flex flex-col justify-center text-center
            "
          >
            <div id={encodeURIComponent(labelFromTitle(d.title))} className="text-base md:text-sm leading-tight font-medium">
              {labelFromTitle(d.title)}
            </div>
            <div className="text-sm md:text-xs text-gray-500 mt-2 leading-snug">
              {d.description || 'Открыть колоду'}
            </div>
          </Link>
        ))}
      </section>
    </section>
  );
}
