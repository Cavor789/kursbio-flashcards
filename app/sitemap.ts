import { supabase } from '@/lib/supabase';

export default async function sitemap() {
  const base = 'https://kursbio-flashcards.vercel.app';
  const { data: cards } = await supabase.from('cards').select('id').limit(5000);
  const cardUrls = (cards || []).map((c:any) => ({
    url: `${base}/card/${c.id}`,
    lastModified: new Date()
  }));
  return [{ url: base, lastModified: new Date() }, ...cardUrls];
}
