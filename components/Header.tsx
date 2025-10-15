// components/Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-[#736ecc] text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link href="/cards" className="flex items-center gap-3">
          <Image
            src="/logo_2_white.png"  // файл лежит в /public
            alt="Kursbio"
            width={110}
            height={32}
            priority
          />
          <span className="sr-only">Kursbio Карточки</span>
        </Link>

        <nav className="ml-auto flex gap-8">
          <Link href="/cards" className="hover:opacity-90">Карточки</Link>
          <Link href="/favorites" className="hover:opacity-90">Избранные</Link>
          <a href="https://kursbio.com/godege" target="_blank" rel="noreferrer" className="hover:opacity-90">
            Годовой курс
          </a>
          <a href="https://kursbio.com/book" target="_blank" rel="noreferrer" className="hover:opacity-90">
            Конспекты
          </a>
        </nav>
      </div>
    </header>
  );
}
