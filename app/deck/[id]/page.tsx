'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

/**
 * Эта страница больше не показывает контент.
 * Она мгновенно редиректит с длинного URL /deck/<uuid>
 * на красивый URL /biology/science/<slug>.
 */
export default function DeckIdRedirect() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('decks')
        .select('slug')
        .eq('id', id)
        .single();

      if (data?.slug) {
        router.replace(`/biology/science/${data.slug}`);
      } else {
        router.replace('/biology/science'); // запасной путь
      }
    })();
  }, [id, router]);

  return null;
}
