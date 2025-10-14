'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

type Props = {
  topic?: string;
  showCtas?: boolean; // можно выключать CTA, если понадобится
};

export default function TopNav({ topic, showCtas = true }: Props) {
  const pathname = usePathname();

  // простая проверка активной ссылки
  const isActive = (href: string) => pathname === href;

  return (
    <header className="bg-[#736ecc] text-white">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">

          {/* ЛОГО = ССЫЛКА НА ГЛАВНУЮ (/cards) */}
          <Link
            href="/cards"
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-lg pointer-events-auto"
            aria-label="На главную: Kursbio Карточки"
          >
            <Image
              src="/logo-kursbio-white.png"   // кладём файл в /public/logo-kursbio-white.png
              alt="Kursbio"
              width={120}
              height={32}
              priority
            />
            <span className="sr-only">Kursbio Карточки</span>
          </Link>

          {/* КНОПКА ИЗБРАННЫЕ рядом с логотипом */}
          <Link
            href="/favorites"
            className={`px-3 py-1 rounded-lg hover:bg-white/10 transition ${
              isActive('/favorites') ? 'bg-white/15' : ''
            }`}
          >
            Избранные
          </Link>

          {/* CTA справа */}
          {showCtas && (
            <div className="ml-auto flex gap-2">
              <Link href="/biology" className="btn btn-white">Перейти к карточкам</Link>
              <a href="https://t.me/kursbio/11017" target="_blank" rel="noreferrer" className="btn btn-white">
                Забрать конспект
              </a>
              <a href="https://kursbio.com/godege" target="_blank" rel="noreferrer" className="btn btn-white">
                Записаться на годовой курс
              </a>
              <a href="https://kursbio.com/book" target="_blank" rel="noreferrer" className="btn btn-white">
                Приобрести конспекты
              </a>
            </div>
          )}
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
