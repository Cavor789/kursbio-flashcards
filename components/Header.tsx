'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-[var(--brand)]/90 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-white font-bold tracking-tight">
          Kursbio Карточки
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/favorites" className="btn btn-ghost !text-white">Избранные</Link>
          <Link href="/admin" className="btn btn-ghost !text-white">Админка</Link>
        </nav>
      </div>
    </header>
  );
}
