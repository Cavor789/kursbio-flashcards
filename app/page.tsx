// app/page.tsx
import Link from 'next/link';
import TopNav from '@/components/TopNav';

export default function Home() {
  return (
    <main>
      <TopNav />
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">
        {/* Герой с кнопками */}
        <div className="card">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-lg font-semibold text-white/90">Kursbio Карточки</div>
            <div className="ml-auto flex gap-2">
              {/* Главное изменение: ведём на /biology */}
              <Link href="/biology" className="btn btn-white">Перейти к карточкам</Link>
              <a href="https://t.me/kursbio/11017" target="_blank" rel="noreferrer" className="btn btn-white">Забрать конспект</a>
              <a href="https://kursbio.com/godege" target="_blank" rel="noreferrer" className="btn btn-white">Записаться на годовой курс</a>
              <a href="https://kursbio.com/book" target="_blank" rel="noreferrer" className="btn btn-white">Приобрести конспекты</a>
            </div>
          </div>
        </div>

        {/* Быстрый старт (2 плитки) */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Быстрый старт</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/biology" className="block p-5 rounded-2xl border hover:shadow">
              <div className="text-lg font-medium">Карточки по темам</div>
              <div className="text-sm text-gray-500 mt-1">Общая биология → Биология как наука → темы.</div>
            </Link>
            <Link href="/favorites" className="block p-5 rounded-2xl border hover:shadow">
              <div className="text-lg font-medium">Избранные</div>
              <div className="text-sm text-gray-500 mt-1">Сохраняйте важные карточки — всегда под рукой.</div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
