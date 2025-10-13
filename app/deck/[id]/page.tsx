'use client';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Heart } from 'lucide-react';
import AuthEmailModal from '@/components/AuthEmailModal';

type Card = {
  id: string; front: string; back: string; image_url: string | null; section: string|null; topic: string|null; cta_text: string|null; cta_url: string|null;
};

export default function DeckView() {
  const params = useParams() as { id: string };
  const [cards, setCards] = useState<Card[]>([]);
  const [filter, setFilter] = useState<{section?:string, topic?:string}>({});

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('cards').select('*').eq('deck_id', params.id).order('created_at', { ascending: false });
      setCards(data || []);
    })();
  }, [params.id]);

const [user, setUser] = useState<any>(null);
const [favOpen, setFavOpen] = useState(false);
const [favSet, setFavSet] = useState<Set<string>>(new Set());

useEffect(() => {
  supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
  const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => setUser(sess?.user || null));
  return () => { sub.subscription.unsubscribe(); };
}, []);

async function loadFavorites(u: any){
  if (!u) { setFavSet(new Set()); return; }
  const { data } = await supabase.from('favorites').select('card_id');
  setFavSet(new Set((data||[]).map((r:any)=>r.card_id)));
}

  useEffect(()=>{ loadFavorites(user); }, [user]);

  const filtered = useMemo(() => {
    return cards.filter(c => (!filter.section || (c.section||'')===filter.section) && (!filter.topic || (c.topic||'')===filter.topic));
  }, [cards, filter]);

  const sections = useMemo(() => {
    const s: Record<string, Set<string>> = {};
    for (const c of cards) {
      const sec = (c.section||'Без раздела');
      const top = (c.topic||'Без темы');
      if (!s[sec]) s[sec] = new Set();
      s[sec].add(top);
    }
    return s;
  }, [cards]);

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <div className="text-lg font-semibold">Карточки</div>
            <div className="text-sm text-gray-500">Фильтр: {filter.section ? (filter.topic ? `${filter.section} / ${filter.topic}` : filter.section) : 'нет'}</div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-ghost" onClick={()=>setFilter({})}>Сброс</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="card">
          <div className="font-semibold">Разделы/Темы</div>
          <div className="mt-2 space-y-2">
            {Object.entries(sections).map(([sec, topics]) => (
              <div key={sec} className="border rounded-xl p-2">
                <button className="w-full text-left font-medium" onClick={()=>setFilter({section: sec})}>{sec}</button>
                <div className="mt-2 space-y-1 pl-2">
                  {[...topics].map(t => (
                    <button key={sec+t} onClick={()=>setFilter({section: sec, topic: t})} className="w-full text-left text-sm hover:underline">{t}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 space-y-3">
          {filtered.map(c => <FlipCard key={c.id} c={c} user={user} favSet={favSet} setFavSet={setFavSet} setFavOpen={setFavOpen} />)}
          {filtered.length===0 && <div className="text-gray-500">Нет карточек по фильтру.</div>}
        </div>
      </div>
      <AuthEmailModal open={favOpen} onClose={()=>setFavOpen(false)} />
    </div>
  );
}

function FlipCard({ c, user, favSet, setFavSet, setFavOpen }: { c: Card, user:any, favSet:Set<string>, setFavSet: (s:Set<string>)=>void, setFavOpen:(v:boolean)=>void }){
  const [flip, setFlip] = useState(false);
  const dirs = ['left','right','up','down'] as const;
  const [dir, setDir] = useState<typeof dirs[number]>('left');
const [isFav, setIsFav] = useState<boolean>(favSet.has(c.id));
useEffect(()=>{ setIsFav(favSet.has(c.id)); }, [favSet, c.id]);

async function toggleFav(e: any){
  e.stopPropagation();
  if (!user) { setFavOpen(true); return; }
  if (isFav){
    await supabase.from('favorites').delete().eq('card_id', c.id);
    const ns = new Set(Array.from(favSet)); ns.delete(c.id); setFavSet(ns);
  } else {
    await supabase.from('favorites').insert({ card_id: c.id });
    const ns = new Set(Array.from(favSet)); ns.add(c.id); setFavSet(ns);
  }
}

  function doFlip(){
    const d = dirs[Math.floor(Math.random()*dirs.length)];
    setDir(d);
    setFlip(f => !f);
  }
  return (
    <div className={`[perspective:1200px]`} onClick={doFlip}>
      <div className={`relative card p-0 [transform-style:preserve-3d] transition-transform duration-500 ${flip ? (dir==='left'?'[-rotate-y-180]': dir==='right'?'[rotateY(180deg)]': dir==='up'?'[rotateX(180deg)]':'[-rotate-x-180]') : ''}`}>
        {/* front */}
        <div className="card p-4 absolute inset-0 [backface-visibility:hidden]">
          <button onClick={toggleFav} className="absolute top-2 right-2 rounded-full p-1 bg-white/80 hover:bg-white shadow">
            <Heart className="w-5 h-5" fill={isFav ? '#736ecc' : 'none'} color={isFav ? '#736ecc' : '#9ca3af'} />
          </button>
          <div className="text-xs text-gray-500">{(c.section||'Без раздела') + ' / ' + (c.topic||'Без темы')}</div>
          <div className="mt-1 font-medium">{c.front}</div>
          {c.image_url && <img src={c.image_url} className="mt-3 rounded-xl w-full max-h-72 object-contain" />}
          <div className="mt-2 text-[11px] text-gray-500">Нажмите чтобы перевернуть</div>
        </div>
        {/* back */}
        <div className="card p-4 absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="text-gray-800">{c.back}</div>
          {c.cta_text && c.cta_url && <a target="_blank" href={c.cta_url} className="btn btn-primary mt-3 inline-block">{c.cta_text}</a>}
        </div>
      </div>
    </div>
  )
}
