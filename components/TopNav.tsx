'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function TopNav({ topic }: { topic?: string }) {
  return (
    <header className="bg-[#736ecc] text-white">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          {/* Лого → на главную */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo_2_white.png"
              alt="Kursbio"
              width={140}
              height={40}
              priority
            />
            <span className="sr-only">Kursbio Карточки</span>
          </Link>

          {/* Быстрые ссылки */}
          <nav className="ml-auto flex items-center gap-2">
            <Link href="/cards/bio" className="btn btn-white">Карточки</Link>
            <Link href="/favorites" className="btn btn-white">Избранные</Link>
            <a href="https://t.me/kursbio/11017" target="_blank" rel="noreferrer" className="btn btn-white">
              Конспект
            </a>
            <a href="https://kursbio.com/godege" target="_blank" rel="noreferrer" className="btn btn-white">
              Годовой курс
            </a>
          </nav>
        </div>

        {topic && <div className="mt-2 text-white/80 text-sm">{topic}</div>}
      </div>
    </header>
  );
}
