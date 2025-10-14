'use client';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[#6f69d9] text-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="font-semibold text-lg">Kursbio Карточки</div>
        {/* если понадобятся кнопки — добавим позже; пока ничего не рендерим справа */}
      </div>
    </header>
  );
}
