import { createClient } from "@/utils/supabase/server";
import DeckCard from "@/components/DeckCard";
import FlashcardGrid from "@/components/FlashcardGrid";
import StickyHeader from "@/components/StickyHeader";

export default async function Page() {
  const supabase = createClient();

  const { data: decks, error } = await supabase
    .from("decks")
    .select("*, cards (*)")
    .eq("is_public", true)
    .like("title", "Общая биология → Химический состав клетки%")
    .order("title", { ascending: true });

  if (error) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">Химический состав клетки</h1>
        <div className="rounded-xl border bg-white p-4 text-sm text-red-600">
          Ошибка при загрузке данных. Попробуйте позже.
        </div>
      </section>
    );
  }

  if (!decks || decks.length === 0) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">Химический состав клетки</h1>
        <div className="rounded-xl border bg-white p-4 text-sm text-gray-600">
          Пока пусто. Проверь, что колода создана и доступна публично.
        </div>
      </section>
    );
  }

  // Если есть только одна колода — показать карточки сразу
  if (decks.length === 1) {
    const cards = decks[0].cards || [];

    return (
      <section className="space-y-4">
        <StickyHeader deck={decks[0]} />
        {cards.length === 0 ? (
          <div className="rounded-xl border bg-white p-4 text-sm text-gray-600">
            В этой колоде пока нет карточек.
          </div>
        ) : (
          <FlashcardGrid cards={cards} />
        )}
      </section>
    );
  }

  // Иначе показать список всех колод
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Химический состав клетки — темы</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {decks.map((deck) => <DeckCard key={deck.id} deck={deck} />)}
      </div>
    </section>
  );
}
