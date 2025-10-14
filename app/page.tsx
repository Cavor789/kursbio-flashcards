export default function Home() {
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Kursbio Карточки</h1>

      <section className="grid gap-4 sm:grid-cols-2">
        <a href="/cards/bio" className="p-5 rounded-2xl border hover:shadow block">
          <div className="text-lg font-medium">Карточки по темам</div>
          <div className="text-sm text-gray-500 mt-1">Общая биология → Биология как наука → 4 темы.</div>
        </a>
        <a href="/favorites" className="p-5 rounded-2xl border hover:shadow block">
          <div className="text-lg font-medium">Избранные</div>
          <div className="text-sm text-gray-500 mt-1">Сохранённые карточки — всегда под рукой.</div>
        </a>
      </section>

      <div className="flex gap-2">
        <a href="/cards/bio" className="btn btn-primary">Перейти к карточкам</a>
        <a href="https://t.me/kursbio/11017" target="_blank" rel="noreferrer" className="btn btn-white">
          Забрать конспект
        </a>
      </div>
    </main>
  );
}
