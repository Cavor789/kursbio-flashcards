// app/biology/science/[slug]/page.tsx
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Flashcard from '@/components/Flashcard';

export const dynamic = 'force-dynamic';

type Deck = {
  id: string;
  title: string;
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

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: deck } = await supabase
    .from('decks')
    .select('title')
    .eq('slug', params.slug)
    .single();

  if (!deck) return {};
  const short = ((deck.title as string).split('→').pop() || deck.title).trim();
  return { title: `${short} — Kursbio` };
}

export default async function ScienceDeck({ params }: { params: { slug: string } }) {
  const { data: deck } = await supabase
    .from('decks')
    .select('id, title, is_public')
    .eq('slug', params.slug)
    .single<Deck>();

  if (!deck || !deck.is_public) return notFound();

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
          <a href="/biology/science" className="text-sm text-[#736ecc] hover:underline">← Назад</a>
          <div className="text-sm font-medium truncate px-2">{titleShort}</div>
          <button
            className="text-sm text-gray-600 hover:underline"
            onClick={() => { if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            Наверх
          </button>
        </div>
      </div>

      {/* Сетка карточек */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
        {cards.map(c => (
          <Flashcard
            key={c.id}
            front={c.front}
            back={c.back}
            image_url={c.image_url ?? undefined}
          />
        ))}
      </div>
    </section>
  );
}
