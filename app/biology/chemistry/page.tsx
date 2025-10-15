// app/biology/chemistry/page.tsx
import { supabase } from '@/lib/supabase';
import Flashcard from '@/components/Flashcard';

export const dynamic = 'force-dynamic';

type Deck = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  is_public: boolean;
};

type Card = {
  id: string;
  front: string | null;
  back: string | null;
  image_url: string | null;
  seq?: number | null;
};

const norm = (s: string) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
const isTable1 = (front: string | null) => {
  const firstLine = (front || '').split('\n')[0];
  const n = norm(firstLine);
  return n === 'таблица 1' || n.startsWith('таблица 1');
};

export const metadata = {
  title: 'Химический состав клетки — Kursbio',
  description: 'Карточки и колоды по теме «Химический состав клетки».',
};

export default async function ChemistryRoot() {
  // Берём публичные колоды химии
  const { data: decksRaw } = await supabase
    .from('decks')
    .select('id, title, slug, description, is_public')
    .like('title', 'Общая биология → Химический состав клетки%');

  const decks: Deck[] = (decksRaw || []).filter(d => d.is_public);

  // Нет колод
  if (decks.length === 0) {
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-semibold">Химический состав клетки</h1>
        <div className="text-gray-500">Пока пусто. Проверь, что колода создана и <i>is_public = true</i>.</div>
      </section>
    );
  }

  // ОДНА колода — сразу показываем карточки (без лишнего клика)
  if (decks.length === 1) {
    const deck = decks[0];
    const { data: cardsRaw } = await supabase
      .from('cards')
      .select('id, front, back, image_url, seq')
      .eq('deck_id', deck.id)
      .order('seq', { ascending: true });

    const cards: Card[] = (cardsRaw || []).filter(c => !isTable1(c.front));
    const titleShort = (deck.title.split('→').pop() || deck.title).trim();

    return (
      <section className="space-y-6">
        {/* Липкий мини-хедер */}
        <div className="sticky top-0 z-20 -mt-6 pt-6">
          <div className="rounded-xl border bg-white/90 backdrop-blur px-3 py-2 flex items-center justify-between">
            <a href="/biology" className="text-sm text-[#736ecc] hover:underline">← Назад</a>
            <div className="text-sm font-medium truncate px-2">{titleShort}</div>
            <button
              className="text-sm text-gray-600 hover:underline"
              onClick={() => { if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              Наверх
            </button>
          </div>
        </div>

        {/* Сетка карточек: 1 колонка на мобиле, 3 на десктопе */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
          {cards.map(c => (
            <Flashcard key={c.id} front={c.front} back={c.back} image_url={c.image_url ?? undefined} />
          ))}
        </div>
      </section>
    );
  }

  // НЕСКОЛЬКО колод — показываем плитки
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Химический состав клетки — колоды</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
        {decks.map(d => {
          const label = (d.title.split('→').pop() || d.title).trim();
          return (
            <a
              key={d.id}
              href={`/biology/chemistry/${d.slug}`}
              className="w-full md:w-[90%] max-w-[460px] h-[40vh]
                         rounded-2xl border bg-white shadow-sm hover:shadow-md
                         transition-transform duration-300 hover:scale-[1.01]
                         p-6 flex flex-col justify-center text-center"
            >
              <div className="text-base md:text-sm leading-tight font-medium">{label}</div>
              <div className="text-sm md:text-xs text-gray-500 mt-2 leading-snug">
                {d.description || 'Открыть колоду'}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
