'use client';
import { useEffect, useState } from 'react';
import AuthEmailModal from '@/components/AuthEmailModal';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignInPage(){
  const [open, setOpen] = useState(true);
  const router = useRouter();

  useEffect(()=>{
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace('/favorites');
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      if (sess?.user) router.replace('/favorites');
    });
    return () => { sub.subscription.unsubscribe(); };
  }, [router]);

  return (
    <div className="max-w-lg mx-auto">
      <div className="card">
        <h1 className="text-xl font-semibold">Войдите в аккаунт</h1>
        <p className="text-sm text-gray-600 mt-1">Чтобы просматривать избранные, войдите или зарегистрируйтесь.</p>
      </div>
      <AuthEmailModal open={open} onClose={()=>setOpen(false)} />
    </div>
  );
}
