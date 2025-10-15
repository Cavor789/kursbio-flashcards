import Link from 'next/link';

export const metadata = {
  title: 'Общая биология — разделы | Kursbio',
};

export default function BiologyIndex() {
  return (
    <section className="space-y-6">
      <div className="text-sm text-gray-600">
        <Link href="/cards" className="hover:underline">Карточки</Link>
        <span className="text-gray-400"> / </span>
        <span className="font-medium">Общая биология</span>
      </div>

      <h1 className="text-2xl font-semibold">Общая биология — разделы</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/biology/science" className="block p-5 rounded-2xl border bg-white hover:shadow">
          <div className="text-lg font-medium">Биология как наука</div>
          <div className="text-sm text-gray-500 mt-1">
            Науки, методы, уровни организации, признаки живого.
          </div>
        </Link>

        <Link href="/biology/chemistry" className="block p-5 rounded-2xl border bg-white hover:shadow">
          <div className="text-lg font-medium">Химический состав клетки</div>
          <div className="text-sm text-gray-500 mt-1">
            Вода, соли, органические вещества, аминокислоты и др.
          </div>
        </Link>
      </div>
    </section>
  );
}
