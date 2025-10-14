import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const ORDER = [
  'bio-science-nauki',
  'bio-science-metody',
  'bio-science-urovni',
  'bio-science-priznaki',
];

export default async function ScienceIndex() {
  const { data } = await supabase
    .from('decks')
    .select('id, title, slug, description')
    .in('slug', ORDER);

  const decks = (data || []).sort(
    (a:any, b:any) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug)
  );

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-sm text-gray-600">
        <Link href="/" className="hover:underline">Колоды</Link>
        <span className="text-gray-400"> / </span>
        <Link href="/biology" className="hover:underline">Общая биология</Link>
        <span className="text-gray-400"> / </span>
        <span className="font-medium">Биология как наука</span>
      </div>

      <h1 className="text-2xl font-semibold">Биология как наука — темы</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {decks.map((d:any) => (
          <Link key={d.id} href={`/biology/science/${d.slug}`} className="p-5 rounded-2xl border hover:shadow block">
            <div className="text-lg font-medium">{d.title.split('→').pop()?.trim() || d.title}</div>
            <div className="text-sm text-gray-500 mt-1">{d.description || 'Открыть колоду'}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
