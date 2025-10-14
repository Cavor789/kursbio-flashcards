import { supabase } from '@/lib/supabase';

export default async function sitemap() {
  const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kursbio.ru';
  const BP = '/cards';

  const { data: decks } = await supabase.from('decks').select('id, slug, updated_at').order('updated_at', { ascending: false });

  const { data: cards } = await supabase
    .from('cards')
    .select('deck_id, seq, updated_at');

  const deckById: Record<string, { slug: string; updated_at?: string }> =
    Object.fromEntries((decks || []).map((d: any) => [d.id, { slug: d.slug, updated_at: d.updated_at }]));

  const urls = [
    { url: `${BASE}${BP}`, lastModified: new Date() },
    ...(decks || []).map((d: any) => ({
      url: `${BASE}${BP}/biology/science/${d.slug}`,
      lastModified: d.updated_at ? new Date(d.updated_at) : new Date(),
    })),
    ...(cards || []).map((c: any) => ({
      url: `${BASE}${BP}/d/${deckById[c.deck_id]?.slug}/${c.seq}`,
      lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
    })),
  ];

  return urls;
}
