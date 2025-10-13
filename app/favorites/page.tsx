'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

type Card = {
  id: string; front: string; back: string; image_url: string | null; section: string|null; topic: string|null; cta_text: string|null; cta_url: string|null;
};

type Srs = { reps:number; interval:number; ease:number; due:string };

export default function FavoritesPage(){
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [filter, setFilter] = useState<{section?:string, topic?:string}>({});
  const [study, setStudy] = useState<{active:boolean, queue:Card[], idx:number, flip:boolean, dir:'left'|'right'|'up'|'down'}>({active:false, queue:[], idx:0, flip:false, dir:'left'});
  const [srsMap, setSrsMap] = useState<Record<string, Srs>>({});

  useEffect(()=>{
    supabase.auth.getUser().then(async ({ data }) => {
      if(!data.user){ router.replace('/signin'); return; }
      setUser(data.user);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      if (!sess?.user) router.replace('/signin'); else setUser(sess.user);
    });
    return ()=>{ sub.subscription.unsubscribe(); }
  }, [router]);

  // Load favorites -> cards
  useEffect(()=>{
    (async ()=>{
      if(!user) return;
      const fav = await supabase.from('favorites').select('card_id');
      const ids = (fav.data||[]).map((r:any)=>r.card_id);
      if (ids.length===0){ setCards([]); return; }
      const { data: cardsData } = await supabase.from('cards').select('*').in('id', ids).order('created_at', { ascending: false });
      setCards(cardsData||[]);
    })();
  }, [user]);

  // sections/topics map
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

  const filtered = useMemo(() => {
    return cards.filter(c => (!filter.section || (c.section||'Без раздела')===filter.section) && (!filter.topic || (c.topic||'Без темы')===filter.topic));
  }, [cards, filter]);

  // SRS helpers
  function schedule(prev: Srs|undefined, grade: 0|1|2|3): Srs {
    let reps = prev?.reps ?? 0;
    let interval = prev?.interval ?? 0;
    let ease = prev?.ease ?? 2.5;

    if (grade === 3) ease += 0.15;
    if (grade === 2) ease += 0.0;
    if (grade === 1) ease -= 0.15;
    if (grade === 0) ease -= 0.3;
    ease = Math.max(1.3, Math.min(ease, 3.0));

    if (grade < 2) {
      reps = 0; interval = 1;
    } else {
      if (reps === 0) { interval = grade === 3 ? 3 : 1; reps = 1; }
      else if (reps === 1) { interval = grade === 3 ? 6 : 3; reps = 2; }
      else { interval = Math.round(interval * ease); reps += 1; }
    }
    const due = new Date(); due.setDate(due.getDate() + interval);
    return { reps, interval, ease, due: due.toISOString() };
  }

  async function loadSrsMap(cardIds: string[]) {
    if (!user || cardIds.length===0) return;
    const { data } = await supabase.from('srs_state').select('card_id,reps,interval,ease,due').in('card_id', cardIds);
    const m: Record<string, Srs> = {};
    (data||[]).forEach((r:any)=> m[r.card_id] = { reps:r.reps, interval:r.interval, ease:r.ease, due:r.due });
    setSrsMap(m);
  }

  useEffect(()=>{ loadSrsMap(filtered.map(c=>c.id)); }, [filtered, user]);

  function startStudy(){
    const q = filtered.slice(); // could filter by due later
    if (q.length===0) return;
    setStudy({active:true, queue:q, idx:0, flip:false, dir:'left'});
  }
  function stopStudy(){ setStudy(s=>({ ...s, active:false })); }

  async function grade(g: 0|1|2|3){
    const cur = study.queue[study.idx];
    const prev = srsMap[cur.id];
    const next = schedule(prev, g);
    // upsert in supabase
    await supabase.from('srs_state').upsert({
      card_id: cur.id,
      user_id: user.id,
      reps: next.reps, interval: next.interval, ease: next.ease, due: next.due
    }, { onConflict: 'user_id,card_id' });
    setSrsMap(m => ({ ...m, [cur.id]: next }));
    // next card
    setStudy(s => {
      const nextIdx = s.idx + 1;
      if (nextIdx >= s.queue.length) return { ...s, idx: s.idx, active:false };
      return { ...s, idx: nextIdx, flip:false };
    });
  }

  // flip animation
  const dirs = ['left','right','up','down'] as const;
  function doFlip(){ setStudy(s => ({ ...s, dir: dirs[Math.floor(Math.random()*dirs.length)], flip: !s.flip })); }

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <div className="font-semibold">Избранные карточки</div>
          <div className="text-sm text-gray-500">Ваши сохранённые карточки</div>
          <div className="text-xs text-gray-500 mt-1">Фильтр: {filter.section ? (filter.topic ? `${filter.section} / ${filter.topic}` : filter.section) : 'нет'}</div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={startStudy}>Учить избранное</button>
          <button className="btn btn-ghost" onClick={()=>setFilter({})}>Сброс фильтра</button>
          <Link href="/" className="btn btn-ghost">← На главную</Link>
        </div>
      </div>

      {!study.active && (
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
            {filtered.map(c => <FavCard key={c.id} c={c} />)}
            {filtered.length===0 && <div className="text-gray-500">В избранном по текущему фильтру пусто.</div>}
          </div>
        </div>
      )}

      {study.active && (
        <div className="space-y-3">
          <div className="card flex items-center justify-between">
            <div className="text-sm text-gray-600">Осталось: {study.queue.length - study.idx - 1}</div>
            <div className="flex gap-2">
              <button className="btn btn-ghost" onClick={stopStudy}>Выйти</button>
            </div>
          </div>
          <div className="[perspective:1200px]" onClick={doFlip}>
            <div className={`relative card p-0 [transform-style:preserve-3d] transition-transform duration-500 ${study.flip ? (study.dir==='left'?'[-rotate-y-180]': study.dir==='right'?'[rotateY(180deg)]': study.dir==='up'?'[rotateX(180deg)]':'[-rotate-x-180]') : ''}`}>
              <div className="card p-4 absolute inset-0 [backface-visibility:hidden]">
                {(() => { const c = study.queue[study.idx]; return (
                  <>
                    <div className="text-xs text-gray-500">{(c.section||'Без раздела')+' / '+(c.topic||'Без темы')}</div>
                    <div className="mt-1 font-medium">{c.front}</div>
                    {c.image_url && <img src={c.image_url} className="mt-3 rounded-xl w-full max-h-72 object-contain" />}
                    <div className="mt-2 text-[11px] text-gray-500">Нажмите чтобы перевернуть</div>
                  </>
                )})()}
              </div>
              <div className="card p-4 absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                {(() => { const c = study.queue[study.idx]; return (
                  <>
                    <div className="text-gray-800">{c.back}</div>
                    {c.cta_text && c.cta_url && <a target="_blank" href={c.cta_url} className="btn btn-primary mt-3 inline-block">{c.cta_text}</a>}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button className="btn btn-ghost" onClick={(e)=>{e.stopPropagation(); grade(0);}}>Снова</button>
                      <button className="btn btn-ghost" onClick={(e)=>{e.stopPropagation(); grade(1);}}>Сложно</button>
                      <button className="btn btn-primary" onClick={(e)=>{e.stopPropagation(); grade(2);}}>Хорошо</button>
                      <button className="btn btn-ghost" onClick={(e)=>{e.stopPropagation(); grade(3);}}>Легко</button>
                    </div>
                  </>
                )})()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FavCard({ c }: { c: Card }){
  const [flip, setFlip] = useState(false);
  const dirs = ['left','right','up','down'] as const;
  const [dir, setDir] = useState<typeof dirs[number]>('left');
  function doFlip(){
    const d = dirs[Math.floor(Math.random()*dirs.length)];
    setDir(d);
    setFlip(f => !f);
  }
  return (
    <div className="[perspective:1200px]" onClick={doFlip}>
      <div className={`relative card p-0 [transform-style:preserve-3d] transition-transform duration-500 ${flip ? (dir==='left'?'[-rotate-y-180]': dir==='right'?'[rotateY(180deg)]': dir==='up'?'[rotateX(180deg)]':'[-rotate-x-180]') : ''}`}>
        <div className="card p-4 absolute inset-0 [backface-visibility:hidden]">
          <div className="text-xs text-gray-500">{(c.section||'Без раздела')+' / '+(c.topic||'Без темы')}</div>
          <div className="mt-1 font-medium">{c.front}</div>
          {c.image_url && <img src={c.image_url} className="mt-3 rounded-xl w-full max-h-72 object-contain" />}
          <div className="mt-2 text-[11px] text-gray-500">Нажмите чтобы перевернуть</div>
        </div>
        <div className="card p-4 absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="text-gray-800">{c.back}</div>
          {c.cta_text && c.cta_url && <a target="_blank" href={c.cta_url} className="btn btn-primary mt-3 inline-block">{c.cta_text}</a>}
        </div>
      </div>
    </div>
  )
}
