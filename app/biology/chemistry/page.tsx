import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Химический состав клетки — Kursbio',
  description: 'Колоды и карточки по теме «Химический состав клетки».',
};

function labelFromTitle(title: string) {
  // берём кусок после последней стрелки
  return (title.split('→').pop() || title).trim();
}

export default async function ChemistryIndex() {
  // берём все публичные колоды, начинающиеся на «Общая биология → Химический состав клетки»
  const { data } = await supabase
    .from('decks')
    .select('id, title, slug, description, is_public')
    .like('title', 'Общая биология → Химический состав клетки%');

  const list = (data || []).filter((d: any) => d.is_public);

  return (
    <section className="space-y-6">
      <div className="text-sm text-gray-600">
        <Link href="/cards" className="hover:underline">Карточки</Link>
        <span className="text-gray-400"> / </span>
        <Link href="/biology" className="hover:underline">Общая биология</Link>
        <span className="text-gray-400"> / </span>
        <span className="font-medium">Химический состав клетки</span>
      </div>

      <h1 className="text-2xl font-semibold">Химический состав клетки — колоды</h1>

      {list.length === 0 && (
        <div className="text-gray-500">Пока пусто. Проверь, что колода создана и <i>is_public = true</i>.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {list.map((d: any) => (
          <Link
            key={d.id}
            href={`/biology/chemistry/${d.slug}`}
            className="block p-5 rounded-2xl border bg-white hover:shadow"
          >
            <div className="text-lg font-medium">{labelFromTitle(d.title)}</div>
            <div className="text-sm text-gray-500 mt-1">{d.description || 'Открыть колоду'}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
