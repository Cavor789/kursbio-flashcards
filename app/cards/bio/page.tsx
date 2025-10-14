'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Heart } from 'lucide-react';
import AuthEmailModal from '@/components/AuthEmailModal';

/* ---------- SEO / индексация ---------- */
export const metadata = {
  title: 'Карточки по биологии — Kursbio',
  description: 'Интерактивные флеш-карточки: определения, термины и понятия по общей биологии.',
  alternates: { canonical: 'https://kursbio.ru/cards/bio' },
  openGraph: {
    title: 'Карточки по биологии — Kursbio',
    description: 'Учите биологию по интерактивным карточкам: переворот, избранное, фильтры.',
    url: 'https://kursbio.ru/cards/bio',
  },
};

type Card = {
  id: string;
  front: string;
  back: string;
  image_url: string | null;
  section: string | null;
  topic: string | null;
  cta_text: string | null;
  cta_url: string | null;
};

export default function BioCardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [filter, setFilter] = useState<{ section?: string; topic?: string }>({});
  const [user, setUser] = useState<any>(null);
  const [favOpen, setFavOpen] = useState(false);
  const [favSet, setFavSet] = useState<Set<string>>(new Set());
  const [openCardId, setOpenCardId] = useState<string | null>(null); // только одна открыта

  /* ---------- загрузка карточек ---------- */
  useEffect(() => {
    (async () => {
      // Вариант А: показать все карточки по биологии — раскомментируй строку с eq('section', 'Общая биология')
      const { data } = await supabase
        .from('cards')
        .select('*')
        // .eq('section', 'Общая биология')
        .order('created_at', { ascending: false });
      setCards(data || []);
    })();
  }, []);

  /* ---------- сессия пользователя ---------- */
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) =>
      setUser(sess?.user || null)
    );
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  /* ---------- избранное ---------- */
  async function loadFavorites(u: any) {
    if (!u) {
      setFavSet(new Set());
      return;
    }
    const { data } = await supabase
      .from('favorites')
      .select('card_id')
      .eq('user_id', u.id);
    setFavSet(new Set((data || []).map((r: any) => r.card_id)));
  }
  useEffect(() => {
    loadFavorites(user);
  }, [user]);

  /* ---------- фильтрация ---------- */
  const filtered = useMemo(() => {
    return cards.filter(
      (c) =>
        (!filter.section || (c.section || '') === filter.section) &&
        (!filter.topic || (c.topic || '') === filter.topic)
    );
  }, [cards, filter]);

  /* ---------- сбор разделов/тем ---------- */
  const sections = useMemo(() => {
    const s: Record<string, Set<string>> = {};
    for (const c of cards) {
      const sec = c.section || 'Без раздела';
      const top = c.topic || 'Без темы';
      if (!s[sec]) s[sec] = new Set();
      s[sec].add(top);
    }
    return s;
  }, [cards]);

  return (
    <div className="space-y-6 font-[Inter]">
      {/* Фильтры */}
      <div className="card">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="text-lg font-semibold">Фильтры</div>
            <div className="text-sm text-gray-500">
              {filter.section
                ? filter.topic
                  ? `${filter.section} / ${filter.topic}`
                  : filter.section
                : 'Все карточки'}
            </div>
          </div>
          <button className="btn btn-ghost text-sm" onClick={() => setFilter({})}>
            Сброс
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {Object.entries(sections).map(([sec, topics]) => (
            <div key={sec} className="border rounded-xl p-2">
              <button
                className="w-full text-left font-medium"
                onClick={() => setFilter({ section: sec })}
              >
                {sec}
              </button>
              <div className="mt-2 flex flex-wrap gap-2">
                {[...topics].map((t) => (
                  <button
                    key={sec + t}
                    onClick={() => setFilter({ section: sec, topic: t })}
                    className={`px-2 py-1 text-sm rounded-lg ${
                      filter.topic === t
                        ? 'bg-[#736ecc] text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Сетка карточек */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
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
        {filtered.length === 0 && (
          <div className="text-gray-500 mt-2 text-center">Нет карточек по фильтру.</div>
        )}
      </section>

      {/* Промо-блок под карточками */}
      <div className="card text-center">
        <div className="text-lg font-semibold">Полезные материалы по теме</div>
        <div className="mt-3 flex items-center justify-center gap-3 flex-wrap">
          <a href="/conspect" className="btn btn-primary">Забрать конспект</a>
          <a href="/course" className="btn">Записаться на годовой курс</a>
        </div>
      </div>

      <AuthEmailModal open={favOpen} onClose={() => setFavOpen(false)} />
    </div>
  );
}

/* ---------- одна карточка ---------- */
function FlipCard({
  c, user, favSet, setFavSet, setFavOpen, openCardId, setOpenCardId,
}: {
  c: Card;
  user: any;
  favSet: Set<string>;
  setFavSet: (s: Set<string>) => void;
  setFavOpen: (v: boolean) => void;
  openCardId: string | null;
  setOpenCardId: (id: string | null) => void;
}) {
  const [flip, setFlip] = useState(false);
  const dirs = ['left', 'right', 'up', 'down'] as const;
  const [dir, setDir] = useState<typeof dirs[number]>('left');

  // одна открытая карточка
  useEffect(() => {
    if (openCardId !== c.id && flip) setFlip(false);
  }, [openCardId, flip, c.id]);

  // авто-возврат через 15 сек
  useEffect(() => {
    if (!flip) return;
    const t = setTimeout(() => {
      setFlip(false);
      if (openCardId === c.id) setOpenCardId(null);
    }, 15000);
    return () => clearTimeout(t);
  }, [flip, openCardId, c.id, setOpenCardId]);

  const [isFav, setIsFav] = useState<boolean>(favSet.has(c.id));
  useEffect(() => {
    setIsFav(favSet.has(c.id));
  }, [favSet, c.id]);

  async function toggleFav(e: any) {
    e.stopPropagation();
    if (!user) {
      setFavOpen(true);
      return;
    }
    if (isFav) {
      await supabase.from('favorites').delete().eq('card_id', c.id).eq('user_id', user.id);
      const ns = new Set(favSet);
      ns.delete(c.id);
      setFavSet(ns);
    } else {
      await supabase.from('favorites').insert({ card_id: c.id, user_id: user.id });
      const ns = new Set(favSet);
      ns.add(c.id);
      setFavSet(ns);
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
    flip
      ? dir === 'left' || dir === 'right'
        ? '[transform:rotateY(180deg)]'
        : dir === 'up'
          ? '[transform:rotateX(180deg)]'
          : '[transform:rotateX(-180deg)]'
      : '';

  // чтобы задняя сторона была ровной при X- и Y-флипе
  const backRotationClass =
    dir === 'left' || dir === 'right'
      ? '[transform:rotateY(180deg)]'
      : '[transform:rotateX(180deg)]';

  return (
    <div className="h-full [perspective:1200px]" onClick={doFlip}>
      <div
        className={`relative h-full min-h-[360px] cursor-pointer
          rounded-2xl bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)]
          [transform-style:preserve-3d] transition-transform duration-500 ${containerFlipClass}`}
      >
        {/* FRONT */}
        <div className="absolute inset-0 p-5 [backface-visibility:hidden]">
          <button
            onClick={toggleFav}
            className="absolute top-3 right-3 rounded-full p-1 bg-white/90 hover:bg-white shadow"
          >
            <Heart className="w-6 h-6" fill={isFav ? '#736ecc' : 'none'} color={isFav ? '#736ecc' : '#9ca3af'} />
          </button>

          {/* только содержание карточки, без раздела/темы, чтобы не перекрывать сердце */}
          <div className="mt-1 font-semibold text-base sm:text-lg text-gray-800">{c.front}</div>

          {c.image_url && (
            <img src={c.image_url} className="mt-4 rounded-xl w-full max-h-80 object-contain" alt="" />
          )}

          <div className="mt-4 text-xs text-gray-500 text-center">Нажмите, чтобы перевернуть</div>
        </div>

        {/* BACK */}
        <div className={`absolute inset-0 p-5 [backface-visibility:hidden] ${backRotationClass}`}>
          <div className="text-gray-800 text-base leading-relaxed">{c.back}</div>
        </div>
      </div>
    </div>
  );
}
