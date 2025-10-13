'use client';
import AuthGate from '@/components/AuthGate';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Deck = { id: string; title: string; is_public: boolean };
type Card = { id:string; front:string; back:string; image_url?:string|null; section?:string|null; topic?:string|null; cta_text?:string|null; cta_url?:string|null };

export default function AdminPage(){
  return (
    <AuthGate>
      <AdminInner/>
    </AuthGate>
  )
}

function AdminInner(){
  const [decks, setDecks] = useState<Deck[]>([]);
  const [current, setCurrent] = useState<string|null>(null);
  const [cards, setCards] = useState<Card[]>([]);

  const loadDecks = async () => {
    const { data } = await supabase.from('decks').select('id,title,is_public').order('created_at',{ascending:false});
    setDecks(data||[]);
    if (data && data[0]) setCurrent(d => d ?? data[0].id);
  };
  useEffect(()=>{ loadDecks(); }, []);

  useEffect(()=>{
    (async () => {
      if (!current) return;
      const { data } = await supabase.from('cards').select('*').eq('deck_id', current).order('created_at',{ascending:false});
      setCards(data||[]);
    })();
  }, [current]);

  async function addDeck(){
    const title = prompt('Название колоды:');
    if(!title) return;
    await supabase.from('decks').insert({ title, is_public: true });
    loadDecks();
  }

  async function saveCard(existing?: Card){
    const front = prompt('Лицевая (вопрос):', existing?.front||'')||'';
    const back = prompt('Обратная (ответ):', existing?.back||'')||'';
    const section = prompt('Раздел:', existing?.section||'')||'';
    const topic = prompt('Тема:', existing?.topic||'')||'';
    const image_url = prompt('URL изображения (PNG/JPG):', existing?.image_url||'')||'';
    const cta_text = prompt('CTA текст:', existing?.cta_text||'')||'';
    const cta_url = prompt('CTA ссылка:', existing?.cta_url||'')||'';
    if (existing){
      await supabase.from('cards').update({ front, back, section, topic, image_url, cta_text, cta_url }).eq('id', existing.id);
    } else {
      await supabase.from('cards').insert({ deck_id: current, front, back, section, topic, image_url, cta_text, cta_url });
    }
    const { data } = await supabase.from('cards').select('*').eq('deck_id', current!).order('created_at',{ascending:false});
    setCards(data||[]);
  }

  async function deleteCard(id:string){
    if(!confirm('Удалить карточку?')) return;
    await supabase.from('cards').delete().eq('id', id);
    const { data } = await supabase.from('cards').select('*').eq('deck_id', current!).order('created_at',{ascending:false});
    setCards(data||[]);
  }

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <div className="font-semibold">Админка</div>
          <div className="text-sm text-gray-500">Создание колод и карточек</div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={addDeck}>+ Колода</button>
          <button className="btn btn-ghost" onClick={()=>supabase.auth.signOut()}>Выйти</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="card">
          <div className="font-semibold mb-2">Колоды</div>
          <div className="space-y-2">
            {decks.map(d => (
              <button key={d.id} onClick={()=>setCurrent(d.id)} className={`w-full text-left px-3 py-2 rounded-xl border ${current===d.id?'border-brand bg-indigo-50':'border-gray-200 bg-white'}`}>
                <div className="font-medium">{d.title}</div>
                <div className="text-xs text-gray-500">{d.is_public?'Публичная':'Скрытая'}</div>
              </button>
            ))}
            {decks.length===0 && <div className="text-gray-500 text-sm">Создайте первую колоду</div>}
          </div>
        </div>

        <div className="md:col-span-2 card">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Карточки</div>
            <button className="btn btn-primary" onClick={()=>saveCard()}>+ Карточка</button>
          </div>
          <div className="mt-3 space-y-2">
            {cards.map(c => (
              <div key={c.id} className="border rounded-xl p-3">
                <div className="text-xs text-gray-500">{(c.section||'Без раздела')+' / '+(c.topic||'Без темы')}</div>
                <div className="font-medium">Лицевая: {c.front}</div>
                <div className="text-sm">Обратная: {c.back}</div>
                {c.image_url && <img src={c.image_url} className="mt-2 rounded-lg max-h-40" />}
                <div className="flex gap-2 mt-2">
                  <button className="btn btn-ghost" onClick={()=>saveCard(c)}>✎ Редактировать</button>
                  <button className="btn btn-ghost" onClick={()=>deleteCard(c.id)}>🗑 Удалить</button>
                </div>
              </div>
            ))}
            {cards.length===0 && <div className="text-gray-500">Нет карточек</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
