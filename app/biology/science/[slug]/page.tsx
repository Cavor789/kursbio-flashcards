// app/biology/science/[slug]/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
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
  front: string | null;
  back: string | null;
  image_url: string | null;
  seq: number | null;
};

const IMG_EXT = /\.(png|jpe?g|gif|webp|svg)$/i;
const norm = (s: string) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
const isTable1 = (front: string | null) => {
  const firstLine = (front || '').split('\n')[0];
  const n = norm(firstLine);
  return n === 'таблица 1' || n.startsWith('таблица 1');
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

  // карточки
  useEffect(() => {
    (async () => {
      if (!deck?.id) return;
      const { data } = await supabase
        .from('cards')
        .select('id, front, back, image_url, seq')
        .eq('deck_id', deck.id)
        .order('seq', { ascending: true });
      const list = (data as Card[] | null) ?? [];
      // убираем «Таблица 1»
      setCards(list.filter(c => !isTable1(c.front)));
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

  // CTA (оставил как было)
  const primaryText   = deck?.cta_primary_text   ?? 'Забрать конспект';
  const primaryUrl    = deck?.cta_primary_url    ?? 'https://t.me/kursbio/11017';
  const secondaryText = deck?.cta_secondary_text ?? 'Записаться на годовой курс';
  const secondaryUrl  = deck?.cta_secondary_url  ?? 'https://kursbio.com/godege';

  const topicTitle = deck?.title?.split('→').pop()?.trim();

  return (
    <div className="space-y-6 font-[Inter]">
      <div ref={topRef} />

      {/* Липкий мини-хедер: назад / наверх */}
      <div className="sticky top-0 z-20 -mt-6 pt-6">
        <div className="rounded-xl border bg-white/90 backdrop-blur px-3 py-2 flex items-center justify-between">
          <Link href="/biology" className="text-sm text-[#736ecc] hover:underline">← Назад</Link>
          <div className="text-sm font-medium truncate px-2">{topicTitle || 'Тема'}</div>
          <button className="text-sm text-gray-600 hover:underline" onClick={scrollToTop}>Наверх</button>
        </div>
      </div>

      {/* хлебные крошки */}
      <div className="text-sm text-gray-600">
        <Link href="/cards" className="hover:underline">Карточки</Link>
        <span className="text-gray-400"> / </span>
        <Link href="/biology" className="hover:underline">Общая биология</Link>
        <span className="text-gray-400"> / </span>
        <span className="font-medium">{topicTitle || 'Тема'}</span>
      </div>

      {/* Фильтры — 4 темы общей биологии */}
      <div className="rounded-2xl border bg-white p-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="text-lg font-semibold">Общая биология / Биология как наука</div>
            <div className="text-sm text-gray-500">Выберите тему</div>
          </div>
          <button className="text-sm text-[#736ecc] hover:underline" onClick={scrollToTop}>
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

      {/* CTA кнопки (как было) */}
      <div className="flex gap-3 flex-wrap">
        <a href={primaryUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          {primaryText}
        </a>
        <a href={secondaryUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
          {secondaryText}
        </a>
      </div>

      {/* Сетка карточек: стандарт длинных карт */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
          {cards.map((c) => (
            <FlipCard
              key={c.id}
              c={c}
              user={user}
              favSet={favSet}
              setFavSet={setFavSet}
              setFavOpen={setFavOpen}
              openCardId={openCardId}
              setOpenCardId={setOpenCardId}
            />
          ))}
        </div>
        {cards.length === 0 && <div className="text-gray-500 mt-2 text-center">Нет карточек.</div>}
      </section>

      <AuthEmailModal open={favOpen} onClose={() => setFavOpen(false)} />
    </div>
  );
}

/* --- карточка: длинная, с анимацией flip, авто-возвратом и картинкой --- */
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

  // Авто-возврат через 10 сек
  useEffect(() => {
    if (!flip) return;
    const t = setTimeout(() => { setFlip(false); if (openCardId === c.id) setOpenCardId(null); }, 10000);
    return () => clearTimeout(t);
  }, [flip, openCardId, c.id, setOpenCardId]);

  useEffect(() => { if (openCardId !== c.id && flip) setFlip(false); }, [openCardId, flip, c.id]);

  // избранное
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

  // первая ссылка в тексте — если это картинка, покажем под текстом
  const firstUrl = useMemo(() => {
    const m = (c.front || '').match(/https?:\/\/\S+/);
    return m?.[0] ?? null;
  }, [c.front]);

  const canInlineImage = useMemo(() => {
    if (c.image_url) return false;
    if (!firstUrl) return false;
    try {
      const u = new URL(firstUrl);
      return IMG_EXT.test(u.pathname || '');
    } catch { return false; }
  }, [firstUrl, c.image_url]);

  const showImage = c.image_url || (canInlineImage ? firstUrl : null);

  const stop = (e: React.MouseEvent) => e.stopPropagation();

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
    <div className="w-full md:w-[90%] max-w-[520px] h-[70vh]">
      <div
        className="h-full [perspective:1200px]"
        onClick={doFlip}
        role="button"
        aria-pressed={flip}
        title={flip ? 'Нажмите, чтобы вернуть вопрос' : 'Нажмите, чтобы перевернуть'}
      >
        <div className={`relative h-full cursor-pointer
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

            <div className="h-full flex flex-col gap-3 pt-6">
              <div className="flex-1 overflow-y-auto pr-1">
                <div className="font-medium text-base md:text-sm text-gray-800 leading-tight whitespace-pre-line break-words">
                  {c.front}
                </div>

                {showImage && (
                  <img
                    src={showImage}
                    alt=""
                    className="mt-3 mx-auto max-h-[28vh] object-contain rounded-lg"
                    onClick={stop}
                  />
                )}

                {firstUrl && !canInlineImage && (
                  <a
                    href={firstUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-xs text-blue-600 underline break-all"
                    onClick={stop}
                  >
                    {firstUrl}
                  </a>
                )}
              </div>

              <div className="text-xs text-gray-500 text-center">Нажмите, чтобы перевернуть</div>
            </div>
          </div>

          {/* BACK */}
          <div className={`absolute inset-0 p-5 [backface-visibility:hidden] ${backRotationClass}`}>
            <div className="h-full flex flex-col gap-3 pt-6">
              <div className="flex-1 overflow-y-auto pr-1">
                <div className="text-gray-800 text-base md:text-sm leading-tight whitespace-pre-line break-words text-center">
                  {c.back || '—'}
                </div>
              </div>
              <div className="text-xs text-gray-500 text-center">Нажмите, чтобы вернуть вопрос</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
