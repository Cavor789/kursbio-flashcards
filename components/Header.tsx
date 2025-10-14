'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-[#736ecc] text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link href="/cards" className="flex items-center gap-3">
          <Image
            src="/logo_2_white.png"
            alt="Kursbio"
            width={120}
            height={32}
            priority
          />
          <span className="sr-only">Kursbio Карточки</span>
        </Link>

        <nav className="ml-auto flex flex-wrap gap-2">
          <Link href="/cards" className="btn btn-white">Карточки</Link>
          <Link href="/favorites" className="btn btn-white">Избранные</Link>
          <a href="https://t.me/kursbio/11017" target="_blank" rel="noreferrer" className="btn btn-white">
            Конспект
          </a>
          <a href="https://kursbio.com/godege" target="_blank" rel="noreferrer" className="btn btn-white">
            Годовой курс
          </a>
        </nav>
      </div>
    </header>
  );
}
