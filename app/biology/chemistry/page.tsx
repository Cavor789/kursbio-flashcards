import { supabase } from "@/lib/supabase";
import DeckCard from "@/components/DeckCard";
import FlashcardGrid from "@/components/FlashcardGrid";
import StickyHeader from "@/components/StickyHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page() {
  const { data: decks, error } = await supabase
    .from("decks")
    .select("*, cards (*)")
    .eq("is_public", true)
    .like("title", "Общая биология → Химический состав клетки%")
    .order("title", { ascending: true });

  const renderHeader = () => (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <h1 className="text-2xl font-semibold">Химический состав клетки</h1>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/biology">← К списку тем</Link>
        </Button>
        <Button variant="outline" size="sm">Избранное</Button>
        <Button variant="outline" size="sm">Конспект по теме</Button>
        <Button variant="default" size="sm">Записаться на годовой курс</Button>
      </div>
    </div>
  );

  if (error) {
    return (
      <section className="space-y-4">
        {renderHeader()}
        <div className="rounded-xl border bg-white p-4 text-sm text-red-600">
          Ошибка при загрузке данных. Попробуйте позже.
        </div>
      </section>
    );
  }

  if (!decks || decks.length === 0) {
    return (
      <section className="space-y-4">
        {renderHeader()}
        <div className="rounded-xl border bg-white p-4 text-sm text-gray-600">
          Пока пусто. Проверь, что колода создана и доступна публично.
        </div>
      </section>
    );
  }

  if (decks.length === 1) {
    const cards = decks[0].cards || [];

    return (
      <section className="space-y-4">
        {renderHeader()}
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

  return (
    <section className="space-y-4">
      {renderHeader()}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {decks.map((deck) => <DeckCard key={deck.id} deck={deck} />)}
      </div>
    </section>
  );
}
