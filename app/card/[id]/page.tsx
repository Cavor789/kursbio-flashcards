import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { data } = await supabase
    .from('cards')
    .select('front, back, section, topic')
    .eq('id', params.id)
    .single();

  const title = data ? `Карточка по биологии: ${data.front.slice(0, 60)} — Kursbio` : 'Карточка — Kursbio';
  const desc  = data ? `${data.back.slice(0, 150)}` : 'Карточки по биологии как в Quizlet: вопрос/ответ.';
  const keywords = [
    'квизлет','quizlet','карточки по биологии','ЕГЭ биология',
    'Общая биология','Биология как наука', data?.topic || ''
  ].filter(Boolean).join(', ');
  const url = `https://kursbio-flashcards.vercel.app/card/${params.id}`;

  return {
    title, description: desc,
    alternates: { canonical: url },
    openGraph: { title, description: desc, url, type: 'article' },
    twitter: { card: 'summary_large_image', title, description: desc },
    other: { keywords }
  };
}

export default async function CardPage({ params }: { params: { id: string } }) {
  const { data: c } = await supabase
    .from('cards')
    .select('id, front, back, section, topic')
    .eq('id', params.id)
    .single();

  if (!c) return <div className="p-6">Карточка не найдена.</div>;

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
      <h1 className="text-2xl font-semibold">{c.front}</h1>
      <div className="prose max-w-none">
        <h2>Ответ</h2>
        <p>{c.back}</p>
        <hr />
        <div className="text-sm text-gray-500">
          Раздел: {c.section || '—'} │ Тема: {c.topic || '—'} │ Quizlet-стиль карточки по биологии
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </main>
  );
}
