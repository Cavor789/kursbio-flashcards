'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

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

export default function BioCardsPage() {
  const [all, setAll] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState<string | null>(null);

  // загрузка 4 тем биологии как науки
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('decks')
        .select('id,title,slug,description,is_public')
        .like('title', 'Общая биология → Биология как наука →%');

      const list = (data || [])
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

      setAll(list);
      setLoading(false);
    })();
  }, []);

  const topics = ORDER.filter(t => all.some(d => labelFromTitle(d.title) === t));
  const filtered = topic ? all.filter(d => labelFromTitle(d.title) === topic) : all;

  function reset() {
    setTopic(null);
  }

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      {/* хлебные крошки */}
      <div className="text-sm text-gray-600">
        <span className="font-medium">Карточки</span>
        <span className="text-gray-400"> / </span>
        <span className="hover:underline text-[#736ecc]">Общая биология</span>
      </div>

      <h1 className="text-2xl font-semibold">Биология как наука — темы</h1>

      {/* фильтры */}
      <div className="card">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <div className="text-lg font-semibold">Общая биология / Биология как наука</div>
            <div className="text-sm text-gray-500">Выберите тему</div>
          </div>
          <button className="btn btn-ghost text-sm" onClick={reset} disabled={!topic}>
            Сброс
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {topics.map(t => {
            const active = topic === t;
            return (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className={`px-3 py-1 rounded-lg text-sm border ${
                  active ? 'bg-[#736ecc] text-white border-transparent' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* плитки тем */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading && <div className="text-gray-500">Загрузка…</div>}
        {!loading && filtered.length === 0 && (
          <div className="text-gray-500">Нет тем.</div>
        )}
        {filtered.map(d => (
          <Link
            key={d.id}
            href={`/biology/science/${d.slug}`}
            className="block p-5 rounded-2xl border hover:shadow bg-white"
          >
            <div className="text-lg font-medium">{labelFromTitle(d.title)}</div>
            <div className="text-sm text-gray-500 mt-1">{d.description || 'Открыть колоду'}</div>
          </Link>
        ))}
      </section>
    </main>
  );
}
