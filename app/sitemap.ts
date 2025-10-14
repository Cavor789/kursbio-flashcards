import { supabase } from '@/lib/supabase';

export default async function sitemap() {
  const base = 'https://kursbio-flashcards.vercel.app';

  const { data: decks } = await supabase
    .from('decks')
    .select('id, slug')
    .not('slug', 'is', null);

  const deckIds = (decks || []).map((d: any) => d.id);
  if (deckIds.length === 0) return [{ url: base, lastModified: new Date() }];

  const { data: cards } = await supabase
    .from('cards')
    .select('deck_id, seq')
    .in('deck_id', deckIds)
    .order('deck_id')
    .order('seq');

  const deckById: Record<string, string> = Object.fromEntries(
    (decks || []).map((d: any) => [d.id, d.slug])
  );

  const cardUrls = (cards || []).map((c: any) => ({
    url: `${base}/d/${deckById[c.deck_id]}/${c.seq}`,
    lastModified: new Date()
  }));

  return [{ url: base, lastModified: new Date() }, ...cardUrls];
}
