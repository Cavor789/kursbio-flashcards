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
          {/* ✅ Исправлен путь к логотипу */}
          <Link href="/cards" className="flex items-center gap-3">
            <Image
              src="/logo_2_white.png"
              alt="Kursbio"
              width={140}
              height={40}
              priority
            />
            <span className="sr-only">Kursbio Карточки</span>
          </Link>

          {/* Кнопка "Избранные" */}
          <Link
            href="/favorites"
            className={`ml-2 rounded-xl px-3 py-1.5 text-sm transition ${
              isFavorites
                ? 'bg-white text-[#373737]'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Избранные
          </Link>

          {/* Кнопки справа */}
          <div className="ml-auto flex gap-2">
            <Link href="/biology" className="btn btn-white">
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
