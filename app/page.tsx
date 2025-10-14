'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-8">

      {/* Фиолетовый хедер с логотипом и кнопками */}
      <section className="rounded-2xl bg-gradient-to-r from-[#6f66d0] to-[#7a8ae7] text-white p-6">
        <div className="flex items-center gap-4">
          {/* логотип слева */}
          <img
            src="/logo_2_white.png"
            alt="Kursbio"
            className="h-12 w-auto select-none"
            draggable={false}
          />
          <div>
            <div className="text-xl font-semibold">Kursbio Карточки</div>
            <div className="text-sm opacity-90">
              Удобные карточки по темам и избранное — учись быстро и осознанно.
            </div>
          </div>
        </div>

        {/* CTA-кнопки */}
        <div className="mt-4 flex flex-wrap gap-3">
          {/* ВАЖНО: без /cards в href — Next сам добавит basePath */}
          <Link href="/biology/science" className="btn btn-white">
            Перейти к карточкам
          </Link>
          <a href="https://t.me/kursbio/11017" target="_blank" rel="noreferrer" className="btn">
            Забрать конспект
          </a>
          <a href="https://kursbio.com/godege" target="_blank" rel="noreferrer" className="btn">
            Записаться на годовой курс
          </a>
          <a href="https://kursbio.com/book" target="_blank" rel="noreferrer" className="btn">
            Приобрести конспекты
          </a>
        </div>
      </section>

      {/* Быстрый старт — два блока */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Быстрый старт</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/biology/science"
            className="p-5 rounded-2xl border hover:shadow block"
          >
            <div className="text-lg font-medium">Карточки по темам</div>
            <div className="text-sm text-gray-600 mt-1">
              Науки, методы, уровни организации и признаки живого.
            </div>
          </Link>

          <Link
            href="/favorites"
            className="p-5 rounded-2xl border hover:shadow block"
          >
            <div className="text-lg font-medium">Избранные</div>
            <div className="text-sm text-gray-600 mt-1">
              Сохранённые карточки — всегда под рукой.
            </div>
          </Link>
        </div>
      </section>

      {/* Почему это удобно */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Почему это удобно</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border">
            <div className="text-lg font-medium">Быстро запоминаешь</div>
            <div className="text-sm text-gray-600 mt-1">
              Активируется зрительная память, а пока вспоминаешь — подключаются образная и
              словесно-логическая.
            </div>
          </div>

          <div className="p-5 rounded-2xl border">
            <div className="text-lg font-medium">Удобная классификация по темам</div>
            <div className="text-sm text-gray-600 mt-1">
              С помощью карточек можно быстро повторить любую тему — всё разложено по разделам.
            </div>
          </div>

          <div className="p-5 rounded-2xl border">
            <div className="text-lg font-medium">Избранные карточки</div>
            <div className="text-sm text-gray-600 mt-1">
              Сохраняй важные карточки и возвращайся к ним в любое время.
            </div>
          </div>
        </div>
      </section>

      {/* Финальный CTA */}
      <section className="rounded-2xl border p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-lg font-semibold">Готов начать?</div>
          <div className="text-sm text-gray-600">
            Открой карточки — и пройдись по темам быстрой волной.
          </div>
        </div>
        <Link href="/biology/science" className="btn btn-primary">
          Перейти к карточкам
        </Link>
      </section>
    </main>
  );
}
