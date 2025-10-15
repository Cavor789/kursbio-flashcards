// components/HeroGate.tsx
'use client';

import { usePathname } from 'next/navigation';

export default function HeroGate() {
  const pathname = usePathname();
  if (pathname !== '/biology/chemistry') return null;

  return (
    <div className="bg-[#736ecc] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="opacity-80 text-sm">KURSBIO</div>
        <h1 className="text-2xl font-semibold mt-1">Химический состав клетки</h1>
        <div className="mt-4 flex flex-wrap gap-3">
          <a className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/15" href="/cards">Карточки</a>
          {/* оставляем только реально существующие ссылки, чтобы «кнопки работали» */}
          {/* добавите остальные разделы — просто добавьте сюда href-ы */}
          <a className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/15" href="/year">Годовой курс</a>
        </div>
      </div>
    </div>
  );
}
