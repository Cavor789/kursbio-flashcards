'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthEmailModal({ open, onClose }: { open:boolean, onClose:()=>void }){
  const [mode, setMode] = useState<'signin'|'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(){
    setLoading(true); setError(null);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      onClose();
    } catch(e:any){
      setError(e?.message || 'Ошибка');
    } finally { setLoading(false); }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="card max-w-sm w-full">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{mode==='signup'?'Регистрация':'Вход'}</div>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>
        <p className="text-sm text-gray-600 mt-1">Создайте аккаунт, чтобы сохранять избранные карточки.</p>
        <div className="mt-3 space-y-2">
          <input className="w-full border rounded-xl px-3 py-2" placeholder="Электронная почта" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full border rounded-xl px-3 py-2" placeholder="Пароль" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
        <div className="mt-3 flex gap-2">
          <button className="btn btn-primary w-full" onClick={submit} disabled={loading}>{loading?'...':'Продолжить'}</button>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {mode==='signup' ? (
            <>Уже есть аккаунт? <button className="btn-link" onClick={()=>setMode('signin')}>Войти</button></>
          ) : (
            <>Нет аккаунта? <button className="btn-link" onClick={()=>setMode('signup')}>Зарегистрироваться</button></>
          )}
        </div>
      </div>
    </div>
  )
}
