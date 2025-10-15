import { supabase } from "@/lib/supabase";
import DeckCard from "@/components/DeckCard";

export default async function Page() {
  const { data: list, error } = await supabase
    .from("decks")
    .select("*")
    .eq("is_public", true)
    .like("title", "Общая биология → Биология как наука%")
    .order("title", { ascending: true });

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Биология как наука — темы</h1>

      {error && (
        <div className="rounded-xl border bg-white p-4 text-sm text-red-600">
          Не удалось загрузить данные. Попробуйте позже.
        </div>
      )}

      {list && list.length === 0 && (
        <div className="rounded-xl border bg-white p-4 text-sm text-gray-600">
          Пока пусто. Проверь, что нужные колоды созданы и доступны публично.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list?.map((deck) => <DeckCard key={deck.id} deck={deck} />)}
      </div>
    </section>
  );
}
