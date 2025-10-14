'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import TopNav from '@/components/TopNav';
import { Heart } from 'lucide-react';
import AuthEmailModal from '@/components/AuthEmailModal';

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

export default function ScienceTopicPage() {
  const { slug } = useParams() as { slug: string };

  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [siblings, setSiblings] = useState<Deck[]>([]);
  const [user, setUser] = useState<any>(null);
  const [favOpen, setFavOpen] = useState(false);
  const [favSet, setFavSet] = useState<Set<string>>(new Set());
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  const topRef = useRef<HTMLDivElement | null>(null);
  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

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

  // карточки (весь набор, без вложенных фильтров)
  useEffect(() => {
    (async () => {
      if (!deck?.id) return;
      const { data } = await supabase
        .from('cards')
        .select('id, front, back, image_url, seq')
        .eq('deck_id', deck.id)
        .order('seq', { ascending: true });
      setCards((data as Card[]) || []);
    })();
  }, [deck?.id]);

  // четыре темы-соседа
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('decks')
        .select('id, title, slug')
        .in('slug', [
          'bio-science-nauki',
          'bio-science-metody',
          'bio-science-urovni',
          'bio-science-priznaki',
        ]);
      setSiblings((data as Deck[]) || []);
    })();
  }, []);

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
  async function loadFavorites(u: any) {
    if (!u) { setFavSet(new Set()); return; }
    const { data } = await supabase.from('favorites').select('card_id').eq('user_id', u.id);
    setFavSet(new Set((data || []).map((r: any) => r.card_id)));
  }
  useEffect(() => { loadFavorites(user); }, [user]);

  // CTA
  const primaryText   = deck?.cta_primary_text   ?? 'Забрать конспект';
  const primaryUrl    = deck?.cta_primary_url    ?? 'https://t.me/kursbio/11017';
  const secondaryText = deck?.cta_secondary_text ?? 'Записаться на годовой курс';
  const secondaryUrl  = deck?.cta_secondary_url  ?? 'https://kursbio.com/godege';
  const thirdText     = 'Приобрести конспекты';
  const thirdUrl      = 'https://kursbio.com/book';

  const topicTitle = deck?.title?.split('→').pop()?.trim();

  return (
    <div className="space-y-6 font-[Inter]">
      <TopNav topic={topicTitle || undefined} />
      <div ref={topRef} />

      {/* Шапка + CTA */}
      <div className="card">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-xl font-semibold">{deck?.title ?? 'Колода'}</div>
            <div className="text-sm text-gray-500">На лицевой стороне — вопрос, на обороте — ответ.</div>
          </div>
          <div className="flex gap-2">
            <a href={primaryUrl} target="_blank" rel="noreferrer" className="btn btn-primary">{primaryText}</a>
            <a href={secondaryUrl} target="_blank" rel="noreferrer" className="btn">{secondaryText}</a>
            <a href={thirdUrl} target="_blank" rel="noreferrer" className="btn">{thirdText}</a>
          </div>
        </div>
      </div>

      {/* ЕДИНСТВЕННЫЕ фильтры: 4 темы общей биологии (активная — фиолетовая) */}
      <div className="card">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="text-lg font-semibold">Общая биология / Биология как наука</div>
            <div className="text-sm text-gray-500">Выберите тему</div>
          </div>
          <button className="btn btn-ghost text-sm" onClick={() => { scrollToTop(); }}>
            Сброс
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {siblings.map((s) => {
            const label = s.title.split('→').pop()?.trim() || s.title;
            const active = s.slug === slug;
            return (
              <Link
                key={s.slug}
                href={`/biology/science/${s.slug}`}
                className={`px-3 py-1 rounded-lg text-sm border ${
                  active ? 'bg-[#736ecc] text-white border-transparent' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Сетка карточек */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div key={c.id} className="flex flex-col">
              <FlipCard
                c={c}
                user={user}
                favSet={favSet}
                setFavSet={setFavSet}
                setFavOpen={setFavOpen}
                openCardId={openCardId}
                setOpenCardId={setOpenCardId}
              />
              {deck?.slug && c.seq && (
                <Link href={`/d/${deck.slug}/${c.seq}`} className="mt-2 inline-block text-sm text-[#736ecc] hover:underline">
                  Открыть карточку (SEO) — №{c.seq}
                </Link>
              )}
            </div>
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
  c, user, favSet, setFavSet, setFavOpen, openCardId, setOpenCardId,
}: {
  c: Card; user: any;
  favSet: Set<string>;
  setFavSet: (s: Set<string>) => void;
  setFavOpen: (v: boolean) => void;
  openCardId: string | null;
  setOpenCardId: (id: string | null) => void;
}) {
  const [flip, setFlip] = useState(false);
  const dirs = ['left', 'right', 'up', 'down'] as const;
  const [dir, setDir] = useState<typeof dirs[number]>('left');

  useEffect(() => { if (openCardId !== c.id && flip) setFlip(false); }, [openCardId, flip, c.id]);
  useEffect(() => {
    if (!flip) return;
    const t = setTimeout(() => { setFlip(false); if (openCardId === c.id) setOpenCardId(null); }, 15000);
    return () => clearTimeout(t);
  }, [flip, openCardId, c.id, setOpenCardId]);

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

  function doFlip() {
    const d = dirs[Math.floor(Math.random() * dirs.length)];
    setDir(d);
    const willOpen = !flip;
    setFlip(willOpen);
    setOpenCardId(willOpen ? c.id : null);
  }

  const containerFlipClass =
    flip ? (dir === 'left' || dir === 'right'
      ? '[transform:rotateY(180deg)]'
      : dir === 'up'
        ? '[transform:rotateX(180deg)]'
        : '[transform:rotateX(-180deg)]') : '';

  const backRotationClass = (dir === 'left' || dir === 'right')
    ? '[transform:rotateY(180deg)]'
    : '[transform:rotateX(180deg)]';

  return (
    <div className="h-full [perspective:1200px]" onClick={doFlip}>
      <div className={`relative h-full min-h-[360px] cursor-pointer
          rounded-2xl bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)]
          [transform-style:preserve-3d] transition-transform duration-500 ${containerFlipClass}`}>
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
            </div>
            <div className="text-xs text-gray-500">Нажмите, чтобы перевернуть</div>
          </div>
        </div>

        {/* BACK */}
        <div className={`absolute inset-0 p-5 [backface-visibility:hidden] ${backRotationClass}`}>
          <div className="h-full flex items-center justify-center">
            <div className="text-gray-800 text-base leading-relaxed text-center">{c.back}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
