import Link from 'next/link';

export default function CardsIndex() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Карточки по темам</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Общая биология */}
        <Link href="/biology" className="block p-5 rounded-2xl border hover:shadow bg-white">
          <div className="text-lg font-medium">Общая биология</div>
          <div className="text-sm text-gray-500 mt-1">
            Внутри: «Биология как наука» и другие разделы.
          </div>
        </Link>

        {/* Место под будущие разделы (ботаника/цитология/анатомия) */}
        {/* <Link href="/botany" className="block p-5 rounded-2xl border hover:shadow bg-white">
          <div className="text-lg font-medium">Ботаника</div>
          <div className="text-sm text-gray-500 mt-1">
            Темы и карточки по ботанике.
          </div>
        </Link> */}
      </div>
    </section>
  );
}
