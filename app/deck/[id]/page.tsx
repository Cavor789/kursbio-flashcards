'use client';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Heart } from 'lucide-react';
import AuthEmailModal from '@/components/AuthEmailModal';

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

export default function DeckView() {
  const params = useParams() as { id: string };
  const [cards, setCards] = useState<Card[]>([]);
  const [filter, setFilter] = useState<{ section?: string; topic?: string }>({});
  const [user, setUser] = useState<any>(null);
  const [favOpen, setFavOpen] = useState(false);
  const [favSet, setFavSet] = useState<Set<string>>(new Set());

  // загрузка карточек
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('cards')
        .select('*')
        .eq('deck_id', params.id)
        .order('created_at', { ascending: false });
      setCards(data || []);
    })();
  }, [params.id]);

  // авторизация пользователя
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

  // избранные карточки
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

  const filtered = useMemo(() => {
    return cards.filter(
      (c) =>
        (!filter.section || (c.section || '') === filter.section) &&
        (!filter.topic || (c.topic || '') === filter.topic)
    );
  }, [cards, filter]);

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
      {/* Заголовок */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Kursbio Карточки</h1>
      </div>

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
          <button
            className="btn btn-ghost text-sm"
            onClick={() => setFilter({})}
          >
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
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-gray-500 mt-2 text-center">
            Нет карточек по фильтру.
          </div>
        )}
      </section>

      <AuthEmailModal open={favOpen} onClose={() => setFavOpen(false)} />
    </div>
  );
}

// ---------- компонент FlipCard ----------
function FlipCard({
  c,
  user,
  favSet,
  setFavSet,
  setFavOpen,
}: {
  c: Card;
  user: any;
  favSet: Set<string>;
  setFavSet: (s: Set<string>) => void;
  setFavOpen: (v: boolean) => void;
}) {
  const [flip, setFlip] = useState(false);
  const dirs = ['left', 'right', 'up', 'down'] as const;
  const [dir, setDir] = useState<typeof dirs[number]>('left');
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
      await supabase.from('favorites').delete().eq('card_id', c.id);
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
    setFlip((f) => !f);
  }

  return (
    <div className="h-full [perspective:1200px]" onClick={doFlip}>
      <div
        className={`relative h-full min-h-[360px] cursor-pointer
          rounded-2xl bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)]
          [transform-style:preserve-3d] transition-transform duration-500
          ${
            flip
              ? dir === 'left'
                ? '[transform:rotateY(-180deg)]'
                : dir === 'right'
                ? '[transform:rotateY(180deg)]'
                : dir === 'up'
                ? '[transform:rotateX(180deg)]'
                : '[transform:rotateX(-180deg)]'
              : ''
          }`}
      >
        {/* передняя сторона */}
        <div className="absolute inset-0 p-5 [backface-visibility:hidden]">
          <button
            onClick={toggleFav}
            className="absolute top-3 right-3 rounded-full p-1 bg-white/90 hover:bg-white shadow"
          >
            <Heart
              className="w-6 h-6"
              fill={isFav ? '#736ecc' : 'none'}
              color={isFav ? '#736ecc' : '#9ca3af'}
            />
          </button>
          <div className="mt-1 font-semibold text-base sm:text-lg text-gray-800">
            {c.front}
          </div>
          {c.image_url && (
            <img
              src={c.image_url}
              className="mt-4 rounded-xl w-full max-h-80 object-contain"
              alt=""
            />
          )}
          <div className="mt-4 text-xs text-gray-500 text-center">
            Нажмите, чтобы перевернуть
          </div>
        </div>

        {/* обратная сторона */}
        <div className="absolute inset-0 p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="text-gray-800 text-base leading-relaxed">{c.back}</div>
          {c.cta_text && c.cta_url && (
            <a
              target="_blank"
              href={c.cta_url}
              className="btn btn-primary mt-4 inline-block"
            >
              {c.cta_text}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
