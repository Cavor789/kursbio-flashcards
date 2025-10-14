'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AuthEmailModal({ open, onClose }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');

  // поля регистрации
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');

  // поля входа
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  if (!open) return null;

  function normalizePhone(v: string) {
    // простая нормализация, чтобы убрать пробелы/скобки/дефисы
    return v.replace(/[^\d+]/g, '');
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    if (!fullName.trim()) return setErr('Введите ФИО');
    if (!email.trim()) return setErr('Введите почту');
    if (!phone.trim()) return setErr('Введите номер телефона');
    if (pass.length < 6) return setErr('Пароль должен быть не короче 6 символов');
    if (pass !== pass2) return setErr('Пароли не совпадают');

    setLoading(true);
    try {
      const cleanPhone = normalizePhone(phone);

      // регистрируем пользователя + кладем ФИО/телефон в user_metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: fullName,
            phone: cleanPhone,
          },
          // при включенном подтверждении почты Supabase отправит письмо
          // emailRedirectTo: 'https://kursbio.ru', // можно указать свой URL
        },
      });
      if (error) throw error;

      const user = data.user;
      if (user) {
        // создаём/обновляем профиль
        await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: fullName,
            phone: cleanPhone,
            email,
          })
          .eq('id', user.id);
      }

      setMsg('Успешно! Проверьте почту для подтверждения (если требуется) и войдите.');
      // при необходимости можно сразу закрывать:
      // onClose();
    } catch (e: any) {
      setErr(e.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignin(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPass,
      });
      if (error) throw error;
      onClose();
    } catch (e: any) {
      setErr(e.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">
            {mode === 'signup' ? 'Регистрация' : 'Вход'}
          </div>
          <button onClick={onClose} className="btn btn-ghost">✕</button>
        </div>

        <div className="mb-3 flex gap-2">
          <button
            className={`btn ${mode === 'signup' ? 'btn-primary' : ''}`}
            onClick={() => setMode('signup')}
          >
            Регистрация
          </button>
          <button
            className={`btn ${mode === 'signin' ? 'btn-primary' : ''}`}
            onClick={() => setMode('signin')}
          >
            Вход
          </button>
        </div>

        {mode === 'signup' ? (
          <form onSubmit={handleSignup} className="space-y-3">
            <div>
              <label className="block text-sm mb-1">ФИО</label>
              <input
                className="input w-full"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Иванов Иван Иванович"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Почта</label>
              <input
                type="email"
                className="input w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Телефон</label>
              <input
                className="input w-full"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 999 123-45-67"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Пароль</label>
              <input
                type="password"
                className="input w-full"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Пароль"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Повторите пароль</label>
              <input
                type="password"
                className="input w-full"
                value={pass2}
                onChange={(e) => setPass2(e.target.value)}
                placeholder="Ещё раз пароль"
                required
                minLength={6}
              />
            </div>

            {err && <div className="text-red-600 text-sm">{err}</div>}
            {msg && <div className="text-green-600 text-sm">{msg}</div>}

            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Подождите…' : 'Зарегистрироваться'}
            </button>

            <div className="text-sm text-center">
              Уже есть аккаунт?{' '}
              <button type="button" className="link" onClick={() => setMode('signin')}>
                Войти
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignin} className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Почта</label>
              <input
                type="email"
                className="input w-full"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Пароль</label>
              <input
                type="password"
                className="input w-full"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="Пароль"
                required
              />
            </div>

            {err && <div className="text-red-600 text-sm">{err}</div>}
            {msg && <div className="text-green-600 text-sm">{msg}</div>}

            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Подождите…' : 'Войти'}
            </button>

            <div className="text-sm text-center">
              Нет аккаунта?{' '}
              <button type="button" className="link" onClick={() => setMode('signup')}>
                Зарегистрироваться
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
