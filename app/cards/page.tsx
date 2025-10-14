export default function CardsIndex() {
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Карточки</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <a href="/cards/bio" className="p-5 rounded-2xl border hover:shadow block">
          <div className="text-lg font-medium">Общая биология</div>
          <div className="text-sm text-gray-500 mt-1">
            Биология как наука → (Науки, Методы, Уровни организации, Признаки)
          </div>
        </a>
        <a href="/favorites" className="p-5 rounded-2xl border hover:shadow block">
          <div className="text-lg font-medium">Избранные</div>
          <div className="text-sm text-gray-500 mt-1">Сохранённые карточки.</div>
        </a>
      </div>
    </section>
  );
}
