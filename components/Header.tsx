'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[#736ecc] text-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        {/* Лого: клик ведёт на главную / */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo_2_white.png"   // файл лежит в /public/logo_2_white.png
            alt="Kursbio"
            width={140}
            height={40}
            priority
          />
          <span className="sr-only">Kursbio Карточки</span>
        </Link>

        {/* Кнопки справа */}
        <nav className="ml-auto flex items-center gap-2">
          <Link href="/cards/bio" className="btn btn-white">Карточки</Link>
          <Link href="/favorites" className="btn btn-white">Избранные</Link>
        </nav>
      </div>
    </header>
  );
}
