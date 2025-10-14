'use client';

type Deck = {
  id: string;
  title: string;
  description: string | null;
  cta_primary_text: string | null;
  cta_primary_url: string | null;
  cta_secondary_text: string | null;
  cta_secondary_url: string | null;
};

export default function DeckHeader({ deck }: { deck: Deck }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
      <div>
        <h1 className="text-2xl font-semibold">{deck.title}</h1>
        {deck.description && (
          <p className="text-sm opacity-70">{deck.description}</p>
        )}
      </div>

      <div className="flex gap-2">
        {deck.cta_primary_url && deck.cta_primary_text && (
          <a
            href={deck.cta_primary_url}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-2xl shadow hover:shadow-md transition"
          >
            {deck.cta_primary_text}
          </a>
        )}
        {deck.cta_secondary_url && deck.cta_secondary_text && (
          <a
            href={deck.cta_secondary_url}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-2xl border hover:shadow-sm transition"
          >
            {deck.cta_secondary_text}
          </a>
        )}
      </div>
    </div>
  );
}
