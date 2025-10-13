'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setUser(sess?.user || null);
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  if (!ready) return <div className="card">Загрузка…</div>;

  if (!user) {
    return <SignIn />;
  }
  return <>{children}</>;
}

function SignIn() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: (typeof window!=='undefined'?window.location.origin:'') + '/admin' } });
    if (!error) setSent(true);
  };
  return (
    <div className="card max-w-md mx-auto">
      <h1 className="text-xl font-semibold">Вход для преподавателя</h1>
      <p className="text-sm text-gray-600 mt-1">Введите почту — пришлём магическую ссылку.</p>
      <input className="mt-3 w-full border rounded-xl px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@kursbio.ru" />
      <button className="btn btn-primary mt-3 w-full" onClick={signIn}>Войти</button>
      {sent && <p className="text-sm text-green-700 mt-2">Ссылка отправлена. Проверьте почту.</p>}
    </div>
  );
}
