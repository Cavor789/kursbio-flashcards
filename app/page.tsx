'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

type Deck = { id: string; title: string; is_public: boolean; };
export default function Home() {
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('decks').select('id,title,is_public').eq('is_public', true).order('title');
      setDecks(data || []);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Публичные колоды</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {decks.map(d => (
          <Link key={d.id} href={`/deck/${d.id}`} className="card hover:shadow-xl transition">
            <div className="font-semibold">{d.title}</div>
            <div className="text-sm text-gray-500">Минималистичный просмотр</div>
          </Link>
        ))}
        {decks.length===0 && <div className="text-gray-500">Пока нет опубликованных колод.</div>}
      </div>
    </div>
  );
}
