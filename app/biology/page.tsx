// app/biology/page.tsx
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Общая биология — Kursbio',
  description: 'Навигация по разделу «Общая биология».',
};

export default function BiologyIndex() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Общая биология — разделы</h1>

      {/* 1 колонка на мобиле, 2 на десктопе */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
        {/* Биология как наука */}
        <Link
          href="/biology/science"
          className="
            w-full md:w-[90%] max-w-[460px]
            h-[40vh]
            rounded-2xl border bg-white shadow-sm hover:shadow-md
            transition-transform duration-300 hover:scale-[1.01]
            p-6 flex flex-col justify-center text-center
          "
        >
          <div className="text-base md:text-sm leading-tight font-medium">
            Биология как наука
          </div>
          <div className="text-sm md:text-xs text-gray-500 mt-2 leading-snug">
            Науки, методы, уровни организации, признаки живого.
          </div>
        </Link>

        {/* Химический состав клетки */}
        <Link
          href="/biology/chemistry"
          className="
            w-full md:w-[90%] max-w-[460px]
            h-[40vh]
            rounded-2xl border bg-white shadow-sm hover:shadow-md
            transition-transform duration-300 hover:scale-[1.01]
            p-6 flex flex-col justify-center text-center
          "
        >
          <div className="text-base md:text-sm leading-tight font-medium">
            Химический состав клетки
          </div>
          <div className="text-sm md:text-xs text-gray-500 mt-2 leading-snug">
            Колоды и карточки по химии клетки.
          </div>
        </Link>
      </div>
    </section>
  );
}
