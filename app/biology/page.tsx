import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function BiologyIndex() {
  // берём все колоды, которые начинаются с "Общая биология →"
  const { data: decks } = await supabase
    .from('decks')
    .select('id, title, slug, description, is_public')
    .like('title', 'Общая биология →%');

  // фильтруем только первый уровень (где дальше идёт ровно 1 стрелка)
  const list = (decks || []).filter((d: any) => d.title.split('→').length === 2);

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-sm text-gray-600">
        <Link href="/" className="hover:underline">Колоды</Link>
        <span className="text-gray-400"> / </span>
        <span className="font-medium">Общая биология</span>
      </div>

      <h1 className="text-2xl font-semibold">Общая биология — темы</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {list.map((d: any) => {
          const label = d.title.split('→').pop()?.trim() || d.title;
          return (
            <Link
              key={d.id}
              href={`/biology/${d.slug}`}
              className="p-5 rounded-2xl border hover:shadow block"
            >
              <div className="text-lg font-medium">{label}</div>
              <div className="text-sm text-gray-500 mt-1">{d.description || 'Открыть раздел'}</div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
