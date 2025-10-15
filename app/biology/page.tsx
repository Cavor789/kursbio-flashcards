import Link from 'next/link';

export const metadata = {
  title: 'Общая биология — Kursbio',
  description: 'Навигация по разделу «Общая биология».',
};

export default function BiologyIndex() {
  return (
    <section className="space-y-6">
      {/* Хлебные крошки */}
      <div className="text-sm text-gray-600">
        <Link href="/cards" className="hover:underline">Карточки</Link>
        <span className="text-gray-400"> / </span>
        <span className="font-medium">Общая биология</span>
      </div>

      {/* Заголовок раздела (единственный) */}
      <h1 className="text-2xl font-semibold">Общая биология — разделы</h1>

      {/* Сетка карточек: 1 колонка на мобиле, 3 на десктопе */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
        {/* Карточка 1 */}
        <Link
          href="/biology/science"
          className="
            w-full md:w-[90%] max-w-[460px]
            h-[70vh]
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

        {/* Карточка 2 */}
        <Link
          href="/biology/chemistry"
          className="
            w-full md:w-[90%] max-w-[460px]
            h-[70vh]
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

        {/* Заглушка под будущие разделы — можно удалить/добавить новые */}
        <Link
          href="/biology/next"
          className="
            w-full md:w-[90%] max-w-[460px]
            h-[70vh]
            rounded-2xl border bg-white shadow-sm hover:shadow-md
            transition-transform duration-300 hover:scale-[1.01]
            p-6 flex flex-col justify-center text-center
          "
        >
          <div className="text-base md:text-sm leading-tight font-medium">
            (Скоро) Следующий раздел
          </div>
          <div className="text-sm md:text-xs text-gray-500 mt-2 leading-snug">
            Добавьте новый подраздел сюда.
          </div>
        </Link>
      </div>
    </section>
  );
}
