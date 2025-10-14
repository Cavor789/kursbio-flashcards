import Link from 'next/link';

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-10">
      {/* Герой */}
      <section className="bg-[#736ecc] text-white rounded-2xl p-6 text-center shadow-md">
        <h1 className="text-2xl font-semibold mb-2">Kursbio Карточки</h1>
        <p className="text-sm text-white/90 mb-4">
          Удобные карточки по темам и избранное — учись быстро и осознанно.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/cards" className="btn btn-white">
            Перейти к карточкам
          </Link>
          <a
            href="https://t.me/kursbio/11017"
            target="_blank"
            rel="noreferrer"
            className="btn btn-white"
          >
            Забрать конспект
          </a>
          <a
            href="https://kursbio.com/godege"
            target="_blank"
            rel="noreferrer"
            className="btn btn-white"
          >
            Записаться на годовой курс
          </a>
          <a
            href="https://kursbio.com/book"
            target="_blank"
            rel="noreferrer"
            className="btn btn-white"
          >
            Приобрести конспекты
          </a>
        </div>
      </section>

      {/* Быстрый старт */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Быстрый старт</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card">
            <div className="font-medium">Карточки по темам</div>
            <p className="text-sm text-gray-600">
              Науки, методы, уровни организации и признаки живого.
            </p>
          </div>
          <div className="card">
            <div className="font-medium">Избранные</div>
            <p className="text-sm text-gray-600">
              Сохранённые карточки — всегда под рукой.
            </p>
          </div>
        </div>
      </section>

      {/* Почему это удобно */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Почему это удобно</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card">
            <div className="font-medium">Быстро запоминаешь</div>
            <p className="text-sm text-gray-600">
              Активируется зрительная память, а при вспоминании — словесно-логическая.
            </p>
          </div>
          <div className="card">
            <div className="font-medium">Удобная классификация по темам</div>
            <p className="text-sm text-gray-600">
              Повторяй любую тему — всё разложено по разделам.
            </p>
          </div>
          <div className="card">
            <div className="font-medium">Избранные карточки</div>
            <p className="text-sm text-gray-600">
              Сохраняй важные карточки и возвращайся к ним в любое время.
            </p>
          </div>
        </div>
      </section>

      {/* Готов начать */}
      <section className="text-center">
        <h2 className="text-xl font-semibold mb-2">Готов начать?</h2>
        <p className="text-sm text-gray-600 mb-4">
          Открой карточки — и пройдись по темам быстрой волной.
        </p>
        <Link href="/cards" className="btn btn-primary">
          Перейти к карточкам
        </Link>
      </section>
    </main>
  );
}
