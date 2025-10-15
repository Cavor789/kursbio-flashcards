// components/HeroGate.tsx — КЛИЕНТСКИЙ компонент
'use client';

import { usePathname } from 'next/navigation';

export default function HeroGate() {
  const pathname = usePathname();

  // Баннер только на точном /biology/chemistry
  if (pathname !== '/biology/chemistry') return null;

  // ВСТАВЬ сюда свой текущий JSX фиолетового баннера, если он у тебя отдельным компонентом.
  // Ниже — простая версия, чтобы всё сразу работало.
  return (
    <div className="bg-[#736ecc] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="opacity-80 text-sm">KURSBIO</div>
        <h1 className="text-2xl font-semibold mt-1">Химический состав клетки</h1>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="px-3 py-1 rounded-full bg-white/10">Карточки</span>
          <span className="px-3 py-1 rounded-full bg-white/10">Избранные</span>
          <span className="px-3 py-1 rounded-full bg-white/10">Конспект</span>
          <span className="px-3 py-1 rounded-full bg-white/10">Годовой курс</span>
        </div>
      </div>
    </div>
  );
}
