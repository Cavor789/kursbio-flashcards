import Link from 'next/link';

export default function BiologyIndex() {
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-sm text-gray-600">
        <Link href="/" className="hover:underline">Колоды</Link>
        <span className="text-gray-400"> / </span>
        <span className="font-medium">Общая биология</span>
      </div>

      <h1 className="text-2xl font-semibold">Общая биология</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <a href="/biology/science" className="block p-5 rounded-2xl border hover:shadow">
          <div className="text-lg font-medium">Биология как наука</div>
          <div className="text-sm text-gray-500 mt-1">Науки, Методы, Уровни организации, Признаки живого</div>
        </a>
      </div>
    </main>
  );
}
