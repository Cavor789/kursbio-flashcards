'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import TopNav from '@/components/TopNav';
import AuthEmailModal from '@/components/AuthEmailModal';
import { Heart } from 'lucide-react';

type Deck = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cta_primary_text: string | null;
  cta_primary_url: string | null;
  cta_secondary_text: string | null;
  cta_secondary_url: string | null;
};

type Card = {
  id: string;
  front: string;
  back: string;
  image_url: string | null;
  seq: number;
};

export default function ChemistryDeckPage() {
  const { slug } = useParams() as { slug: string };
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [user, setUser] = useState<any>(null);
  const [favOpen, setFavOpen] = useState(false);
  const [favSet, setFavSet] = useState<Set<string>>(new Set());

  // текущая колода
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('decks')
        .select(`
          id, title, slug, description,
          cta_primary_text, cta_primary_url,
          cta_secondary_text, cta_secondary_url
        `)
        .eq('slug', slug)
        .single();
      setDeck(data as Deck);
    })();
  }, [slug]);

  // карточки
  useEffect(() => {
    if (!deck?.id) return;
    (async () => {
      const { data } = await supabase
        .from('cards')
        .select('id, front, back, image_url, seq')
        .eq('deck_id', deck.id)
        .order('seq', { ascending: true });
      setCards((data as Card[]) || []);
    })();
  }, [deck?.id]);

  // сессия
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

  // избранное
  useEffect(() => {
    (async () => {
      if (!user) { setFavSet(new Set()); return; }
      const { data } = await supabase.from('favorites').select('card_id').eq('user_id', user.id);
      setFavSet(new Set((data || []).map((r: any) => r.card_id)));
    })();
  }, [user]);

  const primaryText   = deck?.cta_primary_text   ?? 'Забрать конспект';
  const primaryUrl    = deck?.cta_primary_url    ?? 'https://t.me/kursbio/11017';
  const secondaryText = deck?.cta_secondary_text ?? 'Записаться на годовой курс';
  const secondaryUrl  = deck?.cta_secondary_url  ?? 'https://kursbio.com/godege';
  const topicTitle    = deck?.title?.split('→').pop()?.trim();

  return (
    <div className="space-y-6 font-[Inter]">
      <TopNav topic={topicTitle || undefined} />

      {/* Шапка + CTA */}
      <div className="card">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-xl font-semibold">{deck?.title ?? 'Колода'}</div>
            <div className="text-sm text-gray-500">На лицевой стороне — вопрос, на обороте — ответ.</div>
          </div>
          <div className="flex gap-2">
            <a href={primaryUrl} target="_blank" rel="noreferrer" className="btn btn-primary">{primaryText}</a>
            <a href={secondaryUrl} target="_blank" rel="noreferrer" className="btn btn-white">{secondaryText}</a>
          </div>
        </div>
      </div>

      {/* Сетка карточек */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c) => (
            <FlipCard
              key={c.id}
              c={c}
              user={user}
              favSet={favSet}
              setFavSet={setFavSet}
              setFavOpen={setFavOpen}
            />
          ))}
        </div>
        {cards.length === 0 && <div className="text-gray-500 mt-2 text-center">Нет карточек.</div>}
      </section>

      <AuthEmailModal open={favOpen} onClose={() => setFavOpen(false)} />
    </div>
  );
}

/* -------- карточка -------- */
function FlipCard({
  c, user, favSet, setFavSet, setFavOpen,
}: {
  c: Card; user: any;
  favSet: Set<string>;
  setFavSet: (s: Set<string>) => void;
  setFavOpen: (v: boolean) => void;
}) {
  const [flip, setFlip] = useState(false);
  const [isFav, setIsFav] = useState<boolean>(favSet.has(c.id));

  useEffect(() => { setIsFav(favSet.has(c.id)); }, [favSet, c.id]);

  async function toggleFav(e: any) {
    e.stopPropagation();
    if (!user) { setFavOpen(true); return; }
    if (isFav) {
      await supabase.from('favorites').delete().eq('card_id', c.id).eq('user_id', user.id);
      const ns = new Set(favSet); ns.delete(c.id); setFavSet(ns);
    } else {
      await supabase.from('favorites').insert({ card_id: c.id, user_id: user.id });
      const ns = new Set(favSet); ns.add(c.id); setFavSet(ns);
    }
  }

  // ——— размер «как игральная карта»: на мобилке ~70vh, ширина почти вся, на десктопе прежний размер
  const cardContainer = `
    h-full [perspective:1200px]
  `;

  const cardPanel = `
    relative h-full
    min-h-[70vh] sm:min-h-[420px]
    w-full
    rounded-2xl bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)]
    [transform-style:preserve-3d] transition-transform duration-500
    ${flip ? '[transform:rotateY(180deg)]' : ''}
  `;

  return (
    <div className={cardContainer} onClick={() => setFlip(!flip)}>
      <div className={cardPanel}>
        {/* FRONT */}
        <div className="absolute inset-0 p-5 [backface-visibility:hidden]">
          <button
            onClick={toggleFav}
            className="absolute top-3 right-3 rounded-full p-1 bg-white/90 hover:bg-white shadow pointer-events-auto"
            aria-label={isFav ? 'Убрать из избранного' : 'В избранное'}
          >
            <Heart className="w-6 h-6" fill={isFav ? '#736ecc' : 'none'} color={isFav ? '#736ecc' : '#9ca3af'} />
          </button>

          <div className="h-full flex flex-col items-center justify-center gap-4 pt-8 text-center">
            <div className="font-semibold text-base sm:text-lg text-gray-800">
              {c.front}
              {c.image_url && (
                <div className="mt-4">
                  {/* Картинка под вопросом: вписываем, не наезжает на текст */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image_url}
                    alt=""
                    className="max-h-[28vh] sm:max-h-56 w-auto mx-auto rounded-lg object-contain"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500">Нажмите, чтобы перевернуть</div>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="h-full flex items-center justify-center">
            <div className="text-gray-800 text-base leading-relaxed text-center whitespace-pre-wrap">{c.back}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
