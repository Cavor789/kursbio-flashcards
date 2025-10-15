// app/biology/chemistry/[slug]/page.tsx
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

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

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: deck } = await supabase
    .from('decks')
    .select('title, description')
    .eq('slug', params.slug)
    .single();

  if (!deck) return {};
  const short = ((deck.title as string).split('→').pop() || deck.title).trim();
  return {
    title: `${short} — Kursbio`,
    description: deck.description || 'Карточки по теме.',
  };
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

  // убираем «Таблица 1»
  const cards: Card[] = (raw || []).filter((c) => norm(c.front ?? '') !== 'таблица 1');

  return (
    <section className="space-y-6">
      {/* никаких хлебных крошек/заголовков здесь не рендерим */}

      {/* 1 колонка на мобиле, 3 на десктопе */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
        {cards.map((card) => (
          <article
            key={card.id}
            className="
              w-full md:w-[90%] max-w-[520px]
              h-[70vh]
              rounded-2xl border bg-white shadow-sm hover:shadow-md
              transition-transform duration-300 hover:scale-[1.01]
              p-6 flex flex-col
            "
          >
            {/* Контент со скроллом, чтобы длинный текст оставался внутри */}
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="text-base md:text-sm sm:text-xs leading-tight font-medium text-gray-900 whitespace-pre-line break-words">
                {card.front}
              </div>

              {card.image_url && (
                <img
                  src={card.image_url}
                  alt=""
                  className="mt-4 mx-auto max-h-[28vh] object-contain rounded-lg"
                />
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
