'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full shadow-sm bg-gradient-to-r from-brand to-indigo-400 text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">Kursbio Cards</Link>
        <nav className="flex gap-2">
          <Link href="/favorites" className="btn btn-ghost !bg-white/10 !border-white/20 text-white">Избранные</Link>
          <Link href="/admin" className="btn btn-ghost !bg-white/10 !border-white/20 text-white">Админка</Link>
        </nav>
      </div>
    </header>
  );
}
