// app/biology/page.tsx
import Link from 'next/link';
import TopNav from '@/components/TopNav';

export const dynamic = 'force-dynamic';

export default async function BiologyIndex() {
  return (
    <main>
      <TopNav />
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="text-sm text-gray-600">
          <Link href="/" className="hover:underline">Колоды</Link>
          <span className="text-gray-400"> / </span>
          <span className="font-medium">Общая биология</span>
        </div>

        <h1 className="text-2xl font-semibold">Общая биология — разделы</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Раздел «Биология как наука» */}
          <Link href="/biology/science" className="block p-5 rounded-2xl border hover:shadow">
            <div className="text-lg font-medium">Биология как наука</div>
            <div className="text-sm text-gray-500 mt-1">
              Внутри: Науки, Методы, Уровни организации, Признаки живого.
            </div>
          </Link>

          {/* Места под будущие разделы */}
          {/* <Link href="/biology/botany" className="block p-5 rounded-2xl border hover:shadow">
            <div className="text-lg font-medium">Ботаника</div>
            <div className="text-sm text-gray-500 mt-1">Темы и карточки по ботанике.</div>
          </Link> */}
        </div>
      </div>
    </main>
  );
}
