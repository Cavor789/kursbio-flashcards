// app/biology/chemistry/[slug]/page.tsx
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Flashcard from '@/components/Flashcard';

export const dynamic = 'force-dynamic';

type Deck = {
  id: string;
  title: string;
  description: string | null;
  is_public: boolean;
};

type Card = {
  id: string;
  front: string | null;
  back: string | null;
  image_url?: string | null;
};

const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();

// строка «Таблица 1» иногда приходит с переносами/подписью — возьмём первую строку
const isTable1 = (front: string | null) => {
  const firstLine = (front ?? '').split('\n')[0];
  const n = norm(firstLine);
  return n === 'таблица 1' || n.startsWith('таблица 1');
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: deck } = await supabase
    .from('decks')
    .select('title, description')
    .eq('slug', params.slug)
    .single();

  if (!deck) return {};
  const short = ((deck.title as string).split('→').pop() || deck.title).trim();
  return { title: `${short} — Kursbio`, description: deck.description || 'Карточки по теме.' };
}

export default async function DeckPage({ params }: { params: { slug: string } }) {
  const { data: deck } = await supabase
    .from('decks')
    .select('id, title, description, is_public')
    .eq('slug', params.slug)
    .single<Deck>();

  if (!deck || !deck.is_public) return notFound();

  const { data: raw } = await supabase
    .from('cards')
    .select('id, front, back, image_url')
    .eq('deck_id', deck.id);

  const cards: Card[] = (raw || []).filter(c => !isTable1(c.front));

  return (
    <section className="space-y-6">
      {/* Только сетка карточек, без второго хедера */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
        {cards.map(card => (
          <Flashcard
            key={card.id}
            front={card.front}
            back={card.back}
            image_url={card.image_url ?? undefined}
          />
        ))}
      </div>
    </section>
  );
}
