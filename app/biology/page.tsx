import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BiologyIndex() {
  return (
    <section className="space-y-6">
      <div className="text-sm text-gray-600">
        <Link href="/cards" className="hover:underline">Карточки</Link>
        <span className="text-gray-400"> / </span>
        <span className="font-medium">Общая биология</span>
      </div>

      <h1 className="text-2xl font-semibold">Общая биология — разделы</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Биология как наука */}
        <Link href="/biology/science" className="block p-5 rounded-2xl border hover:shadow bg-white">
          <div className="text-lg font-medium">Биология как наука</div>
          <div className="text-sm text-gray-500 mt-1">
            Науки, Методы, Уровни организации, Признаки живого.
          </div>
        </Link>

        {/* Заглушки под будущие крупные разделы */}
        {/* <Link href="/biology/botany" className="block p-5 rounded-2xl border hover:shadow bg-white">
          <div className="text-lg font-medium">Ботаника</div>
          <div className="text-sm text-gray-500 mt-1">Темы и карточки по ботанике.</div>
        </Link> */}
      </div>
    </section>
  );
}
