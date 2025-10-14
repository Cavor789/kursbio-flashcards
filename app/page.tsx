export default function Home() {
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Колоды</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <a href="/biology" className="block p-5 rounded-2xl border hover:shadow">
          <div className="text-lg font-medium">Общая биология</div>
          <div className="text-sm text-gray-500 mt-1">Основные разделы, методы, уровни, признаки</div>
        </a>
      </div>
    </main>
  );
}
