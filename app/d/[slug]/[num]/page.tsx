import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

type Params = { slug: string; num: string };

export async function generateMetadata({ params }: { params: Params }) {
  const { slug, num } = params;
  const { data: deck } = await supabase.from('decks').select('id, title').eq('slug', slug).single();
  let title = 'Карточка — Kursbio';
  let desc = 'Карточки по биологии как в Quizlet: вопрос/ответ.';
  if (deck) {
    const { data: c } = await supabase
      .from('cards')
      .select('front, back, topic')
      .eq('deck_id', deck.id)
      .eq('seq', Number(num))
      .single();
    if (c) {
      title = `Карточка №${num}: ${c.front.slice(0,60)} — Kursbio`;
      desc  = `${c.back.slice(0,150)}`;
    }
  }
  const url = `https://kursbio-flashcards.vercel.app/d/${slug}/${num}`;
  const keywords = ['квизлет','quizlet','карточки по биологии','ЕГЭ биология'].join(', ');
  return {
    title, description: desc,
    alternates: { canonical: url },
    openGraph: { title, description: desc, url, type: 'article' },
    twitter: { card: 'summary_large_image', title, description: desc },
    other: { keywords }
  };
}

export default async function CardPrettyPage({ params }: { params: Params }) {
  const { slug, num } = params;

  const { data: deck } = await supabase.from('decks').select('id, title').eq('slug', slug).single();
  if (!deck) return <div className="p-6">Колода не найдена.</div>;

  const { data: c } = await supabase
    .from('cards')
    .select('id, front, back, section, topic, seq')
    .eq('deck_id', deck.id)
    .eq('seq', Number(num))
    .single();

  if (!c) return <div className="p-6">Карточка №{num} не найдена.</div>;

  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question", "name": c.front,
      "acceptedAnswer": { "@type": "Answer", "text": c.back }
    }]
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">№{c.seq}. {c.front}</h1>
      <div className="prose max-w-none">
        <h2>Ответ</h2>
        <p>{c.back}</p>
        <hr />
        <div className="text-sm text-gray-500">
          Колода: {deck.title} │ Раздел: {c.section || '—'} │ Тема: {c.topic || '—'}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </main>
  );
}
