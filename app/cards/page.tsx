// app/cards/page.tsx
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Карточки — Kursbio',
  description: 'Навигация по карточкам: Общая биология.',
};

export default function CardsIndex() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Карточки — разделы</h1>

      <div className="grid grid-cols-1 gap-6 justify-items-center">
        <Link
          href="/biology"
          className="
            w-full md:w-[90%] max-w-[460px]
            h-[40vh]
            rounded-2xl border bg-white shadow-sm hover:shadow-md
            transition-transform duration-300 hover:scale-[1.01]
            p-6 flex flex-col justify-center text-center
          "
        >
          <div className="text-base md:text-sm leading-tight font-medium">
            Общая биология
          </div>
          <div className="text-sm md:text-xs text-gray-500 mt-2 leading-snug">
            Внутри: «Биология как наука» и «Химический состав клетки».
          </div>
        </Link>
      </div>
    </section>
  );
}
