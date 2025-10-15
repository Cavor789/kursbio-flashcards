import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Химический состав клетки — Kursbio',
  description: 'Колоды и карточки по теме «Химический состав клетки».',
};

function labelFromTitle(title: string) {
  return (title.split('→').pop() || title).trim();
}

export default async function ChemistryIndex() {
  const { data } = await supabase
    .from('decks')
    .select('id, title, slug, description, is_public')
    .like('title', 'Общая биология → Химический состав клетки%');

  const list = (data || []).filter((d: any) => d.is_public);

  return (
    <section className="space-y-6">
      {/* ВАЖНО: никакого второго хедера/крошек здесь не рендерим */}

      {list.length === 0 && (
        <div className="text-gray-500">
          Пока пусто. Проверь, что колода создана и <i>is_public = true</i>.
        </div>
      )}

      {/* 1 колонка на телефоне, 3 на десктопе; плитки крупнее */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
        {list.map((d: any) => (
          <Link
            key={d.id}
            href={`/biology/chemistry/${d.slug}`}
            className="
              w-full md:w-[90%] max-w-[460px]
              h-[70vh]
              rounded-2xl border bg-white shadow-sm hover:shadow-md
              transition-transform duration-300 hover:scale-[1.01]
              p-6 flex flex-col justify-center text-center
            "
          >
            <div className="text-base md:text-lg leading-tight font-medium mb-2">
              {labelFromTitle(d.title)}
            </div>
            {d.description && (
              <div className="text-sm md:text-base text-gray-600">
                {d.description}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
