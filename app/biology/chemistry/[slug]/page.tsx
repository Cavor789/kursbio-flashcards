import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

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
  image_url?: string | null;
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: deck } = await supabase
    .from('decks')
    .select('title, description')
    .eq('slug', params.slug)
    .single();

  if (!deck) return {};

  return {
    title: `${(deck.title as string).split('→').pop()?.trim() || deck.title} — Kursbio`,
    description: deck.description || 'Карточки по теме.',
  };
}

export default async function DeckPage({ params }: { params: { slug: string } }) {
  // Находим колоду по slug
  const { data: deck } = await supabase
    .from('decks')
    .select('id, title, description, is_public')
    .eq('slug', params.slug)
    .single<Deck>();

  if (!deck || !deck.is_public) return notFound();

  // Подтягиваем карточки этой колоды
  const { data: cardsRaw } = await supabase
    .from('cards')
    .select('id, front, back, image_url')
    .eq('deck_id', deck.id);

  const cards: Card[] = (cardsRaw || [])
    // убираем карточку «Таблица 1»
    .filter((c) => (c.front?.trim() ?? '') !== 'Таблица 1');

  return (
    <section className="space-y-6">
      {/* ВАЖНО: не рендерим хлебные крошки/второй заголовок — лишний хедер исчезнет */}

      {/* Сетка карточек: 1 колонка на мобиле, 3 на десктопе */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
        {cards.map((card) => (
          <article
            key={card.id}
            className="
              w-full md:w-[90%] max-w-[460px]
              h-[70vh]
              rounded-2xl border bg-white shadow-sm hover:shadow-md
              transition-transform duration-300 hover:scale-[1.01]
              p-6 flex flex-col justify-center text-center
            "
          >
            {/* Лицевая сторона */}
            <div className="text-base md:text-sm sm:text-xs leading-tight font-medium text-gray-900 whitespace-pre-line">
              {card.front}
            </div>

            {/* Если нужна подпись-подсказка о перевороте — раскомментируй
            <div className="text-xs text-gray-500 mt-2">Нажмите, чтобы перевернуть</div>
            */}

            {/* Если нужно изображение под вопросом — раскомментируй */}
            {card.image_url && (
              <img
                src={card.image_url}
                alt=""
                className="mt-4 mx-auto max-h-[28vh] object-contain rounded-lg"
              />
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
