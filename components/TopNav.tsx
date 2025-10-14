'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function TopNav({ topic }: { topic?: string }) {
  const pathname = usePathname();
  const isFavorites = pathname?.startsWith('/favorites');

  return (
    <header className="bg-[#736ecc] text-white">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          {/* Бренд: логотип + текст. ВЕСЬ блок — ссылка на главную */}
          <Link href="/" className="group flex items-center gap-3">
            <Image
              src="/logo-kursbio-white.png"
              alt="Kursbio"
              width={120}
              height={32}
              priority
            />
            <span className="text-white/95 font-medium tracking-tight group-hover:opacity-90">
              Kursbio Карточки
            </span>
          </Link>

          {/* Кнопка Избранное сразу справа от бренда */}
          <Link
            href="/favorites"
            className={`ml-2 rounded-xl px-3 py-1.5 text-sm transition
              ${isFavorites ? 'bg-white text-[#373737]' : 'bg-white/10 text-white hover:bg-white/20'}`}
            aria-current={isFavorites ? 'page' : undefined}
          >
            Избранное
          </Link>

          {/* Правые CTA */}
          <div className="ml-auto flex gap-2">
            <Link href="/" className="btn btn-white">Перейти к карточкам</Link>
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
        </div>

        {topic && (
          <div className="mt-2 text-white/80 text-sm">
            {topic}
          </div>
        )}
      </div>
    </header>
  );
}
