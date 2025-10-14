import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kursbio — карточки по биологии, конспекты и годовой курс',
  description:
    'Интерактивные карточки по общей биологии, конспекты и годовой курс подготовки. Учись быстро: уровни организации, методы, признаки живого и науки.',
  alternates: { canonical: 'https://kursbio.ru' },
  openGraph: {
    title: 'Kursbio — карточки по биологии',
    description:
      'Карточки, конспекты и годовой курс. Готовься легко и эффективно.',
    url: 'https://kursbio.ru',
    siteName: 'Kursbio',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kursbio — карточки по биологии',
    description:
      'Карточки, конспекты и годовой курс. Готовься легко и эффективно.',
  },
};

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* HERO */}
      <section className="rounded-3xl bg-gradient-to-r from-[#736ecc] to-[#7d86e1] text-white p-8 sm:p-12 shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
          Kursbio: карточки по биологии, конспекты и годовой курс
        </h1>
        <p className="mt-4 text-white/90 max-w-2xl">
          Учись быстро и без боли. На карточках — вопрос/ответ, в конспектах — только
          нужное, на курсе — системная подготовка.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/cards"
            className="inline-flex items-center gap-2 rounded-xl bg-white text-[#4c3fe5] px-5 py-3 font-medium hover:bg-white/90 transition"
          >
            Перейти к карточкам
          </Link>
          <a
            href="https://t.me/kursbio/11017"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 text-white px-5 py-3 font-medium hover:bg-white/15 transition"
          >
            Забрать конспект
          </a>
          <a
            href="https://kursbio.com/godege"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 text-white px-5 py-3 font-medium hover:bg-white/15 transition"
          >
            Записаться на годовой курс
          </a>
          <a
            href="https://kursbio.com/book"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 text-white px-5 py-3 font-medium hover:bg-white/15 transition"
          >
            Приобрести конспекты
          </a>
        </div>
      </section>

      {/* БЫСТРЫЙ СТАРТ — только 2 плитки */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Быстрый старт</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <QuickLink
            title="Карточки по темам"
            href="/cards/biology/science"
            desc="Науки, методы, уровни организации и признаки живого."
          />
          <QuickLink
            title="Избранные"
            href="/cards/favorites"
            desc="Сохранённые карточки — всегда под рукой."
          />
        </div>
      </section>

      {/* ПРЕИМУЩЕСТВА — тексты с коротким дефисом */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Почему это удобно</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Feature
            title="Быстро запоминаешь"
            text="Активируется зрительная память, а пока вспоминаешь — подключаются образная и словесно-логическая."
          />
          <Feature
            title="Удобная классификация по темам"
            text="С помощью карточек можно быстро повторить любую тему — всё разложено по разделам."
          />
          <Feature
            title="Избранные карточки"
            text="Сохраняй важные карточки и возвращайся к ним в любое время."
          />
        </div>
      </section>

      {/* НИЖНИЙ CTA */}
      <section className="mt-12 rounded-2xl border p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">Готов начать?</div>
            <div className="text-gray-600">
              Открой карточки — и пройдись по темам быстрой волной.
            </div>
          </div>
          <Link
            href="/cards"
            className="inline-flex items-center rounded-xl bg-[#736ecc] text-white px-5 py-3 font-medium hover:opacity-90 transition"
          >
            Перейти к карточкам
          </Link>
        </div>
      </section>
    </main>
  );
}

function QuickLink({
  title,
  href,
  desc,
}: {
  title: string;
  href: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border p-5 hover:shadow-md transition"
    >
      <div className="font-medium">{title}</div>
      <div className="text-sm text-gray-500 mt-1">{desc}</div>
    </Link>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border p-5">
      <div className="font-medium">{title}</div>
      <div className="text-sm text-gray-600 mt-1">{text}</div>
    </div>
  );
}
