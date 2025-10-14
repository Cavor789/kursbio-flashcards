import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import AccordionNav from '@/components/AccordionNav';

export const dynamic = 'force-dynamic';

const ORDER = ['Науки', 'Методы', 'Уровни организации', 'Признаки живого'];

function labelFrom(title: string) {
  const raw = title.split('→').pop()?.trim() ?? title;
  return raw.replace(/\s*\(.*\)\s*$/, '');
}

export default async function ScienceIndex() {
  const { data } = await supabase
    .from('decks')
    .select('id, title, slug, description, is_public')
    .like('title', 'Общая биология → Биология как наука →%');

  const list = (data || [])
    .filter((d: any) => d.is_public)
    .sort((a: any, b: any) => {
      const ia = ORDER.indexOf(labelFrom(a.title));
      const ib = ORDER.indexOf(labelFrom(b.title));
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return labelFrom(a.title).localeCompare(labelFrom(b.title));
    });

  // секции для «гармошки»
  const sections = [
    {
      id: 'bio',
      title: 'Общая биология',
      items: [{ label: 'Биология как наука', href: '/biology/science' }],
    },
    {
      id: 'topics',
      title: 'Биология как наука — темы',
      items: list.map((d: any) => ({
        label: labelFrom(d.title),
        href: `/biology/science/${d.slug}`,
      })),
    },
  ];

  return (
    <section className="space-y-6">
      {/* хлебные крошки */}
      <div className="text-sm text-gray-600">
        <Link href="/cards" className="hover:underline">Карточки</Link>
        <span className="text-gray-400"> / </span>
        <Link href="/biology" className="hover:underline">Общая биология</Link>
        <span className="text-gray-400"> / </span>
        <span className="font-medium">Биология как наука</span>
      </div>

      <h1 className="text-2xl font-semibold">Биология как наука — темы</h1>

      {/* Гармошка с иерархией */}
      <AccordionNav sections={sections} />

      {/* Плитки 4 тем */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {list.map((d: any) => (
          <Link
            key={d.id}
            href={`/biology/science/${d.slug}`}
            className="block p-5 rounded-2xl border hover:shadow bg-white"
          >
            <div className="text-lg font-medium">{labelFrom(d.title)}</div>
            <div className="text-sm text-gray-500 mt-1">
              {d.description || 'Открыть колоду'}
            </div>
          </Link>
        ))}
      </div>

      <div>
        <Link
          href="/biology"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white hover:bg-gray-50"
        >
          ← Назад к разделу «Общая биология»
        </Link>
      </div>
    </section>
  );
}
