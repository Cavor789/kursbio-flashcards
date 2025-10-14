'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function TopNav({ topic }: { topic?: string }) {
  return (
    <header className="bg-[#736ecc] text-white">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/cards" className="flex items-center gap-3">
            <Image
              src="/logo-kursbio-white.png"   // файл в /public
              alt="Kursbio"
              width={120}
              height={32}
              priority
            />
            <span className="sr-only">Kursbio Карточки</span>
          </Link>

          <div className="ml-auto flex gap-2">
            <Link href="/cards" className="btn btn-white">Перейти к карточкам</Link>
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
