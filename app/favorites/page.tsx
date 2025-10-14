'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import AuthEmailModal from '@/components/AuthEmailModal';
import { Heart } from 'lucide-react';

type Card = {
  id: string;
  front: string;
  back: string;
  image_url: string | null;
  deck_id: string;
  seq: number | null;
  decks: { slug: string | null } | null;
};

export default function FavoritesPage() {
  const [user, setUser] = useState<any>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [favOpen, setFavOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) =>
      setUser(sess?.user || null)
    );
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data } = await supabase
        .from('favorites')
        .select('card_id, cards(id, front, back, image_url, deck_id, seq, decks(slug))')
        .eq('user_id', user.id);
      const rows = (data || []).map((r: any) => r.cards) as Card[];
      setCards(rows);
    })();
  }, [user]);

  if (!user) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-3">Избранные</h1>
        <p className="text-gray-600 mb-4">Войдите, чтобы увидеть сохранённые карточки.</p>
        <button className="btn btn-primary" onClick={() => setFavOpen(true)}>Войти</button>
        <AuthEmailModal open={favOpen} onClose={() => setFavOpen(false)} />
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Избранные</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c) => (
          <div key={c.id} className="rounded-2xl border p-5 bg-white">
            <div className="flex items-start justify-between gap-2">
              <div className="font-semibold">{c.front}</div>
              <Heart className="w-5 h-5" fill="#736ecc" color="#736ecc" />
            </div>
            <div className="mt-3 text-gray-700">{c.back}</div>
            {c.decks?.slug && c.seq != null && (
              <Link href={`/d/${c.decks.slug}/${c.seq}`} className="mt-3 inline-block text-sm text-[#736ecc] hover:underline">
                Открыть карточку
              </Link>
            )}
          </div>
        ))}
      </div>
      {cards.length === 0 && <div className="text-gray-500">Пока пусто.</div>}
    </main>
  );
}
